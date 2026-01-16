import { NumerologyProfile } from '../types';

// Pythagorean numerology letter values
const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
const masterNumbers = new Set([11, 22, 33]);

function reduceToSingleDigit(num: number, preserveMaster: boolean = true): number {
  if (preserveMaster && masterNumbers.has(num)) {
    return num;
  }

  while (num > 9 && !(preserveMaster && masterNumbers.has(num))) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  return num;
}

export function calculateLifePath(birthDate: string): number {
  // Format: YYYY-MM-DD
  const [year, month, day] = birthDate.split('-').map(Number);

  // Reduce each component separately first
  const monthReduced = reduceToSingleDigit(month, false);
  const dayReduced = reduceToSingleDigit(day, false);
  const yearReduced = reduceToSingleDigit(year, false);

  // Then add and reduce final sum, preserving master numbers
  const sum = monthReduced + dayReduced + yearReduced;
  return reduceToSingleDigit(sum, true);
}

export function calculateExpression(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName
    .split('')
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

  return reduceToSingleDigit(sum, true);
}

export function calculateSoulUrge(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName
    .split('')
    .filter(letter => vowels.has(letter))
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

  return reduceToSingleDigit(sum, true);
}

export function calculatePersonality(fullName: string): number {
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName
    .split('')
    .filter(letter => !vowels.has(letter))
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

  return reduceToSingleDigit(sum, true);
}

export function calculateBirthday(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2]);
  return reduceToSingleDigit(day, true);
}

export function calculateNumerology(fullName: string, birthDate: string): NumerologyProfile {
  return {
    lifePath: calculateLifePath(birthDate),
    expression: calculateExpression(fullName),
    soulUrge: calculateSoulUrge(fullName),
    personality: calculatePersonality(fullName),
    birthday: calculateBirthday(birthDate),
  };
}

export const numerologyInterpretations: Record<number, {
  title: string;
  keywords: string[];
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
}> = {
  1: {
    title: 'The Leader',
    keywords: ['Independence', 'Innovation', 'Ambition', 'Originality'],
    lifePath: 'You are here to develop independence, individuality, and leadership. Your life path involves pioneering new ideas and standing on your own two feet. You\'re meant to be a self-starter who leads by example.',
    expression: 'You express yourself through leadership and original thinking. You have natural executive abilities and the drive to accomplish great things through your own initiative.',
    soulUrge: 'Deep down, you desire to be first, to lead, and to be recognized for your unique contributions. You crave independence and the freedom to pursue your own path.',
    personality: 'Others see you as independent, confident, and capable. You project an image of strength and self-reliance that inspires others to follow your lead.',
  },
  2: {
    title: 'The Diplomat',
    keywords: ['Cooperation', 'Sensitivity', 'Balance', 'Partnership'],
    lifePath: 'You are here to learn cooperation, diplomacy, and the art of partnership. Your path involves bringing harmony to relationships and situations through patience and understanding.',
    expression: 'You express yourself through diplomacy and consideration of others. Your talents lie in mediation, counseling, and creating peaceful environments.',
    soulUrge: 'Your heart desires peace, harmony, and loving relationships. You long for partnership and the comfort of emotional connection.',
    personality: 'Others perceive you as gentle, considerate, and easy to be around. You come across as a natural peacemaker and supportive friend.',
  },
  3: {
    title: 'The Creative',
    keywords: ['Expression', 'Joy', 'Creativity', 'Communication'],
    lifePath: 'You are here to express yourself creatively and inspire others with your joy. Your path involves using your gifts of communication and artistic expression to uplift those around you.',
    expression: 'You express yourself through creativity, words, and artistic endeavors. You have a gift for making others feel good and spreading optimism.',
    soulUrge: 'Your soul craves creative expression and joy. You desire to communicate your feelings and ideas, and to bring beauty into the world.',
    personality: 'Others see you as charming, witty, and entertaining. Your natural warmth and creative spirit make you magnetic in social situations.',
  },
  4: {
    title: 'The Builder',
    keywords: ['Stability', 'Hard Work', 'Discipline', 'Foundation'],
    lifePath: 'You are here to build solid foundations and create lasting structures. Your path involves discipline, hard work, and attention to detail as you construct something meaningful.',
    expression: 'You express yourself through practical accomplishments and systematic work. You have the ability to turn ideas into reality through patient effort.',
    soulUrge: 'Deep down, you crave security, order, and the satisfaction of a job well done. You desire stability and the comfort of knowing things are built to last.',
    personality: 'Others see you as reliable, practical, and trustworthy. You project an image of competence and dependability.',
  },
  5: {
    title: 'The Freedom Seeker',
    keywords: ['Change', 'Adventure', 'Freedom', 'Versatility'],
    lifePath: 'You are here to experience life fully through change, travel, and variety. Your path involves embracing freedom and learning through diverse experiences.',
    expression: 'You express yourself through versatility and adaptability. Your talents lie in communication, promotion, and inspiring others to embrace change.',
    soulUrge: 'Your heart desires freedom, adventure, and new experiences. You crave variety and resist anything that feels confining.',
    personality: 'Others perceive you as exciting, versatile, and progressive. You come across as someone who lives life to the fullest.',
  },
  6: {
    title: 'The Nurturer',
    keywords: ['Responsibility', 'Love', 'Family', 'Service'],
    lifePath: 'You are here to nurture, support, and create harmony in family and community. Your path involves responsibility to others and creating beautiful, loving environments.',
    expression: 'You express yourself through care for others and creating harmony. Your talents lie in counseling, teaching, healing, and artistic pursuits.',
    soulUrge: 'Your soul desires to love and be loved, to nurture and protect. You crave domestic harmony and meaningful connections.',
    personality: 'Others see you as caring, responsible, and domestically inclined. You project warmth and a desire to help others.',
  },
  7: {
    title: 'The Seeker',
    keywords: ['Wisdom', 'Spirituality', 'Analysis', 'Introspection'],
    lifePath: 'You are here to seek truth, wisdom, and spiritual understanding. Your path is one of introspection, study, and the pursuit of deeper meaning.',
    expression: 'You express yourself through analysis, research, and the pursuit of knowledge. Your talents lie in specialized fields that require depth of understanding.',
    soulUrge: 'Deep down, you crave solitude, knowledge, and spiritual connection. You desire to understand the mysteries of life.',
    personality: 'Others perceive you as thoughtful, reserved, and intellectual. You project an air of mystery and wisdom.',
  },
  8: {
    title: 'The Powerhouse',
    keywords: ['Success', 'Authority', 'Material Abundance', 'Achievement'],
    lifePath: 'You are here to achieve material success and learn to use power wisely. Your path involves business, finance, and positions of authority.',
    expression: 'You express yourself through achievement and material accomplishment. Your talents lie in management, organization, and financial matters.',
    soulUrge: 'Your heart desires success, recognition, and material abundance. You crave achievement and the power to make things happen.',
    personality: 'Others see you as successful, ambitious, and authoritative. You project an image of competence and power.',
  },
  9: {
    title: 'The Humanitarian',
    keywords: ['Compassion', 'Wisdom', 'Universal Love', 'Completion'],
    lifePath: 'You are here to serve humanity and express universal love. Your path involves letting go of personal attachments and embracing a broader vision.',
    expression: 'You express yourself through service to others and humanitarian efforts. Your talents lie in inspiring and healing on a large scale.',
    soulUrge: 'Your soul desires to give, to help, and to make the world a better place. You crave universal love and understanding.',
    personality: 'Others perceive you as generous, wise, and worldly. You project an image of compassion and broad-mindedness.',
  },
  11: {
    title: 'The Illuminator',
    keywords: ['Inspiration', 'Intuition', 'Spiritual Messenger', 'Enlightenment'],
    lifePath: 'As a Master Number, you are here to inspire and illuminate others. Your highly intuitive path involves channeling spiritual insights and serving as a beacon of light.',
    expression: 'You express yourself through inspiration and spiritual teaching. Your talents lie in bridging the material and spiritual worlds.',
    soulUrge: 'Your soul craves spiritual fulfillment and the opportunity to inspire others. You desire to bring higher wisdom into the world.',
    personality: 'Others see you as inspirational, intuitive, and charismatic. You project an otherworldly quality that draws people to you.',
  },
  22: {
    title: 'The Master Builder',
    keywords: ['Master Plans', 'Vision', 'Large-scale Achievement', 'Manifestation'],
    lifePath: 'As a Master Number, you are here to build something significant that benefits humanity. Your path involves turning visionary ideas into practical reality on a grand scale.',
    expression: 'You express yourself through large-scale accomplishments and master planning. Your talents combine vision with practical ability.',
    soulUrge: 'Your heart desires to leave a lasting legacy and build something meaningful for future generations. You crave tangible achievement of lofty ideals.',
    personality: 'Others see you as powerful, capable, and visionary. You project an image of someone who can accomplish great things.',
  },
  33: {
    title: 'The Master Teacher',
    keywords: ['Selfless Service', 'Healing', 'Blessing', 'Cosmic Love'],
    lifePath: 'As a Master Number, you are here to uplift humanity through selfless love and service. Your path involves healing, teaching, and blessing others with your presence.',
    expression: 'You express yourself through healing, teaching, and nurturing on a cosmic level. Your talents lie in channeling divine love.',
    soulUrge: 'Your soul desires to serve and heal humanity. You crave the opportunity to make a profound difference in the lives of many.',
    personality: 'Others see you as loving, nurturing, and spiritually advanced. You project an aura of peace and unconditional love.',
  },
};

export function getInterpretation(number: number, type: keyof typeof numerologyInterpretations[1]): string {
  const interp = numerologyInterpretations[number];
  if (!interp) return '';
  return interp[type] as string;
}
