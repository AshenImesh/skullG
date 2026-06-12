import React, { useEffect, useState, useRef } from 'react';
import type { Language, Mammal, GameHistoryItem } from '../types';
import { RefreshCw, Camera, AlertCircle, Compass, HelpCircle, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

interface RevealScreenProps {
  finalAnimalName: string;
  confidence: number;
  history: GameHistoryItem[];
  allCandidates: { name: string; probability: number }[];
  mammalsDatabase: Mammal[];
  onPlayAgain: () => void;
  lang: Language;
}

const revealTexts = {
  title: {
    en: 'Investigation Report',
    si: 'විමර්ශන වාර්තාව',
    ta: 'விசாரணை அறிக்கை'
  },
  confidenceLabel: {
    en: 'Confidence',
    si: 'විශ්වාසය',
    ta: 'நம்பகத்தன்மை'
  },
  photoTitle: {
    en: 'Animal Reference Photo',
    si: 'සතාගේ විමර්ශන ඡායාරූපය',
    ta: 'விலங்கு குறிப்பு புகைப்படம்'
  },
  skullTitle: {
    en: 'Skull Reference Diagram',
    si: 'කපාල විමර්ශන සටහන',
    ta: 'மண்டை ஓட்டு வரைபடம்'
  },
  closeMatches: {
    en: 'Morphological Relatives',
    si: 'කපාලමය වශයෙන් සමාන සතුන්',
    ta: 'வடிவவியல் உறவினர்கள்'
  },
  closeMatchesDesc: {
    en: 'These species share identical or highly similar skull characteristics. External markers differ as noted:',
    si: 'මෙම සතුන් සමාන කපාල ලක්ෂණ බෙදා ගනී. බාහිර ලක්ෂණ පහත පරිදි වෙනස් වේ:',
    ta: 'இந்த விலங்குகள் ஒரே மாதிரியான மண்டை ஓட்டு பண்புகளைக் கொண்டுள்ளன. அவற்றின் வெளிப்புற வேறுபாடுகள்:'
  },
  dietChart: {
    en: 'Diet Biochemistry Radar',
    si: 'ආහාර ජෛව රසායන රේඩාර් සටහන',
    ta: 'உணவு உயிர்வேதியியல் வரைபடம்'
  },
  scoreLabel: {
    en: 'Carnivory Score',
    si: 'මාංශ භක්ෂක ලකුණු',
    ta: 'மாமிச உண்ணி மதிப்பீடு'
  },
  playAgain: {
    en: 'Abduce Another Animal',
    si: 'නැවත පරීක්ෂණයක් කරන්න',
    ta: 'மீண்டும் விளையாடு'
  },
  qrTitle: {
    en: 'Scan to Export Report',
    si: 'වාර්තාව අපනයනය කිරීමට ස්කෑන් කරන්න',
    ta: 'அறிக்கையைப் பகிர ஸ்கேன் செய்'
  },
  qrText: {
    en: 'Scan to view this detective log on your mobile.',
    si: 'මෙම විමර්ශන වාර්තාව ඔබගේ ජංගම දුරකථනයෙන් නැරඹීමට ස්කෑන් කරන්න.',
    ta: 'இந்த விசாரணைப் பதிவை உங்கள் மொபைலில் பார்க்க ஸ்கேன் செய்யவும்.'
  },
  chemistryTitle: {
    en: '🧪 Digestive Biochemistry Analysis',
    si: '🧪 ආහාර ජීර්ණ ජෛව රසායනික විශ්ලේෂණය',
    ta: '🧪 செரிமான உயிர்வேதியியல் பகுப்பாய்வு'
  }
};

const biochemChemTexts = {
  Carnivore: {
    en: 'High protease enzyme concentration; extremely low stomach gastric pH (~1.5) for protein denaturation; short digestive tract; no cellulase production.',
    si: 'ඉහළ ප්‍රෝටියේස් එන්සයිම සාන්ද්‍රණය; ප්‍රෝටීන් බිඳීමට ඉතා අඩු ආමාශයික pH (~1.5); කෙටි ආහාර මාර්ගය; සෙලියුලේස් නිපදවන්නේ නැත.',
    ta: 'அதிக புரோட்டேஸ் நொதி செறிவு; புரதத்தை சிதைக்க மிகக் குறைந்த வயிற்று அமில pH (~1.5); குறுகிய செரிமானப் பாதை; செல்லுலேஸ் உற்பத்தி இல்லை.'
  },
  Herbivore: {
    en: 'Relies on symbiotic enteric bacteria for cellulase; multi-chambered stomach or highly enlarged cecum; neutral to basic pH; long complex tract.',
    si: 'සෙලියුලේස් බිඳීමට සහජීවී බඩවැල් බැක්ටීරියා මත රඳා පවතී; බහු කුටීර ආමාශය හෝ විශාල වූ අන්ධන්ත්‍රය; උදාසීන pH අගයක්; දිගු සංකීර්ණ මාර්ගය.',
    ta: 'செல்லுலேஸை ஜீரணிக்க குடல் பாக்டீரியாக்களை நம்பியுள்ளது; பல அறை வயிறு அல்லது பெரிய குடல்; நடுநிலை pH; நீண்ட செரிமானப் பாதை.'
  },
  Omnivore: {
    en: 'Balanced amylase, protease, and lipase production; highly adaptable digestive enzymes; intermediate gut length and variable gastric pH.',
    si: 'සමබර ඇමයිලේස්, ප්‍රෝටියේස් සහ ලයිපේස් නිෂ්පාදනය; අනුවර්තනය විය හැකි එන්සයිම; මධ්‍යම දිග ආහාර මාර්ගය සහ විචල්‍ය pH අගය.',
    ta: 'சீரான அமிலேஸ், புரோட்டேஸ் மற்றும் லிபேஸ் உற்பத்தி; எளிதில் மாற்றமடையும் செரிமான நொதிகள்; நடுத்தர குடல் நீளம் மற்றும் மாறுபடும் pH.'
  },
  Insectivore: {
    en: 'Production of active chitinase enzymes to dissolve chitinous insect exoskeletons; rapid protein metabolism; specialized strong stomach acid.',
    si: 'කෘමීන්ගේ කයිටිනීය බාහිර සැකිල්ල දියකර හැරීමට සක්‍රීය කයිටිනේස් එන්සයිම නිපදවීම; වේගවත් ප්‍රෝටීන් පරිවෘත්තීය; විශේෂිත ප්‍රබල ආමාශ අම්ලය.',
    ta: 'பூச்சிகளின் கைட்டின் ஓடுகளைக் கரைக்க செயலில் உள்ள கைட்டினேஸ் நொதிகள்; விரைவான புரத வளர்சிதை மாற்றம்; வலுவான வயிற்று அமிலம்.'
  }
};

export const RevealScreen: React.FC<RevealScreenProps> = ({
  finalAnimalName,
  confidence,
  history,
  allCandidates,
  mammalsDatabase,
  onPlayAgain,
  lang
}) => {
  const t = (key: keyof typeof revealTexts) => revealTexts[key][lang];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Wikipedia image states
  const [animalImg, setAnimalImg] = useState<string | null>(null);
  const [skullImg, setSkullImg] = useState<string | null>(null);
  const [animalLoading, setAnimalLoading] = useState(true);
  const [skullLoading, setSkullLoading] = useState(true);

  // Get current mammal object
  const mammal = mammalsDatabase.find((m) => m['Common Name'] === finalAnimalName);

  // Get potential matches with identical/close profiles

  const closeRelatives = allCandidates
    .filter((c) => c.name !== finalAnimalName && c.probability > 0.05)
    .map((c) => mammalsDatabase.find((m) => m['Common Name'] === c.name))
    .filter((m): m is Mammal => !!m);

  // Trigger celebration on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#3b82f6']
    });
  }, []);

  // Fetch wikipedia images
  useEffect(() => {
    if (!mammal) return;

    setAnimalLoading(true);
    setSkullLoading(true);
    setAnimalImg(null);
    setSkullImg(null);

    // Fetch animal photo
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&origin=*&titles=${encodeURIComponent(
        mammal['Common Name']
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pages[pageId]?.thumbnail) {
            setAnimalImg(pages[pageId].thumbnail.source);
          }
        }
        setAnimalLoading(false);
      })
      .catch(() => setAnimalLoading(false));

    // Fetch skull reference
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(
        mammal['Common Name'] + ' skull'
      )}&srlimit=1`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.query?.search?.length > 0) {
          return fetch(
            `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&origin=*&titles=${encodeURIComponent(
              data.query.search[0].title
            )}`
          );
        }
        throw new Error('No skull found');
      })
      .then((r) => r.json())
      .then((data) => {
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pages[pageId]?.thumbnail) {
            setSkullImg(pages[pageId].thumbnail.source);
          }
        }
        setSkullLoading(false);
      })
      .catch(() => setSkullLoading(false));
  }, [mammal]);

  // Generate QR Code
  useEffect(() => {
    if (!canvasRef.current || !mammal) return;

    const cluesText = history
      .map((h, i) => `${i + 1}. ${h.trait.toString()}: ${h.answerLabel}`)
      .join('\n');
    const textToEncode = `🔬 SKULL DETECTIVE REPORT\nAnimal: ${mammal['Common Name']} (${
      mammal['Scientific Name']
    })\nConfidence: ${confidence.toFixed(1)}%\nOrder: ${mammal.Order}\nDiet: ${
      mammal['Diet Category']
    }\n\nDetective Path:\n${cluesText}`;

    QRCode.toCanvas(
      canvasRef.current,
      textToEncode,
      {
        width: 140,
        margin: 1,
        color: {
          dark: '#06b6d4',
          light: '#05070c'
        }
      },
      (error) => {
        if (error) console.error('QR code generation failed:', error);
      }
    );
  }, [mammal, history, confidence]);

  if (!mammal) return null;

  // Radar chart calculations
  const diet = mammal['Diet Category'] as 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Insectivore';
  let p = 20, f = 20, fa = 20, s = 20, c = 20, mi = 20;

  if (diet === 'Carnivore') {
    p = 90; fa = 70; f = 10; s = 10; c = 20; mi = 30;
  } else if (diet === 'Herbivore') {
    p = 30; fa = 20; f = 90; s = 40; c = 10; mi = 40;
  } else if (diet === 'Omnivore') {
    p = 60; fa = 50; f = 50; s = 60; c = 20; mi = 30;
  } else if (diet === 'Insectivore') {
    p = 70; fa = 40; f = 20; s = 10; c = 90; mi = 20;
  }

  const scoreNum = parseFloat(mammal['Carnivory Score (0-10)']) || 0;
  // Adjust values slightly based on Carnivory Score
  p = Math.min(100, Math.round(p + (scoreNum / 10) * 10));
  f = Math.max(10, Math.round(f - (scoreNum / 10) * 20));

  // Render SVG Radar Chart
  const cx = 100, cy = 90, r = 65;
  const axes = ['Protein', 'Fibre', 'Fat', 'Starch', 'Chitin', 'Mineral'];
  const values = [p, f, fa, s, c, mi];
  
  let radarPolygons = '';
  // Background grid hexagons
  for (let l = 1; l <= 4; l++) {
    const pts = axes
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        return `${cx + (r * l) / 4 * Math.cos(angle)},${cy + (r * l) / 4 * Math.sin(angle)}`;
      })
      .join(' ');
    radarPolygons += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  }

  // Axes lines & labels
  const axesElements = axes.map((axis, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const lx = cx + (r + 15) * Math.cos(angle);
    const ly = cy + (r + 12) * Math.sin(angle);
    return (
      <g key={axis}>
        <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <text
          x={lx}
          y={ly}
          fill="#94a3b8"
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {axis}
        </text>
      </g>
    );
  });

  // Data point values polygon
  const dataPoints = values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      return `${cx + (v / 100) * r * Math.cos(angle)},${cy + (v / 100) * r * Math.sin(angle)}`;
    })
    .join(' ');

  // Interactive details for chemistry box
  const chemDesc = biochemChemTexts[diet]?.[lang] || biochemChemTexts[diet]?.en || 'Complex digestive tract details.';

  return (
    <div className="flex flex-col gap-6 animate-fade-in flex-1">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-cyan-400 glow-text uppercase tracking-wider">
            {t('title')}
          </h2>
        </div>
      </div>

      {/* Main Grid: Three columns on large desktop, wrapping otherwise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column: Specimen Identity and Photos */}
        <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center pb-2 border-b border-slate-800/60">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
              {mammal.Order}
            </span>
            <h3 className="text-3xl font-black text-emerald-400 glow-text-success uppercase tracking-wide leading-tight">
              {mammal['Common Name']}
            </h3>
            <span className="text-sm text-slate-400 italic">
              {mammal['Scientific Name']}
            </span>
            
            <div className="mt-3 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {t('confidenceLabel')}
              </span>
              <span className="text-3xl font-black text-cyan-400 glow-text">
                {confidence.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Animal Photo Frame */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Camera size={14} className="text-cyan-400" />
              {t('photoTitle')}
            </span>
            <div className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
              {animalLoading ? (
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              ) : animalImg ? (
                <img src={animalImg} alt={mammal['Common Name']} className="w-full h-full object-cover" />
              ) : (
                <HelpCircle size={32} className="text-slate-700" />
              )}
            </div>
          </div>

          {/* Skull Photo Frame */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Compass size={14} className="text-cyan-400" />
              {t('skullTitle')}
            </span>
            <div className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
              {skullLoading ? (
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              ) : skullImg ? (
                <img src={skullImg} alt={mammal['Common Name'] + ' skull'} className="w-full h-full object-cover" />
              ) : (
                <HelpCircle size={32} className="text-slate-700" />
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Biology Metrics & Biochemistry */}
        <div className="glass-panel p-6 flex flex-col justify-between gap-6">
          {/* Characteristic Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Diet', val: mammal['Diet Category'] },
              { label: 'Habitat', val: mammal['Habitat (Terrestrial)'] },
              { label: 'Social Structure', val: mammal['Social Structure'] },
              { label: 'Activity Pattern', val: mammal['Activity Pattern'] },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-lg flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                  {stat.label}
                </span>
                <span className="text-slate-200 font-extrabold text-sm capitalize mt-1">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

          {/* Carnivory Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wide">{t('scoreLabel')}</span>
              <span className="font-black text-cyan-400">{scoreNum}/10</span>
            </div>
            {/* Custom slider tracks */}
            <div className="w-full h-2.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full relative border border-slate-800">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-1000"
                style={{ left: `calc(${scoreNum * 10}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1">
              <span>Herbivore</span>
              <span>Omnivore</span>
              <span>Carnivore</span>
            </div>
          </div>

          {/* Digest Biochemistry block */}
          <div className="glass-panel p-4 border-l-4 border-l-cyan-500 bg-cyan-950/5 flex flex-col gap-1.5">
            <h4 className="text-cyan-400 font-extrabold uppercase text-[10px] tracking-wider">
              {t('chemistryTitle')}
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              {chemDesc}
            </p>
          </div>

          {/* Play Again button */}
          <button onClick={onPlayAgain} className="btn-primary py-4 px-6 justify-center w-full mt-2 text-base">
            <RefreshCw size={18} />
            {t('playAgain')}
          </button>
        </div>

        {/* Right Column: Biochemistry Radar & QR Export */}
        <div className="glass-panel p-6 flex flex-col justify-between items-center gap-6">
          {/* Radar Chart Container */}
          <div className="flex flex-col items-center gap-2 w-full">
            <h4 className="font-extrabold text-xs uppercase text-slate-300 tracking-wider w-full text-left border-b border-slate-800 pb-2 mb-2">
              {t('dietChart')}
            </h4>
            
            {/* Custom SVG Radar Chart */}
            <div className="w-full max-w-[210px] aspect-square flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 180">
                {/* Render hexagons */}
                <g dangerouslySetInnerHTML={{ __html: radarPolygons }} />
                
                {/* Axes and text labels */}
                {axesElements}
                
                {/* Data Polygon */}
                <polygon
                  points={dataPoints}
                  fill="rgba(6,182,212,0.22)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data point dot markers */}
                {values.map((v, i) => {
                  const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                  const dotX = cx + (v / 100) * r * Math.cos(angle);
                  const dotY = cy + (v / 100) * r * Math.sin(angle);
                  return (
                    <circle
                      key={i}
                      cx={dotX}
                      cy={dotY}
                      r={3.5}
                      fill="#06b6d4"
                      stroke="#05070c"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Close Relatives (Sibling Species) */}
          {closeRelatives.length > 0 && (
            <div className="w-full flex flex-col gap-2">
              <h4 className="font-extrabold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <AlertCircle size={14} className="text-amber-500" />
                {t('closeMatches')}
              </h4>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                <p className="text-[10px] text-slate-400 leading-normal mb-1">
                  {t('closeMatchesDesc')}
                </p>
                {closeRelatives.map((rel) => (
                  <div key={rel['Common Name']} className="bg-slate-900/60 border border-slate-800 p-2 rounded text-[10px] leading-relaxed">
                    <strong className="text-slate-200 uppercase tracking-wide block">{rel['Common Name']}</strong>
                    <span className="text-slate-400">{rel['Notes / Distinguishing Features']}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code Canvas */}
          <div className="qr-container bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center gap-4 w-full">
            <canvas ref={canvasRef} className="w-24 h-24 rounded border border-cyan-500/20 bg-slate-950" />
            <div className="flex-1 flex flex-col gap-1 text-left">
              <span className="font-extrabold text-cyan-400 text-xs flex items-center gap-1">
                <QrCode size={12} />
                {t('qrTitle')}
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">
                {t('qrText')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
