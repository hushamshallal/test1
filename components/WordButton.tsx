
import React from 'react';
import { SelectionStatus } from '../types';

interface WordButtonProps {
  text: string;
  lang: 'ar' | 'en';
  status: SelectionStatus;
  onClick: () => void;
}

const WordButton: React.FC<WordButtonProps> = ({ text, lang, status, onClick }) => {
  const baseClasses = "w-full text-xl md:text-2xl font-semibold p-4 rounded-lg border-2 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none";

  const statusClasses = {
    [SelectionStatus.NONE]: 'bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:bg-slate-700/80 hover:border-cyan-500 text-slate-200',
    [SelectionStatus.SELECTED]: 'bg-cyan-600/80 border-cyan-400 text-white ring-4 ring-cyan-300/70 ring-offset-2 ring-offset-slate-900 shadow-cyan-500/40',
    [SelectionStatus.CORRECT]: 'bg-green-500/80 border-green-400 text-white animate-correct-flash',
    [SelectionStatus.INCORRECT]: 'bg-red-600/80 border-red-400 text-white animate-shake',
  };

  return (
    <button lang={lang} onClick={onClick} className={`${baseClasses} ${statusClasses[status]}`}>
      {text}
    </button>
  );
};

export default WordButton;
