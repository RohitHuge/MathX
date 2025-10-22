// timerWorker.js
let remaining = 0;
let interval = null;

onmessage = (e) => {
  const { command, duration } = e.data;

  if (command === 'start') {
    remaining = duration;
    if (interval) clearInterval(interval);
    // Debug
    try { console.log('[TimerWorker] start received. duration(ms):', duration); } catch {}

    interval = setInterval(() => {
      remaining -= 1000;
      try { console.log('[TimerWorker] tick. remaining(ms):', remaining); } catch {}
      postMessage({ type: 'tick', remaining });
      if (remaining <= 0) {
        clearInterval(interval);
        try { console.log('[TimerWorker] end.'); } catch {}
        postMessage({ type: 'end' });
      }
    }, 1000);
  }

  if (command === 'stop') {
    if (interval) clearInterval(interval);
    try { console.log('[TimerWorker] stop received.'); } catch {}
  }
};
