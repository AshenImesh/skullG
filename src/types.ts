export interface Mammal {
  "Common Name": string;
  "Scientific Name": string;
  "Order": string;
  "Eye Orientation": string;
  "Canine Development": string;
  "Molar Type": string;
  "Jaw Length Ratio": string;
  "Skull Robustness": string;
  "Body Size Class": string;
  "Diet Category": string;
  "Prey/Plant Type": string;
  "Habitat (Terrestrial)": string;
  "Social Structure": string;
  "Activity Pattern": string;
  "Carnivory Score (0-10)": string;
  "Notes / Distinguishing Features": string;
}

export type Language = 'en' | 'si' | 'ta';

export interface QuestionData {
  trait: keyof Mammal;
  q: Record<Language, string>;
  hint: Record<Language, string>;
  options: Record<string, Record<Language, string>>; // Maps value (e.g. "Forward") to { en, si, ta }
}

export interface GameHistoryItem {
  trait: keyof Mammal;
  questionText: string;
  answerValue: string;
  answerLabel: string;
  remainingCount: number;
  entropyBefore: number;
  entropyAfter: number;
}

export interface MolarGuide {
  name: string;
  description: Record<Language, string>;
  dietLink: Record<Language, string>;
  svgIcon: string;
}
