import React, { useState } from 'react';
import type { Language, Mammal } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { getLikelihood } from '../utils/bayesian';
import { ArrowLeft, BrainCircuit, RotateCcw, Sparkles } from 'lucide-react';
import databaseRaw from '../data/ultimate_mammal_database.json';

const mammalsDatabase = databaseRaw as Mammal[];

interface CustomAnimalLabProps {
  onBack: () => void;
  lang: Language;
}

const customTexts = {
  title: {
    en: 'Custom Classifier Lab',
    si: 'අභිරුචි වර්ගීකරණ පර්යේෂණාගාරය',
    ta: 'வகைப்பாட்டு ஆய்வகம்'
  },
  subtitle: {
    en: 'Input morphological parameters for an unknown skull specimen, and the Bayesian AI engine will classify it against the mammal database.',
    si: 'නොදන්නා කපාල නිදර්ශකයක් සඳහා රූපවිද්‍යාත්මක පරාමිතීන් ඇතුළත් කරන්න, එවිට බේසියානු AI එන්ජිම එය ක්ෂීරපායී දත්ත ගබඩාව සමඟ සංසන්දනය කර වර්ගීකරණය කරනු ඇත.',
    ta: 'அறியப்படாத மண்டை ஓட்டு மாதிரியின் அளவீடுகளை உள்ளீடு செய்து, எங்கள் பேசியன் AI அதை பாலூட்டி தரவுத்தளத்துடன் ஒப்பிட்டு வகைப்படுத்துவதைப் பாருங்கள்.'
  },
  back: {
    en: 'Back to Menu',
    si: 'ප්‍රධාන මෙනුවට',
    ta: 'முதன்மைப் பக்கம்'
  },
  classify: {
    en: 'Classify Specimen',
    si: 'නිදර්ශකය වර්ගීකරණය කරන්න',
    ta: 'மாதிரியை வகைப்படுத்து'
  },
  reset: {
    en: 'Reset Form',
    si: 'පෝරමය යළි සකසන්න',
    ta: 'படிவத்தை மீட்டமை'
  },
  resultsTitle: {
    en: 'AI Classification Report',
    si: 'AI වර්ගීකරණ වාර්තාව',
    ta: 'AI வகைப்பாடு அறிக்கை'
  },
  noResults: {
    en: 'Select traits and click Classify Specimen to run the Bayesian engine.',
    si: 'ලක්ෂණ තෝරා බේසියානු එන්ජිම ක්‍රියාත්මක කිරීමට නිදර්ශකය වර්ගීකරණය කරන්න බොත්තම ඔබන්න.',
    ta: 'பண்புகளைத் தேர்ந்தெடுத்து, பேசியன் எஞ்சினை இயக்க மாதிரியை வகைப்படுத்து பொத்தானை அழுத்தவும்.'
  },
  matchingFeatures: {
    en: 'Matching Features',
    si: 'ගැලපෙන ලක්ෂණ',
    ta: 'பொருந்தும் பண்புகள்'
  }
};

export const CustomAnimalLab: React.FC<CustomAnimalLabProps> = ({ onBack, lang }) => {
  const t = (key: keyof typeof customTexts) => customTexts[key][lang];

  // Store selections for the 11 traits
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ mammal: Mammal; probability: number; matchCount: number }[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleSelect = (trait: string, value: string) => {
    setSelections((prev) => ({ ...prev, [trait]: value }));
  };

  const handleReset = () => {
    setSelections({});
    setResults([]);
    setIsAnalyzed(false);
  };

  const handleClassify = () => {
    // Run Bayesian classification
    const prior = 1 / mammalsDatabase.length;
    const rawScores: Record<string, number> = {};
    const matches: Record<string, number> = {};
    let sum = 0;

    mammalsDatabase.forEach((m) => {
      let likelihood = 1;
      let matchCount = 0;

      // Multiply likelihoods for each user selection
      Object.entries(selections).forEach(([trait, selectedVal]) => {
        const mVal = m[trait as keyof Mammal] || '';
        const score = getLikelihood(trait as keyof Mammal, mVal, selectedVal);
        likelihood *= score;
        
        if (mVal.trim().toLowerCase() === selectedVal.trim().toLowerCase()) {
          matchCount++;
        }
      });

      const posterior = prior * likelihood;
      rawScores[m['Common Name']] = posterior;
      matches[m['Common Name']] = matchCount;
      sum += posterior;
    });

    // Normalize probabilities and sort
    const scoredList = mammalsDatabase.map((m) => {
      const name = m['Common Name'];
      const probability = sum > 0 ? rawScores[name] / sum : 0;
      return {
        mammal: m,
        probability,
        matchCount: matches[name] ?? 0
      };
    });

    // Sort by probability desc
    scoredList.sort((a, b) => b.probability - a.probability);
    setResults(scoredList.slice(0, 5));
    setIsAnalyzed(true);
  };

  // Check if form is partially filled
  const isFormValid = Object.keys(selections).length >= 3;

  return (
    <div className="flex flex-col gap-6 animate-fade-in flex-1">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-2 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            {t('back')}
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 glow-text flex items-center gap-2">
            <BrainCircuit size={24} className="text-cyan-400" />
            {t('title')}
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Panel: Specimen Inputs */}
        <div className="glass-panel p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-lg text-slate-200 uppercase tracking-wide">
              Specimen Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <RotateCcw size={12} />
              {t('reset')}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {QUESTIONS_DATA.map((q) => {
              const selectedValue = selections[q.trait as string] || '';
              return (
                <div key={q.trait as string} className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-300">
                    {q.q[lang]}
                  </label>
                  <select
                    value={selectedValue}
                    onChange={(e) => handleSelect(q.trait as string, e.target.value)}
                    className="select-input p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm w-full outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Select State --</option>
                    {Object.entries(q.options).map(([valKey, valTexts]) => (
                      <option key={valKey} value={valKey}>
                        {valTexts[lang]}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleClassify}
            disabled={!isFormValid}
            className="btn-primary py-4 px-6 justify-center w-full mt-4 text-base"
          >
            <BrainCircuit size={18} />
            {t('classify')}
          </button>
          {!isFormValid && (
            <span className="text-xs text-amber-500 text-center font-semibold">
              Select at least 3 parameters to run classification.
            </span>
          )}
        </div>

        {/* Right Panel: Classification Results */}
        <div className="glass-panel p-6 flex flex-col gap-5">
          <h3 className="font-extrabold text-lg text-slate-200 uppercase tracking-wide border-b border-slate-800 pb-3">
            {t('resultsTitle')}
          </h3>

          {isAnalyzed ? (
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
              {results.map((res, i) => {
                const pct = (res.probability * 100).toFixed(1);
                const isMatch = res.probability > 0.05;

                return (
                  <div
                    key={res.mammal['Common Name']}
                    className={`glass-panel p-4 flex flex-col gap-3 transition-all ${
                      i === 0 && isMatch
                        ? 'border-cyan-500/50 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'border-slate-800 bg-slate-900/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-400">#{i + 1}</span>
                          <h4 className="font-black text-slate-100 uppercase tracking-wide text-base">
                            {res.mammal['Common Name']}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400 italic">
                          {res.mammal['Scientific Name']} | {res.mammal['Order']}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-extrabold ${i === 0 && isMatch ? 'text-cyan-400' : 'text-slate-300'}`}>
                          {pct}%
                        </span>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          Probability
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          i === 0 && isMatch
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${pct}%`, backgroundColor: i === 0 && isMatch ? '#06b6d4' : '#64748b' }}
                      />
                    </div>

                    {/* Meta stats */}
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{t('matchingFeatures')}: <strong>{res.matchCount} / {Object.keys(selections).length}</strong></span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                        {res.mammal['Diet Category']}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-12 flex-1">
              <Sparkles size={48} className="text-slate-600 animate-pulse" />
              <p className="text-center font-medium max-w-xs">{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
