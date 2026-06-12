import { useState, useMemo } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Encyclopedia } from './components/Encyclopedia';
import { SkullLab } from './components/SkullLab';
import { CustomAnimalLab } from './components/CustomAnimalLab';
import { GameScreen } from './components/GameScreen';
import { RevealScreen } from './components/RevealScreen';
import type { Mammal, Language, QuestionData, GameHistoryItem } from './types';
import { QUESTIONS_DATA } from './data/questions';
import {
  calculateEntropy,
  calculateInformationGainForTraits,
  updateBayesianProbabilities,
  findDiscriminatorTrait
} from './utils/bayesian';
import databaseRaw from './data/ultimate_mammal_database.json';

const mammalsDatabase = databaseRaw as Mammal[];

// Define exact options based on unique values in database
const TRAIT_OPTIONS: Record<keyof Mammal, string[]> = {
  "Common Name": [],
  "Scientific Name": [],
  "Prey/Plant Type": [],
  "Notes / Distinguishing Features": [],
  "Carnivory Score (0-10)": [],
  "Order": ["Carnivora", "Rodentia", "Primates", "Artiodactyla", "Perissodactyla", "Proboscidea", "Pholidota", "Eulipotyphla", "Tubulidentata", "Cingulata", "Pilosa", "Diprotodontia", "Dasyuromorphia", "Lagomorpha"],
  "Eye Orientation": ["Forward", "Side"],
  "Canine Development": ["Large", "Small", "Absent"],
  "Molar Type": ["Carnassial", "Bunodont", "Selenodont", "Lophodont", "Mixed", "Absent"],
  "Jaw Length Ratio": ["Long", "Medium", "Short"],
  "Skull Robustness": ["Gracile", "Moderate", "Robust"],
  "Body Size Class": ["Small", "Medium", "Large", "VeryLarge"],
  "Diet Category": ["Carnivore", "Herbivore", "Omnivore", "Insectivore"],
  "Habitat (Terrestrial)": ["Forest", "Grassland", "Savanna", "Desert", "Generalist", "Coastal", "Aquatic/Generalist"],
  "Social Structure": ["Solitary", "Pair", "Group", "Herd"],
  "Activity Pattern": ["Diurnal", "Nocturnal", "Crepuscular", "Variable"]
};

// Available features for questions
const QUESTION_TRAITS: (keyof Mammal)[] = [
  "Eye Orientation",
  "Canine Development",
  "Molar Type",
  "Jaw Length Ratio",
  "Skull Robustness",
  "Body Size Class",
  "Diet Category",
  "Habitat (Terrestrial)",
  "Social Structure",
  "Activity Pattern",
  "Order"
];

function App() {
  // Navigation & Language
  const [screen, setScreen] = useState<'welcome' | 'game' | 'reveal' | 'encyclopedia' | 'skull-lab' | 'custom-lab'>('welcome');
  const [lang, setLang] = useState<Language>('en');

  // Bayesian Game States
  const [probabilities, setProbabilities] = useState<Record<string, number>>({});
  const [askedTraits, setAskedTraits] = useState<Set<keyof Mammal>>(new Set());
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [phase, setPhase] = useState('BROAD ELIMINATION');

  // List candidates sorted by probability descending
  const sortedCandidates = useMemo(() => {
    return Object.entries(probabilities)
      .map(([name, prob]) => ({ name, probability: prob }))
      .sort((a, b) => b.probability - a.probability);
  }, [probabilities]);

  const remainingCandidatesCount = useMemo(() => {
    return Object.values(probabilities).filter(p => p > 0.005).length;
  }, [probabilities]);

  // Determine next question to ask
  const selectNextQuestion = (
    currentProbs: Record<string, number>,
    alreadyAsked: Set<keyof Mammal>
  ): { question: QuestionData | null; calculatedPhase: string } => {
    const remainingTraits = QUESTION_TRAITS.filter(t => !alreadyAsked.has(t));
    if (remainingTraits.length === 0) {
      return { question: null, calculatedPhase: 'FINAL IDENTIFICATION' };
    }

    // Top guesses check
    const sorted = Object.entries(currentProbs)
      .map(([name, prob]) => ({ name, probability: prob }))
      .sort((a, b) => b.probability - a.probability);
    
    const top1 = sorted[0];
    const top2 = sorted[1];
    
    // Check if we need targeted discriminator logic
    if (top1 && top2 && top1.probability - top2.probability < 0.15 && alreadyAsked.size > 4) {
      const m1 = mammalsDatabase.find(m => m['Common Name'] === top1.name);
      const m2 = mammalsDatabase.find(m => m['Common Name'] === top2.name);
      if (m1 && m2) {
        const discTrait = findDiscriminatorTrait(m1, m2, remainingTraits);
        if (discTrait) {
          const qData = QUESTIONS_DATA.find(q => q.trait === discTrait);
          if (qData) {
            return { question: qData, calculatedPhase: 'TARGETED VERIFICATION' };
          }
        }
      }
    }

    // Default: Choose trait with maximum Expected Information Gain
    const gainList = calculateInformationGainForTraits(
      currentProbs,
      mammalsDatabase,
      remainingTraits,
      TRAIT_OPTIONS
    );

    const best = gainList[0];
    if (best && best.infoGain > 0.001) {
      const qData = QUESTIONS_DATA.find(q => q.trait === best.trait);
      if (qData) {
        let currentPhase = 'BROAD ELIMINATION';
        if (alreadyAsked.size > 7) currentPhase = 'FINAL IDENTIFICATION';
        else if (alreadyAsked.size > 4) currentPhase = 'TARGETED VERIFICATION';
        return { question: qData, calculatedPhase: currentPhase };
      }
    }

    // Fallback: If no trait yields information gain, we can't distinguish further
    return { question: null, calculatedPhase: 'FINAL IDENTIFICATION' };
  };

  // Initialize Game Session
  const handleStartGame = () => {
    const initialProbs: Record<string, number> = {};
    const uniformProb = 1 / mammalsDatabase.length;
    mammalsDatabase.forEach(m => {
      initialProbs[m['Common Name']] = uniformProb;
    });

    const emptyAsked = new Set<keyof Mammal>();
    const { question, calculatedPhase } = selectNextQuestion(initialProbs, emptyAsked);

    setProbabilities(initialProbs);
    setAskedTraits(emptyAsked);
    setHistory([]);
    setQuestionNumber(1);
    setCurrentQuestion(question);
    setPhase(calculatedPhase);
    setScreen('game');
  };

  // Process User Answer
  const handleAnswer = (val: string) => {
    if (!currentQuestion) return;

    const trait = currentQuestion.trait;
    const qText = currentQuestion.q[lang];
    const ansLabel = currentQuestion.options[val][lang];
    const entropyBefore = calculateEntropy(probabilities);

    // Apply Bayes Rule
    const updatedProbs = updateBayesianProbabilities(probabilities, mammalsDatabase, trait, val);
    const entropyAfter = calculateEntropy(updatedProbs);

    // Update asked list
    const updatedAsked = new Set(askedTraits);
    updatedAsked.add(trait);

    // Record History
    const historyItem: GameHistoryItem = {
      trait,
      questionText: qText,
      answerValue: val,
      answerLabel: ansLabel,
      remainingCount: Object.values(updatedProbs).filter(p => p > 0.005).length,
      entropyBefore,
      entropyAfter
    };
    const updatedHistory = [...history, historyItem];

    // Check termination criteria
    const top = Object.entries(updatedProbs)
      .map(([name, prob]) => ({ name, probability: prob }))
      .sort((a, b) => b.probability - a.probability)[0];

    const maxQuestionsReached = questionNumber >= 15;
    const highConfidenceReached = top && top.probability >= 0.95 && questionNumber >= 5;

    const { question: nextQ, calculatedPhase } = selectNextQuestion(updatedProbs, updatedAsked);

    setProbabilities(updatedProbs);
    setAskedTraits(updatedAsked);
    setHistory(updatedHistory);

    if (maxQuestionsReached || highConfidenceReached || !nextQ) {
      setScreen('reveal');
    } else {
      setQuestionNumber(prev => prev + 1);
      setCurrentQuestion(nextQ);
      setPhase(calculatedPhase);
    }
  };

  // Shortcut to start game from encyclopedia select
  const handleSelectMysteryAnimal = () => {
    // This allows the user to browse the encyclopedia, select an animal to think of, and start the game!
    handleStartGame();
  };

  return (
    <div className="main-container">
      {/* Universal Nav Header */}
      <header className="header-nav">
        <button className="logo-container bg-transparent border-none cursor-pointer" onClick={() => setScreen('welcome')}>
          🔬 Skull Detective
        </button>
        
        {/* Language selector in Header */}
        <div className="flex gap-2 justify-end">
          {(['en', 'si', 'ta'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                lang === l
                  ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_10px_var(--accent-glow)]'
                  : 'bg-transparent border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {l === 'en' ? 'EN' : l === 'si' ? 'සිං' : 'தமி'}
            </button>
          ))}
        </div>
      </header>

      {/* Screen Orchestrator */}
      <main className="flex-1 flex flex-col justify-center">
        {screen === 'welcome' && (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onOpenEncyclopedia={() => setScreen('encyclopedia')}
            onOpenSkullLab={() => setScreen('skull-lab')}
            onOpenCustomLab={() => setScreen('custom-lab')}
            lang={lang}
          />
        )}

        {screen === 'encyclopedia' && (
          <Encyclopedia
            onBack={() => setScreen('welcome')}
            onSelectMysteryAnimal={handleSelectMysteryAnimal}
            lang={lang}
          />
        )}

        {screen === 'skull-lab' && (
          <SkullLab
            onBack={() => setScreen('welcome')}
            lang={lang}
          />
        )}

        {screen === 'custom-lab' && (
          <CustomAnimalLab
            onBack={() => setScreen('welcome')}
            lang={lang}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            currentQuestion={currentQuestion}
            questionNumber={questionNumber}
            maxQuestions={15}
            remainingCandidatesCount={remainingCandidatesCount}
            topCandidates={sortedCandidates}
            history={history}
            phase={phase}
            onAnswer={handleAnswer}
            onExit={() => setScreen('welcome')}
            lang={lang}
          />
        )}

        {screen === 'reveal' && (
          <RevealScreen
            finalAnimalName={sortedCandidates[0]?.name || ''}
            confidence={sortedCandidates[0]?.probability * 100 || 0}
            history={history}
            allCandidates={sortedCandidates}
            mammalsDatabase={mammalsDatabase}
            onPlayAgain={() => setScreen('welcome')}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}

export default App;
