import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTY_NAMES_AR, TOTAL_ROUNDS_PER_LEVEL } from '../constants';

interface ScoreboardProps {
  score: number;
  level: Difficulty;
  round: number;
  matchesThisRound: number;
  matchesToWin: number;
  timeLeft: number;
}

const InfoPill: React.FC<{ label: string; value: string | number; className?: string, isTime?: boolean }> = ({ label, value, className = '', isTime = false }) => (
    <div className={`text-center px-4 ${isTime ? 'w-24' : 'flex-1'}`}>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={`mt-1 font-bold ${isTime ? 'text-4xl' : 'text-2xl'} ${className}`}>{value}</div>
    </div>
);

const Scoreboard: React.FC<ScoreboardProps> = ({ score, level, round, matchesThisRound, matchesToWin, timeLeft }) => {
  const urgencyClass = timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400';
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3">
        <div className="flex justify-around items-center divide-x divide-slate-700 divide-x-reverse">
            <InfoPill label="النقاط" value={score} className="text-cyan-300" />
            <InfoPill label="المستوى" value={DIFFICULTY_NAMES_AR[level]} className="text-slate-200" />
            <InfoPill label="الجولة" value={`${round} / ${TOTAL_ROUNDS_PER_LEVEL}`} className="text-slate-200" />
            <InfoPill label="المطابقات" value={`${matchesThisRound} / ${matchesToWin}`} className="text-slate-200" />
            <InfoPill label="الوقت" value={timeLeft} className={urgencyClass} isTime={true}/>
        </div>
    </div>
  );
};

export default Scoreboard;
