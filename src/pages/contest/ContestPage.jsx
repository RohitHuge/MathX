import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { submitContestResults } from '../../utils/contestSubmission.js';
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
  const [submitted, setSubmitted] = useState(false);
  const [existingScore, setExistingScore] = useState(null);
  
  // Anti-cheating state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitched, setTabSwitched] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showContestInstructions, setShowContestInstructions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  const contestRef = useRef(null);
  const timerRef = useRef(null);

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  // Request fullscreen
  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        showToast('Fullscreen enabled. Contest is now secure.', 'success');
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      showToast('Please enable fullscreen for the contest', 'warning');
    }
  };

  // Anti-cheating event listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
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

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [contestStarted, contestEnded]);

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
        const contestDuration = contestResponse.contestDuration * 60 * 1000; // Convert to milliseconds
        const endTime = new Date(startTime.getTime() + contestDuration);
        
        if (now < startTime) {
          // Contest hasn't started yet
          setShowInstructions(true);
          setLoading(false);
          return;
        }
        
        if (now > endTime) {
          // Contest has ended
          setContestEnded(true);
          setLoading(false);
          return;
        }
        
        // Check for existing score record if user is logged in
        if (user) {
          const existingScoreRecord = await getUserContestScore(contestId, user.$id);
          if (existingScoreRecord) {
            setExistingScore(existingScoreRecord);
            
            // If the contest was already submitted, show the score
            if (existingScoreRecord.end_time) {
              setContestEnded(true);
              setSubmitted(true);
              setScore({
                totalScore: existingScoreRecord.score,
                percentage: existingScoreRecord.score
              });
            } else {
              // Calculate remaining time based on start_time
              const elapsedTime = now - new Date(existingScoreRecord.start_time);
              const remainingTime = Math.max(0, contestDuration - elapsedTime);
              
              if (remainingTime > 0) {
                setTimeRemaining(remainingTime);
                setStartTime(new Date(existingScoreRecord.start_time));
                setContestStarted(true);
                showToast('Resuming your previous attempt', 'info');
              } else {
                // Time has expired, auto-submit
                handleAutoSubmit();
              }
            }
          }
        }
        
        // Show instructions if no existing score
        if (!existingScore) {
          setShowContestInstructions(true);
        }
        
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

  // Timer countdown
  useEffect(() => {
    if (contestStarted && !contestEnded && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            // Time's up - auto submit
            handleAutoSubmit();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [contestStarted, contestEnded]);

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
    if (submitted) return;
    
    setContestEnded(true);
    setSubmitted(true);
    
    const scoreData = calculateScore();
    setScore(scoreData);
    
    showToast('Time\'s up! Contest submitted automatically.', 'info');
    
    // Submit results to backend
    try {
      if (user) {
        const result = await submitContest(contestId, user.$id, scoreData);
        if (result) {
          showToast('Results submitted successfully!', 'success');
        } else {
          showToast('Failed to submit results. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Error submitting results', 'error');
    }
  };

  // Manual submit
  const handleSubmit = async () => {
    if (submitted) return;
    
    setContestEnded(true);
    setSubmitted(true);
    
    const scoreData = calculateScore();
    setScore(scoreData);
    
    showToast('Contest submitted successfully!', 'success');
    
    // Submit results to backend
    try {
      if (user) {
        const result = await submitContest(contestId, user.$id, scoreData.totalScore);
        if (result) {
          showToast('Results submitted successfully!', 'success');
        } else {
          showToast('Failed to submit results. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Error submitting results', 'error');
    }
  };

  // Handle refresh for pre-contest
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle accepting contest instructions and requesting fullscreen
  const handleAcceptInstructions = async () => {
    try {
      if (!user) {
        showToast('Please login to start the contest', 'error');
        return;
      }
      
      await requestFullscreen();
      const now = new Date();
      
      // Create score record
      const scoreRecord = await startContest(contestId, user.$id);
      if (!scoreRecord) {
        throw new Error('Failed to create score record');
      }
      
      setContestStarted(true);
      setStartTime(now);
      // Initialize timer for new attempts
      if (contest && typeof contest.contestDuration === 'number') {
        setTimeRemaining(Math.max(0, contest.contestDuration * 60 * 1000));
      }
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
              onClick={handleSubmit}
              disabled={submitted}
              className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-2 lg:py-4 px-4 lg:px-8 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trophy className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{submitted ? 'Submitted' : 'Submit Contest'}</span>
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
