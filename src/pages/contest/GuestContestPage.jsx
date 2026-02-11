import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Databases, Query } from 'appwrite';
import { supabase } from '../../config/supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
    Clock,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Send,
    CheckCircle,
    Flag
} from 'lucide-react';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../../config';
import GuestContestLayout from '../../layouts/GuestContestLayout';

// Appwrite init
const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);
const databases = new Databases(client);

// Helper for Latex
const Markdown = ({ text }) => {
    const normalizeMathDelimiters = (input) => {
        if (typeof input !== 'string') return '';
        let s = input
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$')
            .replace(/\\\[/g, '$$')
            .replace(/\\\]/g, '$$');
        if (!/[\$]/.test(s) && /\\[a-zA-Z]+/.test(s)) {
            s = `$${s}$`;
        }
        return s;
    };

    return (
        <ReactMarkdown
            remarkPlugins={[[remarkMath, { singleDollar: true }]]}
            rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        >
            {normalizeMathDelimiters(text)}
        </ReactMarkdown>
    );
};

export default function GuestContestPage() {
    const { contestId } = useParams();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [contest, setContest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [guestDetails, setGuestDetails] = useState(null);

    const [currentInfo, setCurrentInfo] = useState({
        idx: 0,
        answers: {}, // { questionId: optionKey }
        flags: { blur_count: 0, tab_switches: 0 }
    });

    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Refs for timer and anti-cheat
    const timerRef = useRef(null);
    const autoSubmitRef = useRef(false);

    // 1. Init & Fetch
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                // Load session from local storage
                const sessionKey = `guest_session_${contestId}`;
                const storedSession = localStorage.getItem(sessionKey);

                if (!storedSession) {
                    navigate(`/contest/guest/${contestId}/login`);
                    return;
                }
                const session = JSON.parse(storedSession);
                setGuestDetails(session);

                // Fetch Contest
                const contestDoc = await databases.getDocument(
                    appwriteDatabaseId,
                    'contest_info',
                    contestId
                );
                setContest(contestDoc);

                // Fetch Questions
                // Note: guests might need a proxy if read permissions are strict.
                // Assuming 'role:any' or 'role:guest' read permissions on 'questions' collection for logic simplicity here.
                const qDocs = await databases.listDocuments(
                    appwriteDatabaseId,
                    'questions',
                    [Query.equal('contest_id', contestId), Query.limit(100)]
                );
                console.log("Questions response: ", qDocs);

                if (qDocs.documents.length === 0) {
                    console.warn("No questions found for contest:", contestId);
                }

                setQuestions(qDocs.documents);

                // Calculate Time Details
                // Check if contest is fixed time or flexible duration
                // For guest mode, we usually respect the "contestDuration" from the moment they start
                // OR a specific fixed window. Assuming 'duration' logic here.
                const durationMins = parseInt(contestDoc.contestDuration) || 60;

                // Calculate elapsed time since they "started" (clicked start on prev page)
                const startTime = new Date(session.startTime).getTime();
                const now = Date.now();
                const elapsedSec = Math.floor((now - startTime) / 1000);
                const totalSec = durationMins * 60;
                const remaining = Math.max(0, totalSec - elapsedSec);

                setTimeLeft(remaining);

                if (remaining <= 0) {
                    // Already expired?
                    alert("Session expired.");
                    navigate(`/contest/guest/${contestId}/login`);
                    return;
                }

            } catch (err) {
                console.error("Init Error:", err);
                setError("Failed to load contest. " + err.message);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [contestId, navigate]);

    // 2. Timer
    useEffect(() => {
        if (loading || isSubmitted || timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [loading, isSubmitted]);

    // 3. Anti-Cheat Listeners
    useEffect(() => {
        if (loading || isSubmitted) return;

        const handleVisibility = () => {
            if (document.hidden) {
                setCurrentInfo(prev => ({
                    ...prev,
                    flags: { ...prev.flags, tab_switches: prev.flags.tab_switches + 1 }
                }));
                // Optional: Auto-submit on too many violations
            }
        };

        const handleBlur = () => {
            setCurrentInfo(prev => ({
                ...prev,
                flags: { ...prev.flags, blur_count: prev.flags.blur_count + 1 }
            }));
        };

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("blur", handleBlur);
        };
    }, [loading, isSubmitted]);


    // Logic Helpers
    const handleOptionSelect = (qId, optionKey) => {
        setCurrentInfo(prev => ({
            ...prev,
            answers: { ...prev.answers, [qId]: optionKey }
        }));
    };

    const handleNext = () => {
        if (currentInfo.idx < questions.length - 1) {
            setCurrentInfo(prev => ({ ...prev, idx: prev.idx + 1 }));
        }
    };

    const handlePrev = () => {
        if (currentInfo.idx > 0) {
            setCurrentInfo(prev => ({ ...prev, idx: prev.idx - 1 }));
        }
    };

    const handleAutoSubmit = () => {
        if (autoSubmitRef.current || isSubmitted) return;
        autoSubmitRef.current = true;
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (isSubmitted) return;

        // confirm if manual
        if (!autoSubmitRef.current && !window.confirm("Are you sure you want to submit?")) return;

        setSubmitting(true);

        try {
            // Calculate Score
            let rawScore = 0;
            questions.forEach(q => {
                const userAns = currentInfo.answers[q.$id];
                if (userAns === q.answer) rawScore += (q.marks || 1);
            });

            // Push to Supabase
            const { error: sbError } = await supabase
                .from('guest_submissions')
                .insert({
                    contest_id: contestId,
                    guest_name: guestDetails.name,
                    guest_email: guestDetails.email,
                    guest_phone: guestDetails.phone || null,
                    score: rawScore,
                    total_questions: questions.length,
                    answers: currentInfo.answers,
                    cheating_flags: currentInfo.flags,
                    submitted_at: new Date().toISOString()
                });

            if (sbError) throw sbError;

            setIsSubmitted(true);
            // Clean up local storage
            localStorage.removeItem(`guest_session_${contestId}`);

        } catch (err) {
            console.error("Submission Error:", err);
            alert("Failed to submit: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Render Helpers
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };


    if (loading) return (
        <GuestContestLayout>
            <div className="flex justify-center pt-20">Loading Test...</div>
        </GuestContestLayout>
    );

    if (isSubmitted) {
        return (
            <GuestContestLayout>
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <CheckCircle className="w-20 h-20 text-[#49E3FF] mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">Submission Successful!</h1>
                    <p className="text-[#94A3B8] mb-8">
                        Thank you, {guestDetails.name}. Your response has been recorded.
                    </p>
                    <button
                        onClick={() => navigate('/contest')}
                        className="px-6 py-2 bg-[#1E293B] hover:bg-[#334155] rounded-lg text-white"
                    >
                        Return to Home
                    </button>
                </div>
            </GuestContestLayout>
        );
    }

    if (questions.length === 0) {
        return (
            <GuestContestLayout>
                <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Questions Found</h2>
                    <p className="text-[#94A3B8]">The questions for this contest could not be loaded.</p>
                    <p className="text-[#94A3B8] text-sm mt-2">Possible reasons: Permissions restricted or no questions added.</p>
                </div>
            </GuestContestLayout>
        );
    }

    const currentQ = questions[currentInfo.idx];
    const totalQ = questions.length;
    const isAnswered = currentInfo.answers[currentQ.$id] !== undefined;

    return (
        <GuestContestLayout>
            <div className="max-w-4xl mx-auto">
                {/* Sticky Header Info */}
                <div className="flex items-center justify-between mb-6 bg-[#1E293B]/50 p-4 rounded-xl border border-[#334155] backdrop-blur-sm sticky top-20 z-40">
                    <div className="flex items-center space-x-4">
                        <span className="text-[#94A3B8] text-sm hidden md:inline">Logged in as:</span>
                        <span className="text-white font-medium">{guestDetails.name}</span>
                    </div>

                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono font-bold text-xl ${timeLeft < 300 ? 'bg-red-500/10 text-red-500' : 'bg-[#49E3FF]/10 text-[#49E3FF]'
                        }`}>
                        <Clock className="w-5 h-5" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Main Question Area */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <motion.div
                            key={currentQ.$id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[#49E3FF] text-sm font-bold uppercase tracking-wider">
                                    Question {currentInfo.idx + 1} of {totalQ}
                                </span>
                                <span className="text-[#94A3B8] text-sm">
                                    {currentQ.marks || 1} Marks
                                </span>
                            </div>

                            <div className="prose prose-invert max-w-none mb-8 text-lg">
                                <Markdown text={currentQ.questionText || currentQ.question_text || currentQ.question || "No text"} />
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {[0, 1, 2, 3].map((idx) => {
                                    const labels = ['A', 'B', 'C', 'D'];
                                    const label = labels[idx];

                                    // Try to find content for this slot
                                    // Support both option1/2/3/4 and optionA/B/C/D
                                    let text = currentQ[`option${idx + 1}`] || currentQ[`option${label}`];

                                    if (!text) return null;

                                    const isSelected = currentInfo.answers[currentQ.$id] === label;

                                    return (
                                        <button
                                            key={label}
                                            onClick={() => handleOptionSelect(currentQ.$id, label)}
                                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-start group ${isSelected
                                                ? 'bg-[#49E3FF]/10 border-[#49E3FF] shadow-[0_0_15px_rgba(73,227,255,0.1)]'
                                                : 'bg-[#0F172A] border-[#334155] hover:border-[#94A3B8]'
                                                }`}
                                        >
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 border transition-colors ${isSelected
                                                ? 'bg-[#49E3FF] text-[#0F172A] border-[#49E3FF]'
                                                : 'bg-[#1E293B] text-[#94A3B8] border-[#49E3FF]/20 group-hover:border-[#94A3B8]'
                                                }`}>
                                                {label}
                                            </span>
                                            <div className="text-gray-200 pt-1">
                                                <Markdown text={text} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Navigation */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handlePrev}
                                disabled={currentInfo.idx === 0}
                                className="flex items-center px-4 py-2 rounded-lg bg-[#334155] text-white disabled:opacity-50 hover:bg-[#475569] transition"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Previous
                            </button>

                            {currentInfo.idx === totalQ - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-bold hover:shadow-lg transition"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Test'}
                                    <Send className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center px-6 py-2 rounded-lg bg-[#49E3FF] text-[#0F172A] font-bold hover:bg-[#7DD3FC] transition"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Question Palette */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 sticky top-24">
                            <h3 className="text-white font-semibold mb-4 flex items-center">
                                <Flag className="w-4 h-4 mr-2 text-[#49E3FF]" />
                                Question Palette
                            </h3>
                            <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
                                {questions.map((q, idx) => {
                                    const isAnswered = currentInfo.answers[q.$id];
                                    const isCurrent = currentInfo.idx === idx;
                                    return (
                                        <button
                                            key={q.$id}
                                            onClick={() => setCurrentInfo(prev => ({ ...prev, idx }))}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${isCurrent
                                                ? 'bg-white text-[#0F172A] ring-2 ring-[#49E3FF]'
                                                : isAnswered
                                                    ? 'bg-[#49E3FF] text-[#0F172A]'
                                                    : 'bg-[#334155] text-[#94A3B8] hover:bg-[#475569]'
                                                }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-[#334155]">
                                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
                                    <span>Answered</span>
                                    <span className="text-[#49E3FF] font-bold">{Object.keys(currentInfo.answers).length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                                    <span>Pending</span>
                                    <span className="text-white font-bold">{totalQ - Object.keys(currentInfo.answers).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </GuestContestLayout>
    );
}
