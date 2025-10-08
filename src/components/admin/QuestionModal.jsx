import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const QuestionModal = ({ isOpen, onClose, onSave, question }) => {
  const [formData, setFormData] = useState({
    question: '',
    marks: 1,
    options: [
      { id: 'A', text: '', isCorrect: false },
      { id: 'B', text: '', isCorrect: false },
      { id: 'C', text: '', isCorrect: false },
      { id: 'D', text: '', isCorrect: false }
    ],
    correctAnswer: 'A'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Initialize form data when question prop changes
  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || '',
        marks: question.marks || 1,
        options: question.options || [
          { id: 'A', text: '', isCorrect: false },
          { id: 'B', text: '', isCorrect: false },
          { id: 'C', text: '', isCorrect: false },
          { id: 'D', text: '', isCorrect: false }
        ],
        correctAnswer: question.correctAnswer || 'A'
      });
    } else {
      setFormData({
        question: '',
        marks: 1,
        options: [
          { id: 'A', text: '', isCorrect: false },
          { id: 'B', text: '', isCorrect: false },
          { id: 'C', text: '', isCorrect: false },
          { id: 'D', text: '', isCorrect: false }
        ],
        correctAnswer: 'A'
      });
    }
    setErrors({});
  }, [question, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionChange = (optionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === optionId ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const handleCorrectAnswerChange = (optionId) => {
    setFormData(prev => ({
      ...prev,
      correctAnswer: optionId,
      options: prev.options.map(opt => ({
        ...opt,
        isCorrect: opt.id === optionId
      }))
    }));
  };

  const addOption = () => {
    const newId = String.fromCharCode(97 + formData.options.length); // a, b, c, d, e, f...
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: newId, text: '', isCorrect: false }]
    }));
  };

  const removeOption = (optionId) => {
    if (formData.options.length <= 2) return; // Keep at least 2 options
    
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId),
      correctAnswer: prev.correctAnswer === optionId ? 'a' : prev.correctAnswer
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (formData.marks <= 0) {
      newErrors.marks = 'Marks must be greater than 0';
    }

    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    const hasCorrectAnswer = formData.options.some(opt => opt.isCorrect && opt.text.trim());
    if (!hasCorrectAnswer) {
      newErrors.correctAnswer = 'Please select a correct answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const questionData = {
        ...formData,
        options: formData.options.filter(opt => opt.text.trim()) // Remove empty options
      };

      onSave(questionData);
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {question ? 'Edit Question' : 'Add New Question'}
                </h2>
                <p className="text-[#AEAEAE] text-sm">
                  {question ? 'Update question details' : 'Create a new math question'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 text-[#AEAEAE] hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={showPreview ? 'Hide Preview' : 'Show Preview'}
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-[#AEAEAE] hover:text-white transition-colors duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Question */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Question *
                    </label>
                    <textarea
                      value={formData.question}
                      onChange={(e) => handleInputChange('question', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent resize-none ${
                        errors.question ? 'border-red-500' : 'border-white/10'
                      }`}
                      placeholder="Enter your question using LaTeX for math: $x^2 + y^2 = z^2$"
                      disabled={loading}
                    />
                    {errors.question && (
                      <p className="text-red-400 text-sm mt-1">{errors.question}</p>
                    )}
                    <p className="text-[#AEAEAE] text-xs mt-1">
                      Use LaTeX syntax for math: $inline$ or $$block$$
                    </p>
                  </div>

                  {/* Marks */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Marks *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.marks}
                      onChange={(e) => handleInputChange('marks', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                        errors.marks ? 'border-red-500' : 'border-white/10'
                      }`}
                      disabled={loading}
                    />
                    {errors.marks && (
                      <p className="text-red-400 text-sm mt-1">{errors.marks}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white font-medium">
                        Options *
                      </label>
                      <motion.button
                        type="button"
                        onClick={addOption}
                        className="text-[#49E3FF] hover:text-[#49E3FF]/80 transition-colors duration-200 flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add Option</span>
                      </motion.button>
                    </div>
                    
                    {errors.options && (
                      <p className="text-red-400 text-sm mb-2">{errors.options}</p>
                    )}
                    
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div key={option.id} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={formData.correctAnswer === option.id}
                              onChange={() => handleCorrectAnswerChange(option.id)}
                              className="w-4 h-4 text-[#49E3FF] bg-white/5 border-white/10 focus:ring-[#49E3FF]"
                              disabled={loading}
                            />
                            <span className="text-white font-medium w-6">
                              {option.id.toUpperCase()}.
                            </span>
                          </div>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                            placeholder={`Option ${option.id.toUpperCase()}`}
                            disabled={loading}
                          />
                          {formData.options.length > 2 && (
                            <motion.button
                              type="button"
                              onClick={() => removeOption(option.id)}
                              className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Remove Option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {errors.correctAnswer && (
                      <p className="text-red-400 text-sm mt-2">{errors.correctAnswer}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-white/10">
                    <motion.button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-3 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{question ? 'Update Question' : 'Create Question'}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="lg:border-l border-white/10 lg:pl-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath({ singleDollar: true })]}
                        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                      >
                        {(typeof formData.question === 'string'
                          ? formData.question
                              .replace(/\\\(/g, '$')
                              .replace(/\\\)/g, '$')
                              .replace(/\\\[/g, '$$')
                              .replace(/\\\]/g, '$$')
                          : '') || '*Enter your question above to see the preview*'}
                      </ReactMarkdown>
                    </div>
                    
                    {formData.question && (
                      <div className="mt-4 space-y-2">
                        <p className="text-white font-medium">Options:</p>
                        {formData.options
                          .filter(opt => opt.text.trim())
                          .map((option) => (
                            <div
                              key={option.id}
                              className={`flex items-center space-x-2 p-2 rounded ${
                                formData.correctAnswer === option.id
                                  ? 'bg-green-500/20 border border-green-500/30'
                                  : 'bg-white/5'
                              }`}
                            >
                              <span className="text-white font-medium w-6">
                                {option.id.toUpperCase()}.
                              </span>
                              <div className="prose prose-invert max-w-none text-sm">
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath({ singleDollar: true })]}
                                  rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                                >
                                  {(typeof option.text === 'string'
                                    ? option.text
                                        .replace(/\\\(/g, '$')
                                        .replace(/\\\)/g, '$')
                                        .replace(/\\\[/g, '$$')
                                        .replace(/\\\]/g, '$$')
                                    : '') || '*Empty option*'}
                                </ReactMarkdown>
                              </div>
                              {formData.correctAnswer === option.id && (
                                <span className="text-green-400 text-xs font-medium">
                                  ✓ Correct
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal;
