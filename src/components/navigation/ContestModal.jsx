import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContests } from '../../hooks/useContests';
import { Play, Clock, Users, Trophy, X } from 'lucide-react';

const ContestModal = ({ isOpen, onClose }) => {
  const { getUpcomingContest, getLiveContest } = useContests();
  
  // Get the current contest (live or upcoming)
  const currentContest = getLiveContest() || getUpcomingContest();

  const handleStartContest = () => {
    if (currentContest) {
      // Navigate to contest page or start the contest
      window.location.href = `/contest/${currentContest.id}`;
    }
  };

  if (!currentContest) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Contest Instructions</h2>
                  <p className="text-[#AEAEAE] text-xs">Ready to test your skills?</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-[#AEAEAE] hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Contest Info */}
            <div className="space-y-4">
              {/* Contest Title */}
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{currentContest.title}</h3>
                <p className="text-[#AEAEAE] text-sm leading-relaxed">{currentContest.description}</p>
              </div>

              {/* Contest Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-[#49E3FF]" />
                    <span className="text-xs font-medium text-white">Duration</span>
                  </div>
                  <p className="text-[#AEAEAE] text-sm">{currentContest.duration}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-[#A146D4]" />
                    <span className="text-xs font-medium text-white">Participants</span>
                  </div>
                  <p className="text-[#AEAEAE] text-sm">{currentContest.participant_count}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#AEAEAE] text-sm">Questions:</span>
                    <span className="text-white font-medium text-sm">{currentContest.question_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEAEAE] text-sm">Difficulty:</span>
                    <span className="text-white font-medium text-sm">{currentContest.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEAEAE] text-sm">Prize:</span>
                    <span className="text-white font-medium text-sm">{currentContest.prize}</span>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h4 className="text-white font-medium mb-2 text-sm">Topics Covered:</h4>
                <div className="flex flex-wrap gap-1">
                  {currentContest.topics.map((topic, index) => (
                    <motion.span
                      key={index}
                      className="px-2 py-1 bg-[#A146D4]/20 text-[#A146D4] rounded-full text-xs border border-[#A146D4]/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2 text-sm">Important Instructions:</h4>
                <ul className="text-[#AEAEAE] text-xs space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• You cannot go back to previous questions once answered</li>
                  <li>• The contest will auto-submit when time runs out</li>
                  <li>• Ensure stable internet connection throughout</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <motion.button
                onClick={onClose}
                className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleStartContest}
                className="flex-1 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-2 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                <span>Start Contest</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContestModal;
