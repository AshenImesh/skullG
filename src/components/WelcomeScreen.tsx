import React, { useEffect, useRef } from 'react';
import type { Language } from '../types';
import { Play, BookOpen, Compass, Activity } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: () => void;
  onOpenEncyclopedia: () => void;
  onOpenSkullLab: () => void;
  onOpenCustomLab: () => void;
  lang: Language;
}

const welcomeTexts = {
  title: {
    en: 'Skull Detective',
    si: 'කපාල විමර්ශක',
    ta: 'ஓடு உளவு'
  },
  subtitle: {
    en: 'Think of any ground-dwelling mammal. I will analyze its skull morphology and biology using Bayesian Inference & Information Gain to identify your animal.',
    si: 'ඕනෑම බිම්වාසී ක්ෂීරපායියෙකු ගැන සිතන්න. බේසියානු අනුමාන සහ තොරතුරු ලාභය භාවිතයෙන් මම කපාල ව්‍යුහය විශ්ලේෂණය කර ඔබේ සතා සොයා ගන්නෙමි.',
    ta: 'ஏதாவது ஒரு பாலூட்டியை நினையுங்கள். அதன் மண்டை ஓட்டு வடிவத்தை வைத்து அது என்ன விலங்கு என்று நான் கண்டுபிடிப்பேன்.'
  },
  startBtn: {
    en: 'Start Investigation',
    si: 'පරීක්ෂණය අරඹන්න',
    ta: 'விசாரணையைத் தொடங்கு'
  },
  encyBtn: {
    en: 'Animal Encyclopedia',
    si: 'ක්ෂීරපායී විශ්වකෝෂය',
    ta: 'விலங்கு கலைக்களஞ்சியம்'
  },
  labBtn: {
    en: 'Dental Morphology Lab',
    si: 'දන්ත රූපවිද්‍යා රසායනාගාරය',
    ta: 'பல் வடிவவியல் ஆய்வகம்'
  },
  customBtn: {
    en: 'Custom Classifier Lab',
    si: 'අභිරුචි වර්ගීකරණ පර්යේෂණාගාරය',
    ta: 'வகைப்பாட்டு ஆய்வகம்'
  },
  stats: {
    en: ['246 Mammals', '11 Skull Traits', 'Bayesian AI'],
    si: ['ක්ෂීරපායීන් 246', 'කපාල ලක්ෂණ 11', 'බේසියානු AI'],
    ta: ['246 பாலூட்டிகள்', '11 ஓட்டு பண்புகள்', 'பேசியன் AI']
  }
};

// Animated background canvas particles
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenEncyclopedia,
  onOpenSkullLab,
  onOpenCustomLab,
  lang
}) => {
  const t = (key: keyof typeof welcomeTexts) => welcomeTexts[key][lang] as string;
  const stats = welcomeTexts.stats[lang];

  return (
    <div className="relative flex flex-col items-center justify-center text-center flex-1 overflow-hidden">
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Main content column */}
      <div className="relative z-10 flex flex-col items-center gap-8 py-12 max-w-2xl mx-auto px-4 animate-fade-in">

        {/* Skull icon with glowing ring */}
        <div className="relative">
          <div
            className="w-36 h-36 flex items-center justify-center text-cyan-400 rounded-full border border-cyan-500/25 bg-slate-900/50 p-6 animate-pulse-glow"
            style={{ boxShadow: '0 0 40px rgba(6,182,212,0.2), inset 0 0 30px rgba(6,182,212,0.05)' }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="42" r="28" />
              <circle cx="39" cy="38" r="4.5" fill="currentColor" />
              <circle cx="61" cy="38" r="4.5" fill="currentColor" />
              <path d="M 44 54 Q 50 60 56 54" strokeLinecap="round" />
              <path d="M 32 70 L 22 90 M 68 70 L 78 90 M 50 70 L 50 94" strokeLinecap="round" />
              <path d="M 44 70 L 44 82 M 56 70 L 56 82" strokeLinecap="round" />
            </svg>
          </div>
          {/* Orbiting ring */}
          <div
            className="absolute inset-0 rounded-full border border-cyan-500/10"
            style={{
              width: '160px', height: '160px',
              top: '-12px', left: '-12px',
              animation: 'spin 12s linear infinite'
            }}
          />
        </div>

        {/* Title block */}
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-wider text-cyan-400 glow-text uppercase">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Quick-stat chips */}
        <div className="flex gap-3 flex-wrap justify-center">
          {stats.map((s) => (
            <span
              key={s}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-wider"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          className="btn-primary py-4 px-12 text-base"
          onClick={onStartGame}
        >
          <Play size={20} />
          {t('startBtn')}
        </button>

        {/* Secondary nav buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
          <button className="btn-secondary py-3 text-sm" onClick={onOpenEncyclopedia}>
            <BookOpen size={16} className="text-cyan-400" />
            {t('encyBtn')}
          </button>
          <button className="btn-secondary py-3 text-sm" onClick={onOpenSkullLab}>
            <Compass size={16} className="text-emerald-400" />
            {t('labBtn')}
          </button>
          <button className="btn-secondary py-3 text-sm" onClick={onOpenCustomLab}>
            <Activity size={16} className="text-amber-400" />
            {t('customBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
