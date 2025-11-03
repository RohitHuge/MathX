import React, { useEffect, useRef, useState } from "react";

export default function FullscreenGate({ onEntered = () => {} }) {
  const [visible, setVisible] = useState(() => !document.fullscreenElement);
  const prevFullscreenRef = useRef(!!document.fullscreenElement);
  const pollRef = useRef(null);

  useEffect(() => {
    function poll() {
      const isFs = !!document.fullscreenElement;
      const prev = prevFullscreenRef.current;
      if (isFs !== prev) {
        prevFullscreenRef.current = isFs;
        setVisible(!isFs);
        if (isFs) onEntered();
      }
    }

    pollRef.current = setInterval(poll, 1000);

    function onFsChange() {
      const isFs = !!document.fullscreenElement;
      const prev = prevFullscreenRef.current;
      if (isFs !== prev) {
        prevFullscreenRef.current = isFs;
        setVisible(!isFs);
        if (isFs) onEntered();
      }
    }

    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      clearInterval(pollRef.current);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [onEntered]);

  const handleEnter = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#191D2A]/90 backdrop-blur-sm">
      <div className="text-white rounded-2xl p-8 text-center shadow-xl max-w-md w-full bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30">
        <h2 className="text-2xl font-bold text-white mb-3">Enter Fullscreen Mode</h2>
        <p className="text-[#AEAEAE] mb-5">
          To ensure a fair contest, you must stay in fullscreen mode. Click below to continue.
        </p>
        <button
          onClick={handleEnter}
          className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white hover:shadow-lg transition-all duration-300"
        >
          Enter Fullscreen
        </button>
        <p className="text-xs text-[#AEAEAE] mt-4">Exiting fullscreen will pause your actions until you return.</p>
      </div>
    </div>
  );
}
