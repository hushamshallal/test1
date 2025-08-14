import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordPair, Difficulty, GameState, SelectionStatus, GameMode } from './types';
import { GAME_CONFIG, TOTAL_ROUNDS_PER_LEVEL, DIFFICULTY_NAMES_AR } from './constants';
import { allWords, categorizedWordBank } from './data/wordBank';
import WordButton from './components/WordButton';
import Scoreboard from './components/Scoreboard';
import Modal from './components/Modal';
import CategorySelector from './components/CategorySelector';
import ThemeSelector from './components/ThemeSelector'; // For later use

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const difficultyLevelMap: Record<Difficulty, 1 | 2 | 3> = {
  [Difficulty.EASY]: 1,
  [Difficulty.MEDIUM]: 2,
  [Difficulty.HARD]: 3,
};

const App: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentWordBank, setCurrentWordBank] = useState<WordPair[]>(allWords);

  // Global stats
  const [totalScore, setTotalScore] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // Timed mode state
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG[Difficulty.EASY].timer);
  const [currentRound, setCurrentRound] = useState(1);
  const [matchesThisRound, setMatchesThisRound] = useState(0);
  const [matchesThisSession, setMatchesThisSession] = useState(0);

  // Zen & Categorized mode state
  const [correctMatches, setCorrectMatches] = useState(0);
  const [incorrectMatches, setIncorrectMatches] = useState(0);

  // Board state
  const [arabicWords, setArabicWords] = useState<WordPair[]>([]);
  const [englishWords, setEnglishWords] = useState<WordPair[]>([]);
  const [usedWordIds, setUsedWordIds] = useState<Set<number>>(new Set());
  const [lastShuffledColumn, setLastShuffledColumn] = useState<'ar' | 'en'>('en');

  // Selection state
  const [selectedArabic, setSelectedArabic] = useState<WordPair | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<WordPair | null>(null);
  const [incorrectPair, setIncorrectPair] = useState<[number, number] | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  // Load global stats from localStorage
  useEffect(() => {
    try {
      const storedScore = localStorage.getItem('lingoLinkTotalScore');
      const storedMatches = localStorage.getItem('lingoLinkTotalMatches');
      if (storedScore) setTotalScore(parseInt(storedScore, 10));
      if (storedMatches) setTotalMatches(parseInt(storedMatches, 10));
    } catch (error) {
      console.error("Failed to load stats from localStorage:", error);
    }
  }, []);

  const updateGlobalStats = useCallback((newPoints: number, newMatches: number) => {
    setTotalScore(prev => {
      const updatedScore = prev + newPoints;
      localStorage.setItem('lingoLinkTotalScore', updatedScore.toString());
      return updatedScore;
    });
    setTotalMatches(prev => {
      const updatedMatches = prev + newMatches;
      localStorage.setItem('lingoLinkTotalMatches', updatedMatches.toString());
      return updatedMatches;
    });
  }, []);

  const replaceAndShuffle = useCallback((matchedId: number) => {
    const isTimedModeWithDifficulty = gameMode === GameMode.TIMED;
    
    let wordSource = currentWordBank;
    if (isTimedModeWithDifficulty) {
        const targetLevel = difficultyLevelMap[difficulty];
        wordSource = currentWordBank.filter((w: WordPair) => w.level === targetLevel);
    }

    let availableWords = wordSource.filter((w: WordPair) => !usedWordIds.has(w.id));
    if (availableWords.length === 0) {
        console.warn("All words for this level used. Resetting word bank for this level.");
        setUsedWordIds(prev => {
            const newSet = new Set(prev);
            wordSource.forEach((w: WordPair) => newSet.delete(w.id));
            return newSet;
        });
        availableWords = [...wordSource];
    }
    
    const newWord = shuffleArray(availableWords)[0];
    if (newWord) {
        setUsedWordIds(prev => new Set(prev).add(newWord.id));

        const columnToShuffle = lastShuffledColumn === 'ar' ? 'en' : 'ar';
        setLastShuffledColumn(columnToShuffle);

        if (columnToShuffle === 'ar') {
            setArabicWords(prev => shuffleArray(prev.map((w: WordPair) => w.id === matchedId ? newWord : w)));
            setEnglishWords(prev => prev.map((w: WordPair) => w.id === matchedId ? newWord : w));
        } else {
            setEnglishWords(prev => shuffleArray(prev.map((w: WordPair) => w.id === matchedId ? newWord : w)));
            setArabicWords(prev => prev.map((w: WordPair) => w.id === matchedId ? newWord : w));
        }
    }


    setSelectedArabic(null);
    setSelectedEnglish(null);
    isProcessingRef.current = false;
  }, [currentWordBank, usedWordIds, lastShuffledColumn, gameMode, difficulty]);

  const startGame = (mode: GameMode, words: WordPair[] = allWords) => {
    setGameMode(mode);
    setCurrentWordBank(words);
    setGameState(GameState.PLAYING);
    isProcessingRef.current = false;
    
    if (mode === GameMode.TIMED) {
      const initialDifficulty = Difficulty.EASY;
      setDifficulty(initialDifficulty);
      setScore(0);
      setMatchesThisRound(0);
      setMatchesThisSession(0);
      setCurrentRound(1);
      setTimeLeft(GAME_CONFIG[initialDifficulty].timer);
      setUsedWordIds(new Set());
    } else { // Zen or Categorized Mode
      setCorrectMatches(0);
      setIncorrectMatches(0);
      setUsedWordIds(new Set());
    }
  };
  
  const handleCategorySelected = (categoryWords: WordPair[]) => {
      startGame(GameMode.CATEGORIZED, categoryWords);
  };
  
  // Effect to set up the board for a new round
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    isProcessingRef.current = false;
    const isTimed = gameMode === GameMode.TIMED;
    const config = isTimed ? GAME_CONFIG[difficulty] : { wordsOnScreen: 5 };

    setUsedWordIds(currentUsedIds => {
        let wordSource = currentWordBank;
        if (isTimed) {
            const targetLevel = difficultyLevelMap[difficulty];
            wordSource = currentWordBank.filter((w: WordPair) => w.level === targetLevel);
        }

        let availableWords = wordSource.filter((w: WordPair) => !currentUsedIds.has(w.id));
        let baseUsedIds = currentUsedIds;
        
        if (availableWords.length < config.wordsOnScreen) {
            console.warn("Word pool for this level exhausted. Resetting pool for level.");
            const levelWordIds = new Set(wordSource.map((w: WordPair) => w.id));
            baseUsedIds = new Set([...currentUsedIds].filter(id => !levelWordIds.has(id)));
            availableWords = [...wordSource];
        }

        const wordsForScreen = shuffleArray(availableWords).slice(0, config.wordsOnScreen);
        
        setArabicWords(shuffleArray(wordsForScreen));
        setEnglishWords(shuffleArray(wordsForScreen));

        const newUsedIds = new Set(baseUsedIds);
        wordsForScreen.forEach((w: WordPair) => newUsedIds.add(w.id));
        return newUsedIds;
    });

    setSelectedArabic(null);
    setSelectedEnglish(null);
    setIncorrectPair(null);

  }, [gameState, gameMode, currentRound, difficulty, currentWordBank]);

  // Effect for the game timer
  useEffect(() => {
    if (gameState === GameState.PLAYING && gameMode === GameMode.TIMED) {
      if (timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        updateGlobalStats(score, matchesThisSession);
        setGameState(GameState.GAME_OVER);
        return;
      }
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, gameMode, timeLeft, score, matchesThisSession, updateGlobalStats]);
  
  const handleSelection = (word: WordPair, type: 'ar' | 'en') => {
    if (isProcessingRef.current) return;

    if (type === 'ar') {
        setSelectedArabic(prev => (prev?.id === word.id ? null : word));
    } else {
        setSelectedEnglish(prev => (prev?.id === word.id ? null : word));
    }
  };
  
  // Effect to process a match
  useEffect(() => {
    if (selectedArabic && selectedEnglish) {
        isProcessingRef.current = true;
        
        if (selectedArabic.id === selectedEnglish.id) { // Correct Match
            setTimeout(() => {
                if (gameMode === GameMode.TIMED) {
                    setScore(s => s + GAME_CONFIG[difficulty].pointsPerMatch);
                    setMatchesThisRound(m => m + 1);
                    setMatchesThisSession(m => m + 1);
                } else {
                    setCorrectMatches(z => z + 1);
                    updateGlobalStats(0, 1);
                }
                replaceAndShuffle(selectedArabic.id);
            }, 300);
        } 
        else { // Incorrect Match
            if (gameMode === GameMode.TIMED) {
              setTimeLeft(prev => Math.max(0, prev - 1));
            } else {
              setIncorrectMatches(z => z + 1);
            }
            
            setIncorrectPair([selectedArabic.id, selectedEnglish.id]);
            setTimeout(() => {
                setSelectedArabic(null);
                setSelectedEnglish(null);
                setIncorrectPair(null);
                isProcessingRef.current = false;
            }, 500);
        }
    }
  }, [selectedArabic, selectedEnglish, gameMode, difficulty, replaceAndShuffle, updateGlobalStats]);


  // Effect to check for round/level completion
  useEffect(() => {
    if (gameMode !== GameMode.TIMED || gameState !== GameState.PLAYING) return;
    
    const config = GAME_CONFIG[difficulty];
    if (matchesThisRound > 0 && matchesThisRound >= config.matchesPerRound) {
        isProcessingRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState(GameState.LEVEL_UP);
    }
  }, [matchesThisRound, difficulty, gameMode, gameState]);

  const advanceRoundOrLevel = () => {
    const isLevelOver = currentRound >= TOTAL_ROUNDS_PER_LEVEL;

    if (isLevelOver) {
      const difficulties = Object.values(Difficulty);
      const currentIndex = difficulties.indexOf(difficulty);
      const nextIndex = currentIndex + 1;

      if (nextIndex < difficulties.length) {
        const nextDiff = difficulties[nextIndex];
        setDifficulty(nextDiff);
        setCurrentRound(1);
        setTimeLeft(GAME_CONFIG[nextDiff].timer);
      } else {
        updateGlobalStats(score, matchesThisSession);
        setGameState(GameState.GAME_OVER);
        return;
      }
    } else {
      setCurrentRound(r => r + 1);
    }
    setMatchesThisRound(0);
    setGameState(GameState.PLAYING);
  };

  const getStatus = (word: WordPair, type: 'ar' | 'en'): SelectionStatus => {
    const isSelected = (type === 'ar' && selectedArabic?.id === word.id) || (type === 'en' && selectedEnglish?.id === word.id);
    
    if (isProcessingRef.current && selectedArabic && selectedEnglish) {
        if (selectedArabic.id === selectedEnglish.id && isSelected) {
            return SelectionStatus.CORRECT;
        }
        if (incorrectPair && (word.id === incorrectPair[0] || word.id === incorrectPair[1])) {
            return SelectionStatus.INCORRECT;
        }
    }

    if (isSelected) return SelectionStatus.SELECTED;
    return SelectionStatus.NONE;
  };
  
  const backToMenu = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(GameState.MENU);
  };
  
  const handleExitTimed = () => {
    updateGlobalStats(score, matchesThisSession);
    backToMenu();
  };
  
  const renderGameScreen = () => (
     <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col items-center gap-6 h-screen">
       {gameMode === GameMode.TIMED ? (
        <>
        <div className="w-full flex justify-start items-center">
            <button onClick={() => setGameState(GameState.CONFIRM_EXIT)} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2">
                → العودة
            </button>
        </div>
        <Scoreboard score={score} level={difficulty} round={currentRound} matchesThisRound={matchesThisRound} matchesToWin={GAME_CONFIG[difficulty].matchesPerRound} timeLeft={timeLeft} />
        </>
       ) : (
        <div className="w-full flex justify-between items-center bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3">
            <button onClick={backToMenu} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2">
                → العودة
            </button>
            <div className="flex gap-6 text-center">
                <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">صحيحة</div>
                <div className="mt-1 font-bold text-2xl text-green-400">{correctMatches}</div>
                </div>
                <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">خاطئة</div>
                <div className="mt-1 font-bold text-2xl text-red-500">{incorrectMatches}</div>
                </div>
            </div>
        </div>
       )}
       <div className="w-full flex-1 grid grid-cols-2 gap-4 md:gap-8 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex flex-col gap-3" dir="rtl">
            {arabicWords.map((word: WordPair) => <WordButton key={`ar-${word.id}`} text={word.arabic} lang="ar" status={getStatus(word, 'ar')} onClick={() => handleSelection(word, 'ar')}/>)}
          </div>
          <div className="flex flex-col gap-3">
            {englishWords.map((word: WordPair) => <WordButton key={`en-${word.id}`} text={word.english} lang="en" status={getStatus(word, 'en')} onClick={() => handleSelection(word, 'en')}/>)}
          </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.3)'}}>تحدي المطابقة</h1>
        <p className="text-slate-300 mt-2 text-lg">أتقن مفردات جديدة واختبر سرعتك</p>
      </div>
       <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl w-full max-w-md mb-6 flex justify-around">
          <div className="text-center">
            <div className="text-sm text-slate-400">إجمالي النقاط</div>
            <div className="text-3xl font-bold text-cyan-400">{totalScore}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400">إجمالي المطابقات</div>
            <div className="text-3xl font-bold text-green-400">{totalMatches}</div>
          </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-200 mb-6">اختر وضع اللعب</h2>
        <div className="flex flex-col gap-4">
           <button onClick={() => setGameState(GameState.CATEGORY_SELECTION)} className="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-purple-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
            اللعب حسب الفئة 📚
          </button>
           <button onClick={() => startGame(GameMode.TIMED, allWords)} className="w-full bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-cyan-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
            تحدي الوقت
          </button>
           <button onClick={() => startGame(GameMode.ZEN, allWords)} className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-indigo-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
            وضع التدريب
          </button>
        </div>
      </div>
    </div>
  );

  const renderModals = () => {
    switch (gameState) {
      case GameState.LEVEL_UP:
        const difficulties = Object.values(Difficulty);
        const currentIndex = difficulties.indexOf(difficulty);
        const nextDiff = difficulties[currentIndex + 1];
        const isLastRoundOfLevel = currentRound >= TOTAL_ROUNDS_PER_LEVEL;
        
        let title = "انتهت الجولة!";
        let buttonLabel = `ابدأ الجولة ${currentRound + 1}`;
        if (isLastRoundOfLevel) {
            title = "اكتمل المستوى!";
            buttonLabel = nextDiff ? `ابدأ المستوى التالي (${DIFFICULTY_NAMES_AR[nextDiff]})` : "إنهاء اللعبة";
        }
        return (
          <Modal title={title} onConfirm={advanceRoundOrLevel} confirmButtonLabel={buttonLabel}>
            <p>عمل رائع! نتيجتك هي <span className="font-bold text-cyan-400 text-xl">{score}</span>.</p>
            <p>استعد للتحدي التالي.</p>
          </Modal>
        );

      case GameState.GAME_OVER:
        return (
          <Modal title="انتهت اللعبة" onConfirm={backToMenu} confirmButtonLabel="العودة للقائمة الرئيسية">
            <p>النتيجة النهائية: <span className="font-bold text-cyan-400 text-xl">{score}</span>.</p>
            <p>{timeLeft <= 0 ? "لقد نفذ وقتك!" : "تهانينا على إنهاء جميع المستويات!"}</p>
          </Modal>
        );

      case GameState.CONFIRM_EXIT:
        return (
          <Modal 
            title="تأكيد الخروج"
            onConfirm={handleExitTimed}
            confirmButtonLabel="نعم، اخرج"
            onCancel={() => setGameState(GameState.PLAYING)}
            cancelButtonLabel="لا، أكمل اللعب"
          >
            <p>هل أنت متأكد؟ ستُضاف نقاط ومطابقات هذه اللعبة إلى إحصائياتك الإجمالية.</p>
          </Modal>
        );
      default:
        return null;
    }
  };
  
  const renderCurrentState = () => {
    switch (gameState) {
      case GameState.MENU:
        return renderMenu();
      case GameState.CATEGORY_SELECTION:
        return <CategorySelector onCategorySelected={handleCategorySelected} onBack={() => setGameState(GameState.MENU)} />;
      case GameState.PLAYING:
      case GameState.CONFIRM_EXIT:
      case GameState.LEVEL_UP:
      case GameState.GAME_OVER: // Render game screen behind game over modal
        return renderGameScreen();
      default:
        return null;
    }
  }


  return (
    <>
      <main className="min-h-screen bg-slate-900 overflow-hidden pb-12">
        <ThemeSelector />
        {renderCurrentState()}
        {renderModals()}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 p-2 text-center text-xs text-slate-500 bg-slate-900/30 backdrop-blur-sm z-10">
        تم التطوير بواسطة مطور اللعبة
      </footer>
    </>
  );
};

export default App;
