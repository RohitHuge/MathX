import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to enforce full screen mode during tests.
 * @param {boolean} isTesting - Whether the test is currently active
 * @param {Function} onSubmit - Callback to trigger submission on violation limit
 * @param {number} maxWarnings - Number of warnings before auto-submit (default 2 warnings, submit on 3rd violation)
 */
export function useFullScreenEnforcement(isTesting, onSubmit, maxWarnings = 2) {
    const [isFullScreen, setIsFullScreen] = useState(true); // Assume true initially or when checking
    const [warnings, setWarnings] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const enterFullScreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error('Error attempting to enable full-screen mode:', err);
        }
    }, []);

    const handleViolation = useCallback(() => {
        setWarnings(prev => {
            const newCount = prev + 1;
            if (newCount > maxWarnings) {
                // Limit reached, trigger submit
                onSubmit();
                return prev; // Keep at max to avoid repeated triggers if logic allows
            } else {
                setShowWarningModal(true);
                return newCount;
            }
        });
    }, [maxWarnings, onSubmit]);

    useEffect(() => {
        if (!isTesting) return;

        const handleFullScreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullScreen(isFull);
            if (!isFull) {
                handleViolation();
            }
        };

        // Initial entry
        enterFullScreen();

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('msfullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('msfullscreenchange', handleFullScreenChange);
        };
    }, [isTesting, handleViolation, enterFullScreen]);

    // Function to re-enter full screen from warning modal
    const reEnterFullScreen = () => {
        enterFullScreen();
        setShowWarningModal(false);
    };

    return {
        enterFullScreen,
        warnings,
        showWarningModal,
        reEnterFullScreen,
        remainingWarnings: Math.max(0, maxWarnings - warnings + 1) // +1 because maxWarnings is count of *warnings*, submit happens on next
    };
}
