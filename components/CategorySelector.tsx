
import React from 'react';
import { categorizedWordBank } from '../data/wordBank';
import { WordPair } from '../types';

interface CategorySelectorProps {
  onCategorySelected: (words: WordPair[]) => void;
  onBack: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onCategorySelected, onBack }) => {
  const categories = Object.keys(categorizedWordBank);

  const handleSelect = (category: string) => {
    const words = categorizedWordBank[category];
    onCategorySelected(words);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl w-full text-center animate-in">
        <h2 className="text-3xl font-bold text-purple-400 mb-6">اختر فئة الكلمات</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map(category => (
            <button key={category} onClick={() => handleSelect(category)} className="bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-500 transition-colors text-base md:text-lg">
              {category}
            </button>
          ))}
        </div>

        <button onClick={onBack} className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
          → العودة إلى القائمة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
