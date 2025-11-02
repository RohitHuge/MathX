import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Client, Databases, Query } from 'appwrite';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAuth } from '../../contexts/AuthContext';
import { useContestScore } from '../../hooks/useContestScore';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Maximize2, 
  Eye, 
  EyeOff,
  RotateCcw,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../../config.js';
import { supabase } from '../../config/supabaseClient.js';
import Toast from '../../components/landing/Toast';

// Appwrite configuration
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const databases = new Databases(client);

// Local error boundary to prevent markdown/math crashes from breaking the page
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      const fallbackText = typeof this.props.fallback === 'string' ? this.props.fallback : '';
      return <span>{fallbackText}</span>;
    }
    return this.props.children;
  }
}

const Markdown = ({ text }) => {
  const normalizeMathDelimiters = (input) => {
    if (typeof input !== 'string') return '';
    // Convert \( ... \) to $ ... $ and \[ ... \] to $$ ... $$ for remark-math
    let s = input
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$');
    // If no $ present but LaTeX commands exist, auto-wrap inline
    if (!/[\$]/.test(s) && /\\[a-zA-Z]+/.test(s)) {
      s = `$${s}$`;
    }
    return s;
  };

  const safeText = normalizeMathDelimiters(text);
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkMath, { singleDollar: true }]]}
      rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
    >
      {safeText}
    </ReactMarkdown>
  );
};

const ContestPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const forceStart = new URLSearchParams(location.search).get('forceStart') === '1';
  const { loading: scoreLoading, error: scoreError, getUserContestScore, startContest, submitContest } = useContestScore();
  
  // State management
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestStarted, setContestStarted] = useState(false);
  const [contestEnded, setContestEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingScore, setExistingScore] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Anti-cheating state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitched, setTabSwitched] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showContestInstructions, setShowContestInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  const contestRef = useRef(null);
  const timerRef = useRef(null);
  const workerRef = useRef(null);

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  // Calculate current score quickly for auto-save
  const calculateCurrentScore = () => {
    let totalScore = 0;
    questions.forEach(q => {
      const userAnswer = answers[q.$id];
      if (userAnswer === q.answer) {
        totalScore += q.marks;
      }
    });
    return totalScore;
  };

  // Helpers
  const getContestDurationMs = (durationMinutes) => {
    // Accept numbers or strings like "20" or "20 minutes"
    let n = Number(durationMinutes);
    if (!Number.isFinite(n)) {
      const match = String(durationMinutes || '').match(/\d+/);
      if (match) n = Number(match[0]);
    }
    return Number.isFinite(n) && n > 0 ? n * 60 * 1000 : 0;
  };

  // Request fullscreen (with vendor prefixes)
  const requestFullscreen = async () => {
    try {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      if (req) {
        const result = req.call(el);
        if (result && typeof result.then === 'function') {
          await result;
        }
        setIsFullscreen(true);
        showToast('Fullscreen enabled. Contest is now secure.', 'success');
      } else {
        showToast('Fullscreen API not supported in this browser', 'warning');
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      showToast('Please enable fullscreen for the contest', 'warning');
    }
  };

  // Anti-cheating event listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && contestStarted && !contestEnded) {
        setViolationCount(prev => prev + 1);
        setShowWarning(true);
        showToast('Please return to fullscreen mode', 'warning');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && contestStarted && !contestEnded) {
        setTabSwitched(true);
        setViolationCount(prev => prev + 1);
        showToast('Do not switch tabs during the contest', 'warning');
      }
    };

    const handleKeyDown = (e) => {
      // Disable copy/paste shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        showToast('Copy/paste is disabled during the contest', 'warning');
      }
      
      // Disable F12, Ctrl+Shift+I, etc.
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        showToast('Developer tools are disabled during the contest', 'warning');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      showToast('Right-click is disabled during the contest', 'warning');
    };

    // Fallback: detect exit from fullscreen by size changes
    const handleWindowResize = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      const approxFull = Math.abs(window.innerHeight - screen.height) < 5 && Math.abs(window.innerWidth - screen.width) < 5;
      if (!isCurrentlyFullscreen && !approxFull && contestStarted && !contestEnded) {
        setIsFullscreen(false);
        setViolationCount(prev => prev + 1);
        setShowWarning(true);
        showToast('Please return to fullscreen mode', 'warning');
      }
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [contestStarted, contestEnded]);

  // Auto-submit when violations reach threshold (3)
  useEffect(() => {
    if (contestStarted && !contestEnded && violationCount >= 3) {
      setShowWarning(false);
      handleAutoSubmit();
    }
  }, [violationCount, contestStarted, contestEnded]);

  // Fetch contest and questions
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setLoading(true);
        
        // Fetch contest details
        const contestResponse = await databases.getDocument(
          appwriteDatabaseId,
          'contest_info',
          contestId
        );
        
        setContest(contestResponse);
        
        // Fetch questions
        const questionsResponse = await databases.listDocuments(
          appwriteDatabaseId,
          'questions',
          [Query.equal('contest_id', contestId)]
        );
        
        setQuestions(questionsResponse.documents);
        
        // Check if contest has started
        const now = new Date();
        const startTime = new Date(contestResponse.startTime);
        const contestDuration = getContestDurationMs(contestResponse.contestDuration);
        const endTime = new Date(startTime.getTime() + contestDuration);
        
        if (now < startTime && !forceStart) {
          // Contest hasn't started yet
          console.log('[Contest] Not started yet. Now < startTime', { now: now.toISOString(), startTime: startTime.toISOString() });
          setShowInstructions(true);
          setLoading(false);
          return;
        }
        
        if (now > endTime && !forceStart) {
          // Contest has ended
          console.log('[Contest] Already ended. Now > endTime', { now: now.toISOString(), endTime: endTime.toISOString() });
          setContestEnded(true);
          setLoading(false);
          return;
        }
        if (forceStart) {
          console.log('[Contest] DEV forceStart=1 - bypassing schedule checks');
          setContestEnded(false);
        }
        // Fresh start path: show contest instructions
        setShowContestInstructions(true);
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching contest data:', error);
        setError('Failed to load contest. Please try again.');
        setLoading(false);
      }
    };

    if (contestId) {
      fetchContestData();
    }
  }, [contestId]);

  const initTimerWithWorker = (durationMs) => {
    try {
      if (!durationMs || durationMs <= 0) { console.log('[Timer] Not initializing: duration invalid', durationMs); return; }
      // terminate existing, if any
      if (workerRef.current) {
        console.log('[Timer] Existing worker found. Terminating before init.');
        try { workerRef.current.terminate(); } catch {}
        workerRef.current = null;
      }
      console.log('[Timer] Creating worker with durationMs:', durationMs);
      workerRef.current = new Worker(new URL('../../workers/timerWorker.js', import.meta.url));
      setTimeRemaining(durationMs);
      const endAtLocal = new Date(Date.now() + durationMs);
      setEndAt(endAtLocal);
      console.log('[Timer] Posting start to worker');
      workerRef.current.postMessage({ command: 'start', duration: durationMs });
      workerRef.current.onmessage = (e) => {
        if (e?.data?.type === 'tick') {
          console.log('[Timer] tick from worker, remaining(ms):', e.data.remaining);
          setTimeRemaining(Math.max(0, e.data.remaining));
        }
        if (e?.data?.type === 'end') {
          console.log('[Timer] end from worker');
          handleAutoSubmit();
        }
      };
      workerRef.current.onerror = (ev) => {
        console.error('[Timer] worker error:', ev.message || ev);
      };
    } catch (err) {
      console.error('[Timer] Worker failed to initialize:', err);
    }
  };

  // Web Worker based countdown timer
  useEffect(() => {
    if (!contestStarted) { console.log('[Timer] Skipping init: contest not started'); return; }
    if (contestEnded) { console.log('[Timer] Skipping init: contest ended'); return; }
    if (isSubmitted) { console.log('[Timer] Skipping init: already submitted'); return; }
    const durationMs = contest ? getContestDurationMs(contest.contestDuration) : 0;
    if (!durationMs) { console.log('[Timer] Skipping init: invalid duration'); return; }
    initTimerWithWorker(durationMs);
    return () => {
      if (workerRef.current) {
        console.log('[Timer] Terminating worker');
        try { workerRef.current.terminate(); } catch (e) { console.error('[Timer] terminate error:', e); }
        workerRef.current = null;
      }
    };
  }, [contestStarted, contestEnded, isSubmitted, contest]);

  // Format time remaining
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Calculate score
  const calculateScore = () => {
    let totalScore = 0;
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.$id];
      if (userAnswer === question.answer) {
        totalScore += question.marks;
        correctAnswers++;
      }
    });
    
    return {
      totalScore,
      correctAnswers,
      totalQuestions: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  // Auto submit when time's up
  const handleAutoSubmit = async () => {
    if (isSubmitted) return;
    console.log('[Submit][AUTO] Triggered auto-submit');
    await handleSubmit(true);
  };

  // Manual submission to finalize contest
  const handleSubmit = async (isAuto = false) => {
    try {
      if (!user || !contestId) return;
      if (isSubmitted) return;

      // Stop worker to avoid double trigger
      if (workerRef.current) {
        try { workerRef.current.terminate(); } catch {}
        workerRef.current = null;
        console.log('[Submit] Worker terminated before final submit');
      }

      // Snapshot for debugging
      const answersSnapshot = { ...answers };
      const qCount = Array.isArray(questions) ? questions.length : 0;
      const selectedCount = Object.keys(answersSnapshot).length;
      const finalScoreQuick = calculateCurrentScore();
      const finalScoreData = calculateScore();
      console.log('[Submit] Snapshot', { isAuto, qCount, selectedCount, finalScoreQuick, finalScoreData });

      // Prevent duplicate submissions by flipping local flags early
      setIsSubmitted(true);
      setContestEnded(true);

      // Read current semi_score to guard against any last-moment tick differences
      const { data: existingRows, error: readErr } = await supabase
        .from('scores')
        .select('semi_score')
        .eq('user_id', user.$id)
        .eq('contest_id', contestId);
      if (readErr) {
        console.warn('[Submit] Could not read semi_score before finalize:', readErr);
      }
      const semi = Array.isArray(existingRows) && existingRows.length ? Number(existingRows[0].semi_score || 0) : 0;
      const finalToStore = Math.max(Number(finalScoreQuick || 0), Number(semi || 0));
      console.log('[Submit] Final store value (max of quick and semi):', { finalScoreQuick, semi, finalToStore });

      // Reflect the stored score in UI results
      setScore({ ...finalScoreData, totalScore: finalToStore });

      const { error: upErr } = await supabase
        .from('scores')
        .update({
          score: finalToStore,
          end_time: new Date().toISOString(),
        })
        .eq('user_id', user.$id)
        .eq('contest_id', contestId);

      if (upErr) {
        console.error('Final submit error:', upErr);
        showToast('Failed to submit results. Please try again.', 'error');
        return;
      }

      showToast(isAuto ? "Time's up! Contest submitted automatically ⏱️" : 'Contest submitted successfully ✅', 'success');
      console.log('🧮 Final score submitted', { auto: isAuto, scoreQuick: finalScoreQuick, semi, stored: finalToStore, detailed: finalScoreData.totalScore });
    } catch (e) {
      console.error('Submission error:', e);
      showToast('Error submitting results', 'error');
    }
  };

  // Open confirmation before manual submit
  const openSubmitConfirm = () => {
    if (isSubmitted) return;
    setShowSubmitConfirm(true);
  };

  // Confirm modal action
  const handleConfirmSubmit = async () => {
    if (isSubmitted) return;
    await handleSubmit(false);
  };

  // 20s semi-score auto-updater
  useEffect(() => {
    if (!user || !contestStarted || contestEnded || isSubmitted) return;
    const interval = setInterval(() => {
      saveSemiScore();
    }, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, contestStarted, contestEnded, isSubmitted, answers, questions]);

  const saveSemiScore = async () => {
    try {
      if (!user || !contestId) return;
      if (isSubmitted || contestEnded) return;
      const currentScore = calculateCurrentScore();
      setIsSaving(true);
      const { error: semiErr } = await supabase
        .from('scores')
        .update({
          semi_score: currentScore,
          semi_time: new Date().toISOString(),
        })
        .eq('user_id', user.$id)
        .eq('contest_id', contestId);
      setIsSaving(false);
      if (semiErr) {
        console.error('Semi-score update error:', semiErr);
        return;
      }
      const stamp = new Date().toLocaleTimeString();
      showToast(`✅ Semi-score updated at ${stamp}`, 'success');
      console.log('✅ Semi-score updated', { at: stamp, score: currentScore });
    } catch (e) {
      setIsSaving(false);
      console.error('Semi-score exception:', e);
    }
  };

  // Supabase Realtime listener for auto-submission by backend
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('auto-submit-listener')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scores', filter: `user_id=eq.${user.$id}` },
        (payload) => {
          const updated = payload.new;
          if (updated && updated.end_time && !isSubmitted) {
            setIsSubmitted(true);
            setContestEnded(true);
            showToast('⚡ Submission finalized via Realtime', 'info');
            console.log('⚡ Submission finalized via Realtime payload', updated);
          }
        }
      )
      .subscribe();
    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSubmitted]);

  // Handle refresh for pre-contest
  const handleRefresh = () => {
    window.location.reload();
  };

  const scheduleAutoSubmit = async (userId, contestId, contestDurationSeconds) => {
  try {
    const { data, error } = await supabase.functions.invoke('autoSubmit', {
      body: {
        user_id: userId,
        contest_id: contestId,
        contest_duration: contestDurationSeconds,
      },
    });
    if (error) throw error;
    console.log(`✅ AutoSubmit scheduled for ${contestId}, waiting ${contestDurationSeconds + 10}s`, data);
  } catch (err) {
    console.error("❌ Could not call autoSubmit Edge Function:", err);
  }
};

  // Handle accepting contest instructions and requesting fullscreen
  const handleAcceptInstructions = async () => {

    const existing = await getUserContestScore(contestId, user.$id);
    if (existing) {
      if (existing.end_time) {
        showToast('You have already completed this contest!', 'error');
        return;
      } else {
        showToast('You have already started this contest.', 'warning');
        return;
      }
    }

    try {
      if (!user) {
        showToast('Please login to start the contest', 'error');
        return;
      }
      
      await requestFullscreen();
      const now = new Date();
      // Optionally ensure a score record exists; ignore if it already exists
      try { await startContest(contestId, user.$id); } catch (e) { /* ignore duplicate */ }
      // Always start fresh timer for full duration
      const durationMs = contest ? getContestDurationMs(contest.contestDuration) : 0;
      if (durationMs > 0) {
        setTimeRemaining(durationMs);
        setEndAt(new Date(now.getTime() + durationMs));
      }
      // Fire-and-forget: schedule backend auto-submit (does not block UI)
      try {
        const contestDurationSeconds = Math.max(1, Math.round(durationMs / 1000));
        console.log('[Contest] Calling scheduleAutoSubmit with', { userId: user.$id, contestId, contestDurationSeconds });
        scheduleAutoSubmit(user.$id, contestId, contestDurationSeconds);
      } catch (e) {
        console.warn('[Contest] scheduleAutoSubmit error (non-blocking):', e);
      }
      // Ensure fresh state so timer effect doesn't skip
      setIsSubmitted(false);
      setContestEnded(false);
      setStartTime(now);
      console.log('[Contest] Start clicked. Starting fresh session with durationMs:', durationMs, 'contest:', contest);
      setContestStarted(true);
      // start immediately
      initTimerWithWorker(durationMs);
      setShowContestInstructions(false);
    } catch (error) {
      console.error('Error starting contest:', error);
      showToast('Failed to start contest. Please try again.', 'error');
    }
  };

  // Handle fullscreen violation - restart fullscreen
  const handleRestartFullscreen = async () => {
    setShowWarning(false);
    await requestFullscreen();
  };

  // Handle exit contest
  const handleExitContest = async () => {
    setShowWarning(false);
    
    // Calculate score with current answers
    if (contest && contest.questions) {
      let correctAnswers = 0;
      let totalQuestions = contest.questions.length;
      let answeredQuestions = 0;
      
      contest.questions.forEach(question => {
        const userAnswer = answers[question.$id];
        if (userAnswer) {
          answeredQuestions++;
          if (userAnswer === question.answer) {
            correctAnswers++;
          }
        }
      });
      
      const finalScore = answeredQuestions > 0 
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
        
      setScore({
        correct: correctAnswers,
        total: totalQuestions,
        percentage: finalScore,
        answered: answeredQuestions
      });
    } else {
      // No contest data, set default score
      setScore({
        correct: 0,
        total: 0,
        percentage: 0,
        answered: 0
      });
    }
    
    setContestEnded(true);
    showToast('Contest exited by user', 'warning');
  };

  // Handle question navigation
  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Get question status for navigation buttons
  const getQuestionStatus = (questionId) => {
    if (answers[questionId]) {
      return 'answered'; // User has answered this question
    }
    return 'unanswered'; // User hasn't answered this question
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49E3FF] mx-auto mb-4"></div>
          <p className="text-white">Loading contest...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-[#AEAEAE] mb-4">{error}</p>
          <button
            onClick={() => navigate('/contests')}
            className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-medium"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  // Pre-contest instructions modal
  if (showInstructions && contest) {
    const startTime = new Date(contest.startTime);
    const now = new Date();
    const timeUntilStart = startTime.getTime() - now.getTime();
    
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center p-4">
        <motion.div
          className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-8 max-w-2xl w-full backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-[#49E3FF] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
            <p className="text-[#AEAEAE]">{contest.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <Clock className="w-6 h-6 text-[#49E3FF] mx-auto mb-2" />
              <p className="text-white font-semibold">Start Time</p>
              <p className="text-[#AEAEAE] text-sm">{startTime.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Clock className="w-6 h-6 text-[#A146D4] mx-auto mb-2" />
              <p className="text-white font-semibold">Duration</p>
              <p className="text-[#AEAEAE] text-sm">{contest.contestDuration} minutes</p>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Instructions</h3>
            <ul className="text-[#AEAEAE] text-sm space-y-1">
              <li>• Contest will be conducted in fullscreen mode</li>
              <li>• Copy/paste and right-click are disabled</li>
              <li>• Do not switch tabs or exit fullscreen</li>
              <li>• Contest will auto-submit when time expires</li>
              <li>• Each question has only one correct answer</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-white mb-4">
              Contest starts in: <span className="text-[#49E3FF] font-bold">
                {Math.max(0, Math.floor(timeUntilStart / 1000))} seconds
              </span>
            </p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Refresh to Start Contest
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Contest instructions modal (shown when contest starts)
  if (showContestInstructions && contest) {
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center p-4">
        <motion.div
          className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-8 max-w-2xl w-full backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-[#49E3FF] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
            <p className="text-[#AEAEAE]">{contest.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <Clock className="w-6 h-6 text-[#49E3FF] mx-auto mb-2" />
              <p className="text-white font-semibold">Duration</p>
              <p className="text-[#AEAEAE] text-sm">{contest.contestDuration} minutes</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Clock className="w-6 h-6 text-[#A146D4] mx-auto mb-2" />
              <p className="text-white font-semibold">Questions</p>
              <p className="text-[#AEAEAE] text-sm">{contest.questionCount} questions</p>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Important Instructions</h3>
            <ul className="text-[#AEAEAE] text-sm space-y-1">
              <li>• Contest will be conducted in fullscreen mode</li>
              <li>• Copy/paste and right-click are disabled</li>
              <li>• Do not switch tabs or exit fullscreen</li>
              <li>• Contest will auto-submit when time expires</li>
              <li>• Each question has only one correct answer</li>
              <li>• You cannot go back to previous questions</li>
            </ul>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Anti-Cheating Measures</h3>
            <ul className="text-[#AEAEAE] text-sm space-y-1">
              <li>• Fullscreen mode is mandatory</li>
              <li>• Tab switching will be detected</li>
              <li>• Copy/paste is disabled</li>
              <li>• Right-click is disabled</li>
              <li>• Developer tools are blocked</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-white mb-4">
              Click "Start Contest" to begin in fullscreen mode
            </p>
            <button
              onClick={handleAcceptInstructions}
              className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Contest
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Contest ended - show results
  if (contestEnded && score) {
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center p-4">
        <motion.div
          className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-8 max-w-2xl w-full backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Contest Completed!</h1>
            <p className="text-[#AEAEAE] mb-6">Your results are ready</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-semibold">Score</p>
                <p className="text-2xl font-bold text-[#49E3FF]">{score.totalScore}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-semibold">Accuracy</p>
                <p className="text-2xl font-bold text-[#A146D4]">{score.percentage}%</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-white">Correct Answers: {score.correctAnswers}/{score.totalQuestions}</p>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => navigate('/contests')}
                className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Back to Contests
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main contest interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191D2A] via-[#1a1f3a] to-[#191D2A] text-white" ref={contestRef}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A146D4]/20 to-[#49E3FF]/20 border-b border-[#A146D4]/30 p-2 lg:p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] p-1 lg:p-2 rounded-lg">
              <Trophy className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm lg:text-xl font-bold text-white truncate">{contest?.title}</h1>
              <p className="text-xs lg:text-sm text-[#AEAEAE] hidden sm:block">Math Contest Platform</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 lg:p-3 text-center">
              <p className="text-xs lg:text-sm text-[#AEAEAE]">Time</p>
              <p className="text-lg lg:text-2xl font-bold text-[#49E3FF]">
                {formatTime(timeRemaining)}
              </p>
              {endAt && (
                <p className="text-[10px] lg:text-xs text-[#AEAEAE] mt-1">
                  Ends at: {endAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            
            {!isFullscreen && (
              <button
                onClick={requestFullscreen}
                className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-1 lg:space-x-2 text-xs lg:text-base"
              >
                <Maximize2 className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Enter Fullscreen</span>
                <span className="sm:hidden">Fullscreen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Question Navigation Sidebar */}
        <div className="lg:w-80 bg-gradient-to-b from-[#A146D4]/10 to-[#49E3FF]/10 border-r border-[#A146D4]/30 p-2 lg:p-4 lg:min-h-screen">
          <div className="mb-2 lg:mb-4">
            <h3 className="text-sm lg:text-lg font-semibold text-white mb-1 lg:mb-2">Questions</h3>
            <p className="text-xs lg:text-sm text-[#AEAEAE] hidden lg:block">Click to jump to any question</p>
          </div>
          
          <div className="grid grid-cols-8 lg:grid-cols-4 gap-1 lg:gap-2">
            {questions.map((question, index) => {
              const status = getQuestionStatus(question.$id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.$id}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-200 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white shadow-lg scale-110'
                      : status === 'answered'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-white/10 text-[#AEAEAE] hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-2 lg:mt-6 space-y-1 lg:space-y-2 hidden lg:block">
            <div className="flex items-center space-x-2 text-xs lg:text-sm">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
              <span className="text-[#AEAEAE]">Answered</span>
            </div>
            <div className="flex items-center space-x-2 text-xs lg:text-sm">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/10 rounded-full"></div>
              <span className="text-[#AEAEAE]">Not Answered</span>
            </div>
            <div className="flex items-center space-x-2 text-xs lg:text-sm">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full"></div>
              <span className="text-[#AEAEAE]">Current</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 lg:p-6">
          {/* Current Question */}
          {questions[currentQuestionIndex] && (
            <motion.div
              key={currentQuestionIndex}
              className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-xl lg:rounded-2xl p-3 lg:p-6 backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-2 lg:space-x-4">
                <div className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center font-bold text-sm lg:text-lg flex-shrink-0">
                  {currentQuestionIndex + 1}
                </div>
                
                <div className="flex-1">
                  <div className="mb-3 lg:mb-6">
                    <div className="prose prose-invert max-w-none text-white prose-sm lg:prose-base">
                      <MarkdownErrorBoundary fallback={String(questions[currentQuestionIndex].question || '')}>
                        <Markdown text={questions[currentQuestionIndex].question} />
                      </MarkdownErrorBoundary>
                    </div>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-3">
                    {['A', 'B', 'C', 'D'].map(option => {
                      const optionText = questions[currentQuestionIndex][`option${option}`];
                      if (!optionText) return null;
                      
                      return (
                        <label
                          key={option}
                          className={`flex items-center space-x-2 lg:space-x-4 p-2 lg:p-4 rounded-lg lg:rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            answers[questions[currentQuestionIndex].$id] === option
                              ? 'border-[#49E3FF] bg-[#49E3FF]/10 shadow-lg'
                              : 'border-white/10 hover:border-white/20 bg-white/5'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${questions[currentQuestionIndex].$id}`}
                            value={option}
                            checked={answers[questions[currentQuestionIndex].$id] === option}
                            onChange={() => handleAnswerChange(questions[currentQuestionIndex].$id, option)}
                            className="w-4 h-4 lg:w-5 lg:h-5 text-[#49E3FF] focus:ring-[#49E3FF] focus:ring-2"
                          />
                          <span className="font-bold text-white text-sm lg:text-lg w-6 lg:w-8">{option}.</span>
                          <div className="prose prose-invert max-w-none flex-1 text-white prose-sm lg:prose-base">
                            <MarkdownErrorBoundary fallback={String(optionText || '')}>
                              <Markdown text={optionText} />
                            </MarkdownErrorBoundary>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 lg:gap-4 mt-3 lg:mt-6">
            <div className="flex space-x-1 lg:space-x-2">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-white/10 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 lg:space-x-2 text-xs lg:text-base"
              >
                <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-white/10 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 lg:space-x-2 text-xs lg:text-base"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs lg:text-sm text-[#AEAEAE]">
                {currentQuestionIndex + 1}/{questions.length}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 lg:mt-8">
            <motion.button
              onClick={openSubmitConfirm}
              disabled={isSubmitted}
              className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-2 lg:py-4 px-4 lg:px-8 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trophy className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{isSaving ? 'Saving...' : isSubmitted ? 'Submitted' : 'Submit Contest'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Warning modal */}
      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md w-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Warning</h2>
                <p className="text-[#AEAEAE] mb-4">
                  You have violated contest rules by exiting fullscreen mode. 
                  Choose one of the options below to continue.
                </p>
                <p className="text-sm text-yellow-400 mb-4">
                  Violations: {violationCount}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleRestartFullscreen}
                    className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 w-full"
                  >
                    Return to Fullscreen
                  </button>
                  <button
                    onClick={handleExitContest}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 w-full"
                  >
                    Exit Contest
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 max-w-md w-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Submit Contest?</h2>
                <p className="text-[#AEAEAE] mb-6">You won't be able to change answers after submitting.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="bg-white/10 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowSubmitConfirm(false); handleConfirmSubmit(); }}
                    className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'info' })}
      />
    </div>
  );
};

export default ContestPage;
