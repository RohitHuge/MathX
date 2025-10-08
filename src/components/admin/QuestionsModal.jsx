import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, Databases, Query } from 'appwrite';
import { X, Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import QuestionModal from './QuestionModal';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import DeleteConfirmModal from './DeleteConfirmModal';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../../config.js';

// Appwrite configuration
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const databases = new Databases(client);

// Helper function to convert Appwrite question to display format
const convertQuestionFromAppwrite = (question) => {
  return {
    ...question,
    marks: parseFloat(question.marks) || 1, // Convert float marks to number
    options: [
      { id: 'A', text: question.optionA, isCorrect: question.answer === 'A' },
      { id: 'B', text: question.optionB, isCorrect: question.answer === 'B' },
      { id: 'C', text: question.optionC, isCorrect: question.answer === 'C' },
      { id: 'D', text: question.optionD, isCorrect: question.answer === 'D' }
    ].filter(opt => opt.text), // Only include options that have text
    correctAnswer: question.answer
  };
};

// Helper function to convert display format to Appwrite format
const convertQuestionToAppwrite = (question) => {
  const options = question.options || [];
  return {
    contest_id: question.contest_id,
    question: question.question,
    optionA: options.find(opt => opt.id === 'A')?.text || '',
    optionB: options.find(opt => opt.id === 'B')?.text || '',
    optionC: options.find(opt => opt.id === 'C')?.text || '',
    optionD: options.find(opt => opt.id === 'D')?.text || '',
    answer: question.correctAnswer,
    marks: question.marks || 1
  };
};

const QuestionsModal = ({ isOpen, onClose, contest }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  
  // Modal states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Load questions when modal opens
  useEffect(() => {
    if (isOpen && contest) {
      const loadQuestions = async () => {
        try {
          setLoading(true);
          
          // Fetch questions from Appwrite database
          const response = await databases.listDocuments(
            appwriteDatabaseId,
            'questions',
            [
              Query.equal('contest_id', contest.$id),
              Query.orderDesc('$createdAt')
            ]
          );

          // Convert questions to display format
          const processedQuestions = response.documents.map(convertQuestionFromAppwrite);
          setQuestions(processedQuestions);
        } catch (err) {
          console.error('Error fetching questions:', err);
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      };
      loadQuestions();
    }
  }, [isOpen, contest]);

  // Filter questions based on search
  useEffect(() => {
    const filtered = questions.filter(question =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [questions, searchQuery]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuestion) {
      try {
        setLoading(true);
        
        // Delete question from Appwrite
        await databases.deleteDocument(
          appwriteDatabaseId,
          'questions',
          selectedQuestion.$id
        );

        // Remove from local state
        setQuestions(prev => prev.filter(q => q.$id !== selectedQuestion.$id));
        setShowDeleteModal(false);
        setSelectedQuestion(null);
      } catch (err) {
        console.error('Error deleting question:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuestionSave = async (questionData) => {
    try {
      setLoading(true);
      
      // Add contest_id to question data
      const questionWithContest = {
        ...questionData,
        contest_id: contest.$id
      };

      if (editingQuestion) {
        // Update existing question in Appwrite
        const appwriteData = convertQuestionToAppwrite(questionWithContest);
        await databases.updateDocument(
          appwriteDatabaseId,
          'questions',
          editingQuestion.$id,
          {
            ...appwriteData,
            marks: parseFloat(appwriteData.marks) // Convert marks to float
          }
        );

        // Update local state
        const updatedQuestion = convertQuestionFromAppwrite({
          ...editingQuestion,
          ...appwriteData
        });
        setQuestions(prev => prev.map(q => 
          q.$id === editingQuestion.$id ? updatedQuestion : q
        ));
      } else {
        // Create new question in Appwrite
        const appwriteData = convertQuestionToAppwrite(questionWithContest);
        const newQuestion = await databases.createDocument(
          appwriteDatabaseId,
          'questions',
          'unique()',
          {
            ...appwriteData,
            marks: parseFloat(appwriteData.marks) // Convert marks to float
          }
        );

        // Add to local state
        const convertedQuestion = convertQuestionFromAppwrite(newQuestion);
        setQuestions(prev => [convertedQuestion, ...prev]);
      }
    } catch (err) {
      console.error('Error saving question:', err);
    } finally {
      setLoading(false);
      setShowQuestionModal(false);
      setEditingQuestion(null);
    }
  };

  const getCorrectAnswerText = (question) => {
    const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
    return correctOption ? correctOption.text : 'N/A';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading skeleton
  const QuestionRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-8"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-white/20 rounded w-20"></div>
      </td>
    </tr>
  );

  if (!contest) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Manage Questions
                  </h2>
                  <p className="text-[#AEAEAE] text-sm">
                    {contest.title} • {questions.length} questions
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-[#AEAEAE] hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                  />
                </div>
                <motion.button
                  onClick={handleAddQuestion}
                  className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </motion.button>
              </div>

              {/* Questions Table */}
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-semibold">Question</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Marks</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Options</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Correct Answer</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(3)].map((_, i) => <QuestionRowSkeleton key={i} />)
                      ) : filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-[#AEAEAE]">
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[#AEAEAE]/50" />
                            <p className="text-lg font-medium">No questions found</p>
                            <p className="text-sm">
                              {searchQuery ? 'Try adjusting your search' : 'Add your first question to get started'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.map((question) => (
                          <motion.tr
                            key={question.id}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4">
                              <div className="max-w-md">
                                <div className="prose prose-invert max-w-none text-white prose-sm">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkMath({ singleDollar: true })]}
                                    rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                                  >
                                    {typeof question.question === 'string'
                                      ? question.question
                                          .replace(/\\\(/g, '$')
                                          .replace(/\\\)/g, '$')
                                          .replace(/\\\[/g, '$$')
                                          .replace(/\\\]/g, '$$')
                                      : ''}
                                  </ReactMarkdown>
                                </div>
                                <p className="text-[#AEAEAE] text-xs mt-1">
                                  Created: {formatDate(question.createdAt)}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#AEAEAE] text-sm">
                              {question.marks}
                            </td>
                            <td className="px-6 py-4 text-[#AEAEAE] text-sm">
                              {question.options.length}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-green-400 text-sm font-medium">
                                {question.correctAnswer.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => handleEditQuestion(question)}
                                  className="p-2 text-[#49E3FF] hover:bg-[#49E3FF]/20 rounded-lg transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Edit Question"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                
                                <motion.button
                                  onClick={() => handleDeleteQuestion(question)}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Delete Question"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{questions.length}</p>
                    <p className="text-[#AEAEAE] text-sm">Total Questions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {questions.reduce((sum, q) => sum + q.marks, 0)}
                    </p>
                    <p className="text-[#AEAEAE] text-sm">Total Marks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {questions.length > 0 ? Math.round(questions.reduce((sum, q) => sum + q.marks, 0) / questions.length) : 0}
                    </p>
                    <p className="text-[#AEAEAE] text-sm">Average Marks</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Modal */}
      <QuestionModal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setEditingQuestion(null);
        }}
        onSave={handleQuestionSave}
        question={editingQuestion}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedQuestion(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message={`Are you sure you want to delete this question? This action cannot be undone.`}
      />
    </>
  );
};

export default QuestionsModal;
