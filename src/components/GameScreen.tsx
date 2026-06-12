import React, { useState, useEffect } from 'react';
import type { Language, GameHistoryItem, QuestionData } from '../types';
import { Brain, Cpu, AlertCircle, ListOrdered } from 'lucide-react';

interface GameScreenProps {
  currentQuestion: QuestionData | null;
  questionNumber: number;
  maxQuestions: number;
  remainingCandidatesCount: number;
  topCandidates: { name: string; probability: number }[];
  history: GameHistoryItem[];
  phase: string;
  onAnswer: (value: string) => void;
  onExit: () => void;
  lang: Language;
}

const gameTexts = {
  topGuess: {
    en: 'Top Guess Confidence',
    si: 'ඉහළම අනුමානයේ විශ්වාසය',
    ta: 'உயர்ந்த ஊக நம்பிக்கை'
  },
  remaining: {
    en: 'Candidates Remaining',
    si: 'අපේක්ෂිතයන් ඉතිරිව ඇත',
    ta: 'மீதமுள்ள வேட்பாளர்கள்'
  },
  aiTitle: {
    en: 'AI Analysis Console',
    si: 'AI විශ්ලේෂණ කොන්සෝලය',
    ta: 'AI பகுப்பாய்வு கன்சோல்'
  },
  aiCalculating: {
    en: 'Recalculating prior/posterior probabilities...',
    si: 'බේසියානු සම්භාවිතාවන් යළි ගණනය කරමින්...',
    ta: 'பண்புகளை பகுப்பாய்வு செய்கிறது...'
  },
  detectiveLog: {
    en: 'Investigation Log',
    si: 'පරීක්ෂණ සටහන',
    ta: 'விசாரணைப் பதிவு'
  },
  logEmpty: {
    en: 'No clues gathered yet.',
    si: 'තවමත් කිසිදු හෝඩුවාවක් නැත.',
    ta: 'இன்னும் தடயங்கள் சேகரிக்கப்படவில்லை.'
  },
  exit: {
    en: 'Abort Investigation',
    si: 'පරීක්ෂණය නවත්වන්න',
    ta: 'விசாரணையை ரத்து செய்'
  },
  entropy: {
    en: 'Entropy',
    si: 'එන්ට්‍රොපිය',
    ta: 'என்ட்ரோபி'
  }
};

export const GameScreen: React.FC<GameScreenProps> = ({
  currentQuestion,
  questionNumber,
  maxQuestions,
  remainingCandidatesCount,
  topCandidates,
  history,
  phase,
  onAnswer,
  onExit,
  lang
}) => {
  const t = (key: keyof typeof gameTexts) => gameTexts[key][lang];

  // Simulated AI "thinking" state when question changes
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => {
      setIsThinking(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  // Calculate entropy before/after display values
  const latestHistory = history[history.length - 1];
  const entropyVal = latestHistory ? latestHistory.entropyAfter.toFixed(3) : '7.942'; // Max Shannon entropy for 246 items

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in flex-1">
      
      {/* Left Column: Bayesian Monitor (1 span) */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        {/* Phase Indicator */}
        <div className="glass-panel p-4 text-center border-l-4 border-l-cyan-500 bg-cyan-950/5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block mb-1">
            Bayesian Phase
          </span>
          <h4 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
            {phase}
          </h4>
        </div>

        {/* Confidence display */}
        <div className="glass-panel p-5 text-center flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            {t('topGuess')}
          </span>
          <div className="text-4xl font-black text-cyan-400 glow-text">
            {topCandidates[0] ? (topCandidates[0].probability * 100).toFixed(1) : '0.0'}%
          </div>
          <span className="text-xs font-semibold text-slate-300 mt-2 line-clamp-1">
            {topCandidates[0] ? topCandidates[0].name.toUpperCase() : 'Analyzing...'}
          </span>
        </div>

        {/* Top 5 Probability Chart */}
        <div className="glass-panel p-5 flex flex-col gap-3 flex-1">
          <h4 className="font-extrabold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Cpu size={14} className="text-cyan-400" />
            Top Candidates
          </h4>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {topCandidates.slice(0, 5).map((cand, idx) => {
              const pct = (cand.probability * 100).toFixed(1);
              return (
                <div key={cand.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300 line-clamp-1">
                      {idx + 1}. {cand.name}
                    </span>
                    <span className="font-black text-cyan-400">{pct}%</span>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: '#06b6d4' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Columns: Active Question Panel (2 spans) */}
      <div className="lg:col-span-2 flex flex-col gap-6 glass-panel p-6 md:p-8 relative justify-between overflow-hidden">
        {/* Scanning animation layer when thinking */}
        {isThinking && (
          <div className="absolute inset-0 bg-slate-950/60 z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              {t('aiCalculating')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <span className="text-sm font-bold text-slate-400">
            Question {questionNumber} of {maxQuestions}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            {t('entropy')}: {entropyVal} bits
          </span>
        </div>

        {/* Question Content */}
        <div className="flex flex-col gap-5 my-auto py-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-wide leading-tight">
            {currentQuestion.q[lang]}
          </h2>

          <div className="pl-4 border-l-3 border-cyan-500 text-cyan-300 text-sm italic py-1 bg-cyan-950/5">
            {currentQuestion.hint[lang]}
          </div>

          {/* Dynamic AI Analysis Details */}
          <div className="glass-panel p-4 bg-slate-950/50 border-cyan-500/15 flex gap-3 items-start">
            <Brain size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col text-xs leading-relaxed text-slate-400">
              <span className="font-extrabold text-slate-300 uppercase tracking-wide text-[10px] mb-1">
                {t('aiTitle')}
              </span>
              <span>
                Evaluating <strong>{remainingCandidatesCount} candidates</strong>. Asking about <strong>{currentQuestion.trait.toString()}</strong> because it splits the remaining candidates with optimal information gain, reducing biological state uncertainty.
              </span>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {Object.entries(currentQuestion.options).map(([value, labelDict], idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D...
            return (
              <button
                key={value}
                onClick={() => onAnswer(value)}
                className="glass-panel p-4 text-left transition-all hover:bg-cyan-950/15 hover:border-cyan-500/30 flex items-center gap-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 font-extrabold text-sm group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-500 transition-all flex-shrink-0">
                  {letter}
                </div>
                <span className="text-slate-200 font-bold text-sm leading-snug group-hover:text-slate-100">
                  {labelDict[lang]}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors font-semibold mt-6 uppercase tracking-wider text-center mx-auto"
        >
          {t('exit')}
        </button>
      </div>

      {/* Right Column: Detective Log / History (1 span) */}
      <div className="lg:col-span-1 flex flex-col glass-panel p-5">
        <h4 className="font-extrabold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-3">
          <ListOrdered size={14} className="text-cyan-400" />
          {t('detectiveLog')}
        </h4>

        <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-600 text-xs py-12 text-center h-full">
              <AlertCircle size={28} />
              <span>{t('logEmpty')}</span>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.trait.toString()}
                className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg flex flex-col gap-1.5 text-xs animate-fade-in"
              >
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Clue #{idx + 1}</span>
                  <span className="text-cyan-400">-{Math.max(0, item.entropyBefore - item.entropyAfter).toFixed(2)} bits</span>
                </div>
                <div className="font-bold text-slate-200 leading-snug">
                  {item.questionText}
                </div>
                <div className="flex justify-between items-center mt-1 text-slate-300">
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-300 border border-slate-700">
                    {item.answerLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    {item.remainingCount} left
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
