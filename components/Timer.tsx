import React from 'react';

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const urgencyClass = timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400';
  
  return (
    <div className="text-center p-4">
      <div className="text-lg font-semibold text-slate-400 uppercase">الوقت</div>
      <div className={`mt-1 font-bold text-7xl ${urgencyClass}`}>{timeLeft}</div>
    </div>
  );
};

export default Timer;