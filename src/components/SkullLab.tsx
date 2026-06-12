import React, { useState } from 'react';
import type { Language } from '../types';
import { MOLAR_GUIDE_DATA } from '../data/questions';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

interface SkullLabProps {
  onBack: () => void;
  lang: Language;
}

const labTexts = {
  title: {
    en: 'Dental Morphology Lab',
    si: 'දන්ත රූපවිද්‍යා රසායනාගාරය',
    ta: 'பல் வடிவவியல் ஆய்வகம்'
  },
  subtitle: {
    en: 'Analyze dental adaptations and chewing mechanisms of terrestrial mammals. Select a molar structure to inspect its shape and dietary specialization.',
    si: 'ගොඩබිම් ක්ෂීරපායීන්ගේ දත්වල අනුවර්තනයන් සහ හැපීමේ ක්‍රියාවලිය විශ්ලේෂණය කරන්න. හැඩය සහ ආහාර විශේෂීකරණය පරීක්ෂා කිරීමට මෝලර් දතක් තෝරන්න.',
    ta: 'பாலூட்டிகளின் பல் அமைப்புகளையும் மெல்லும் திறனையும் ஆராயுங்கள். அவற்றின் வடிவத்தையும் உணவு முறையையும் அறிய ஒரு பல் அமைப்பைத் தேர்ந்தெடுக்கவும்.'
  },
  back: {
    en: 'Back to Menu',
    si: 'ප්‍රධාන මෙනුවට',
    ta: 'முதன்மைப் பக்கம்'
  },
  anatomyTitle: {
    en: 'Molar Specimen Details',
    si: 'මෝලර් දත් ව්‍යුහ විස්තරය',
    ta: 'பல் மாதிரி விவரங்கள்'
  },
  dietLink: {
    en: 'Dietary Link',
    si: 'ආහාර සම්බන්ධතාවය',
    ta: 'உணவுத் தொடர்பு'
  },
  selectPrompt: {
    en: 'Select a molar type from the list to begin structural analysis.',
    si: 'ව්‍යුහ විශ්ලේෂණය ආරම්භ කිරීම සඳහා ලැයිස්තුවෙන් මෝලර් දත් වර්ගයක් තෝරන්න.',
    ta: 'பகுப்பாய்வைத் தொடங்க பட்டியலிலிருந்து ஒரு பல் வகையைத் தேர்ந்தெடுக்கவும்.'
  }
};

export const SkullLab: React.FC<SkullLabProps> = ({ onBack, lang }) => {
  const [selectedMolar, setSelectedMolar] = useState<string>('Carnassial');
  const t = (key: keyof typeof labTexts) => labTexts[key][lang];

  const molarData = MOLAR_GUIDE_DATA[selectedMolar];

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
            <Sparkles size={24} className="text-cyan-400" />
            {t('title')}
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Lab Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left Panel - Selection Grid */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          {Object.keys(MOLAR_GUIDE_DATA).map((key) => {
            const molar = MOLAR_GUIDE_DATA[key];
            const isSelected = selectedMolar === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMolar(key)}
                className={`glass-panel p-5 text-left transition-all duration-300 flex items-center gap-4 ${
                  isSelected
                    ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'hover:border-slate-700 hover:bg-slate-900/30'
                }`}
              >
                <div
                  className={`w-14 h-14 p-1 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                    isSelected ? 'border-cyan-500/30 text-cyan-400' : 'border-slate-800 text-slate-400'
                  }`}
                  dangerouslySetInnerHTML={{ __html: molar.svgIcon }}
                />
                <div>
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                    {molar.name}
                  </h3>
                  <span className="text-xs text-slate-400 line-clamp-1">
                    {molar.description[lang].slice(0, 55)}...
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Panel - Detailed Specimen Viewer */}
        <div className="lg:col-span-2 flex flex-col glass-panel p-6 md:p-8 relative overflow-hidden">
          {/* Subtle background tech grid design */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {molarData ? (
            <div className="flex flex-col gap-6 h-full relative z-10 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Visualizer Frame */}
                <div className="w-full md:w-64 h-64 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-6 shadow-inner flex-shrink-0">
                  <div className="w-full h-full text-cyan-400 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: molarData.svgIcon }} />
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full w-max">
                    {t('anatomyTitle')}
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-100 uppercase tracking-wide">
                    {molarData.name} Molar
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-base">
                    {molarData.description[lang]}
                  </p>
                </div>
              </div>

              {/* Diet Biochemistry Connection */}
              <div className="mt-auto border-t border-slate-800/80 pt-6">
                <div className="glass-panel p-5 border-l-4 border-l-emerald-500 bg-emerald-950/5 flex gap-4 items-start">
                  <BookOpen size={24} className="text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-extrabold text-emerald-400 uppercase text-xs tracking-wider mb-1">
                      {t('dietLink')}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {molarData.dietLink[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-12">
              <BookOpen size={48} />
              <p className="text-center font-medium">{t('selectPrompt')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
