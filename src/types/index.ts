export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  retrograde: boolean;
  house?: number;
}

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface HousePosition {
  house: number;
  sign: ZodiacSign;
  degree: number;
}

export interface NatalChart {
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: { sign: ZodiacSign; degree: number };
  midheaven: { sign: ZodiacSign; degree: number };
}

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
}

export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

export interface TarotReading {
  id: string;
  date: string;
  spreadType: 'single' | 'three-card' | 'celtic-cross';
  cards: DrawnCard[];
  question?: string;
}

export interface DrawnCard {
  card: TarotCard;
  position: string;
  reversed: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  moonPhase: MoonPhase;
  content: string;
  intentions: string[];
  gratitude: string[];
}

export type MoonPhase =
  | 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous'
  | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';

export interface DailyGuidance {
  date: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  moonPhase: MoonPhase;
  message: string;
  luckyNumbers: number[];
  luckyColors: string[];
  affirmation: string;
}

export interface Transit {
  planet: string;
  currentSign: ZodiacSign;
  currentDegree: number;
  retrograde: boolean;
  aspectsToNatal: Aspect[];
}

export interface Aspect {
  natalPlanet: string;
  aspectType: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
  applying: boolean;
}
