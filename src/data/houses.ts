export interface HouseInfo {
  number: number;
  name: string;
  keywords: string[];
  description: string;
  rulingSign: string;
  naturalRuler: string;
}

export const houses: HouseInfo[] = [
  {
    number: 1,
    name: 'House of Self',
    keywords: ['Identity', 'Appearance', 'First impressions', 'New beginnings'],
    description: 'The First House represents your self-image, physical appearance, and how you present yourself to the world. It\'s the mask you wear and the first impression you make.',
    rulingSign: 'Aries',
    naturalRuler: 'Mars',
  },
  {
    number: 2,
    name: 'House of Value',
    keywords: ['Money', 'Possessions', 'Self-worth', 'Resources'],
    description: 'The Second House governs your material resources, values, and sense of self-worth. It shows how you earn, spend, and relate to possessions.',
    rulingSign: 'Taurus',
    naturalRuler: 'Venus',
  },
  {
    number: 3,
    name: 'House of Communication',
    keywords: ['Communication', 'Siblings', 'Short trips', 'Learning'],
    description: 'The Third House rules communication, early education, siblings, and your immediate environment. It shows how you think, learn, and share information.',
    rulingSign: 'Gemini',
    naturalRuler: 'Mercury',
  },
  {
    number: 4,
    name: 'House of Home',
    keywords: ['Home', 'Family', 'Roots', 'Foundation'],
    description: 'The Fourth House represents home, family, ancestry, and your emotional foundation. It\'s your private world and sense of belonging.',
    rulingSign: 'Cancer',
    naturalRuler: 'Moon',
  },
  {
    number: 5,
    name: 'House of Pleasure',
    keywords: ['Creativity', 'Romance', 'Children', 'Self-expression'],
    description: 'The Fifth House governs creativity, romance, pleasure, and children. It\'s where you find joy, express yourself, and take risks for fun.',
    rulingSign: 'Leo',
    naturalRuler: 'Sun',
  },
  {
    number: 6,
    name: 'House of Health',
    keywords: ['Health', 'Work', 'Service', 'Daily routine'],
    description: 'The Sixth House rules daily work, health habits, and service to others. It shows your approach to wellness and how you handle responsibilities.',
    rulingSign: 'Virgo',
    naturalRuler: 'Mercury',
  },
  {
    number: 7,
    name: 'House of Partnership',
    keywords: ['Marriage', 'Partnerships', 'Contracts', 'Open enemies'],
    description: 'The Seventh House governs committed partnerships, marriage, and significant one-on-one relationships. It shows what you seek in a partner.',
    rulingSign: 'Libra',
    naturalRuler: 'Venus',
  },
  {
    number: 8,
    name: 'House of Transformation',
    keywords: ['Death/Rebirth', 'Shared resources', 'Intimacy', 'Occult'],
    description: 'The Eighth House rules transformation, shared resources, intimacy, and the mysteries of life and death. It governs deep psychological processes.',
    rulingSign: 'Scorpio',
    naturalRuler: 'Pluto',
  },
  {
    number: 9,
    name: 'House of Philosophy',
    keywords: ['Higher education', 'Travel', 'Philosophy', 'Religion'],
    description: 'The Ninth House governs higher learning, long-distance travel, philosophy, and beliefs. It\'s where you search for meaning and expand your horizons.',
    rulingSign: 'Sagittarius',
    naturalRuler: 'Jupiter',
  },
  {
    number: 10,
    name: 'House of Career',
    keywords: ['Career', 'Reputation', 'Public image', 'Authority'],
    description: 'The Tenth House represents career, public reputation, and life purpose. It shows your ambitions and how you\'re seen in the world.',
    rulingSign: 'Capricorn',
    naturalRuler: 'Saturn',
  },
  {
    number: 11,
    name: 'House of Community',
    keywords: ['Friends', 'Groups', 'Hopes', 'Humanitarian goals'],
    description: 'The Eleventh House governs friendships, groups, and collective goals. It shows your hopes for the future and how you connect with community.',
    rulingSign: 'Aquarius',
    naturalRuler: 'Uranus',
  },
  {
    number: 12,
    name: 'House of the Unconscious',
    keywords: ['Spirituality', 'Hidden matters', 'Karma', 'Solitude'],
    description: 'The Twelfth House rules the unconscious, spirituality, and hidden aspects of life. It\'s where you retreat, heal, and connect with the divine.',
    rulingSign: 'Pisces',
    naturalRuler: 'Neptune',
  },
];

export function getHouseInterpretation(planet: string, house: number): string {
  const interpretations: Record<string, Record<number, string>> = {
    Sun: {
      1: 'Your identity shines brightly in self-expression. You\'re seen as confident and self-aware.',
      2: 'Your sense of self is tied to material security. Building resources feeds your ego.',
      3: 'You express yourself through communication and learning. Your mind is central to your identity.',
      4: 'Home and family are at the core of your identity. You shine in private, nurturing settings.',
      5: 'Creativity and self-expression are your life force. You radiate joy and romance.',
      6: 'You find purpose in service and health. Daily work is central to your identity.',
      7: 'Partnerships define much of your identity. You shine brightest in collaboration.',
      8: 'Transformation and depth are central to who you are. You regenerate through crisis.',
      9: 'Your identity is tied to beliefs and exploration. Travel and learning expand your soul.',
      10: 'Career and public life are your stage. You\'re meant for visible achievement.',
      11: 'Community and future visions define you. You shine in groups and collective efforts.',
      12: 'Your true self is private and spiritual. You shine through compassion and solitude.',
    },
    Moon: {
      1: 'Your emotions are visible and shape your identity. You\'re intuitively expressive.',
      2: 'Emotional security comes from material stability. Comfort in possessions.',
      3: 'You process emotions through talking and thinking. Communication soothes you.',
      4: 'Deep emotional connection to home and family. Past patterns strongly influence you.',
      5: 'Emotions flow through creativity and romance. Children may be emotionally significant.',
      6: 'Emotional fulfillment through service. Health connected to emotional state.',
      7: 'You need emotional security through partnership. Nurturing in relationships.',
      8: 'Deep, intense emotional nature. Transformation through emotional intimacy.',
      9: 'Emotional growth through travel and learning. Feelings tied to beliefs.',
      10: 'Public image tied to emotional expression. Career in nurturing fields.',
      11: 'Emotional connection to friends and causes. Nurtured by community.',
      12: 'Rich inner emotional life. Deep psychic sensitivity and need for retreat.',
    },
  };

  return interpretations[planet]?.[house] ||
    `${planet} in the ${house}${getOrdinalSuffix(house)} house brings its energy to the realm of ${houses[house - 1].keywords.join(', ').toLowerCase()}.`;
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
