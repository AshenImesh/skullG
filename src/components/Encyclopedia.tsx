import React, { useState, useEffect } from 'react';
import type { Language, Mammal } from '../types';
import { ArrowLeft, Search, HelpCircle, X, Check } from 'lucide-react';
import databaseRaw from '../data/ultimate_mammal_database.json';

const mammalsDatabase = databaseRaw as Mammal[];

interface EncyclopediaProps {
  onBack: () => void;
  onSelectMysteryAnimal: () => void;
  lang: Language;
}

const encTexts = {
  title: {
    en: 'Mammal Encyclopedia',
    si: 'ක්ෂීරපායී විශ්වකෝෂය',
    ta: 'விலங்கு கலைக்களஞ்சியம்'
  },
  subtitle: {
    en: 'Browse and inspect the skull structures, habitats, and diets of all 246 terrestrial mammals in our database.',
    si: 'අපගේ දත්ත ගබඩාවේ ඇති සියලුම ක්ෂීරපායීන් 246 දෙනාගේ කපාල ව්‍යුහය, වාසස්ථාන සහ ආහාර රටාවන් නිරීක්ෂණය කරන්න.',
    ta: 'தரவுத்தளத்தில் உள்ள அனைத்து 246 விலங்குகளின் மண்டை ஓட்டு அமைப்பு, வாழிடம் மற்றும் உணவு முறைகளை ஆராயுங்கள்.'
  },
  back: {
    en: 'Back to Menu',
    si: 'ප්‍රධාන මෙනුවට',
    ta: 'முதன்மைப் பக்கம்'
  },
  searchPlaceholder: {
    en: 'Search by common or scientific name...',
    si: 'පොදු හෝ විද්‍යාත්මක නමින් සොයන්න...',
    ta: 'பொදුவான அல்லது அறிவியல் பெயරால் தேடுக...'
  },
  allOrders: {
    en: 'All Orders',
    si: 'සියලුම ගණ',
    ta: 'அனைத்து பிரிவுகள்'
  },
  allDiets: {
    en: 'All Diets',
    si: 'සියලුම ආහාර රටා',
    ta: 'அனைத்து உணவுகள்'
  },
  allHabitats: {
    en: 'All Habitats',
    si: 'සියලුම වාසස්ථාන',
    ta: 'அனைத்து வாழிடங்கள்'
  },
  selectMystery: {
    en: 'Think of this Animal',
    si: 'මෙම සතා ගැන සිතන්න',
    ta: 'இந்த விலங்கை நினையுங்கள்'
  },
  characteristics: {
    en: 'Skull Morphology & Biology',
    si: 'කපාල රූපවිද්‍යාව සහ ජීව විද්‍යාව',
    ta: 'மண்டை ஓட்டு வடிவவியல் & உயிரியல்'
  },
  close: {
    en: 'Close',
    si: 'වසා දමන්න',
    ta: 'மூடுக'
  }
};

export const Encyclopedia: React.FC<EncyclopediaProps> = ({
  onBack,
  onSelectMysteryAnimal,
  lang
}) => {
  const t = (key: keyof typeof encTexts) => encTexts[key][lang];

  // State
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState('');
  const [selectedMammal, setSelectedMammal] = useState<Mammal | null>(null);
  const [wikiImgUrl, setWikiImgUrl] = useState<string | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);

  // Get unique lists for filter select
  const orders = Array.from(new Set(mammalsDatabase.map((m) => m.Order))).sort();
  const diets = Array.from(new Set(mammalsDatabase.map((m) => m['Diet Category']))).sort();
  const habitats = Array.from(new Set(mammalsDatabase.map((m) => m['Habitat (Terrestrial)']))).sort();

  // Filter logic
  const filteredMammals = mammalsDatabase.filter((m) => {
    const nameMatch =
      m['Common Name'].toLowerCase().includes(search.toLowerCase()) ||
      m['Scientific Name'].toLowerCase().includes(search.toLowerCase());
    const orderMatch = selectedOrder === '' || m.Order === selectedOrder;
    const dietMatch = selectedDiet === '' || m['Diet Category'] === selectedDiet;
    const habitatMatch = selectedHabitat === '' || m['Habitat (Terrestrial)'] === selectedHabitat;

    return nameMatch && orderMatch && dietMatch && habitatMatch;
  });

  // Fetch image from wikipedia
  useEffect(() => {
    if (!selectedMammal) {
      setWikiImgUrl(null);
      return;
    }

    setWikiLoading(true);
    setWikiImgUrl(null);

    const title = encodeURIComponent(selectedMammal['Common Name']);
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&origin=*&titles=${title}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pages[pageId]?.thumbnail) {
            setWikiImgUrl(pages[pageId].thumbnail.source);
          }
        }
        setWikiLoading(false);
      })
      .catch((err) => {
        console.error('Wikipedia fetch error:', err);
        setWikiLoading(false);
      });
  }, [selectedMammal]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in flex-1">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-2 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            {t('back')}
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 glow-text">
            {t('title')}
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input pl-10 py-3"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            className="select-input p-3"
          >
            <option value="">{t('allOrders')}</option>
            {orders.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <select
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
            className="select-input p-3"
          >
            <option value="">{t('allDiets')}</option>
            {diets.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedHabitat}
            onChange={(e) => setSelectedHabitat(e.target.value)}
            className="select-input p-3"
          >
            <option value="">{t('allHabitats')}</option>
            {habitats.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mammals Grid */}
      <div className="grid grid-layout flex-1 overflow-y-auto max-h-[60vh] pr-2">
        {filteredMammals.map((m) => (
          <button
            key={m['Common Name']}
            onClick={() => setSelectedMammal(m)}
            className="glass-panel p-5 text-left flex flex-col justify-between hover:border-cyan-500/40 hover:bg-slate-900/30 group transition-all"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                {m.Order}
              </span>
              <h3 className="font-extrabold text-slate-100 text-lg group-hover:text-cyan-400 transition-colors line-clamp-1">
                {m['Common Name']}
              </h3>
              <span className="text-xs text-slate-400 italic line-clamp-1">
                {m['Scientific Name']}
              </span>
            </div>

            <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-800/40 w-full text-xs">
              <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-bold uppercase tracking-wide">
                {m['Diet Category']}
              </span>
              <span className="text-slate-400 italic line-clamp-1 max-w-[120px]">
                {m['Habitat (Terrestrial)']}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal Overlay */}
      {selectedMammal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 p-6">
              <div>
                <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase">
                  {selectedMammal.Order}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide">
                  {selectedMammal['Common Name']}
                </h3>
                <span className="text-sm text-slate-400 italic">
                  {selectedMammal['Scientific Name']}
                </span>
              </div>
              <button
                onClick={() => setSelectedMammal(null)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              {/* Left Column: Media & Bio */}
              <div className="flex flex-col gap-4">
                <div className="w-full h-56 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                  {wikiLoading ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-sm">
                      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      Loading Wikiphoto...
                    </div>
                  ) : wikiImgUrl ? (
                    <img src={wikiImgUrl} alt={selectedMammal['Common Name']} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-600 text-sm">
                      <HelpCircle size={40} />
                      No Wikipedia Photo Available
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-slate-400 text-center py-1.5 border-t border-slate-800">
                    Wiki Reference Photo
                  </div>
                </div>

                <div className="glass-panel p-4 border-l-4 border-l-cyan-500 bg-cyan-950/5 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">
                    Notes / Distinguishing Features
                  </span>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {selectedMammal['Notes / Distinguishing Features'] || 'No notes available.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Skull Traits */}
              <div className="flex flex-col gap-4">
                <h4 className="font-extrabold text-slate-300 text-xs tracking-wider uppercase">
                  {t('characteristics')}
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Diet', value: selectedMammal['Diet Category'] },
                    { label: 'Habitat', value: selectedMammal['Habitat (Terrestrial)'] },
                    { label: 'Eye Orientation', value: selectedMammal['Eye Orientation'] },
                    { label: 'Canine Teeth', value: selectedMammal['Canine Development'] },
                    { label: 'Molar Pattern', value: selectedMammal['Molar Type'] },
                    { label: 'Snout Ratio', value: selectedMammal['Jaw Length Ratio'] },
                    { label: 'Bone Density', value: selectedMammal['Skull Robustness'] },
                    { label: 'Size Class', value: selectedMammal['Body Size Class'] },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                        {stat.label}
                      </span>
                      <span className="text-slate-100 font-extrabold text-sm capitalize mt-1">
                        {stat.value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select as game trigger */}
                <button
                  onClick={() => {
                    onSelectMysteryAnimal();
                    setSelectedMammal(null);
                  }}
                  className="btn-primary py-3.5 px-6 justify-center w-full mt-2 text-sm"
                >
                  <Check size={16} />
                  {t('selectMystery')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
