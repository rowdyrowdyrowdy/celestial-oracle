import { ZodiacSign } from '../types';

export interface ZodiacInfo {
  name: ZodiacSign;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  dateRange: string;
  traits: string[];
  description: string;
}

export const zodiacSigns: Record<ZodiacSign, ZodiacInfo> = {
  Aries: {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    modality: 'cardinal',
    ruler: 'Mars',
    dateRange: 'March 21 - April 19',
    traits: ['Bold', 'Ambitious', 'Energetic', 'Competitive', 'Pioneering'],
    description: 'Aries is the first sign of the zodiac, embodying the energy of new beginnings and raw initiative. Ruled by Mars, Aries individuals are natural leaders who charge forward with courage and enthusiasm. They possess an innate warrior spirit and thrive on challenges.',
  },
  Taurus: {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    modality: 'fixed',
    ruler: 'Venus',
    dateRange: 'April 20 - May 20',
    traits: ['Reliable', 'Patient', 'Sensual', 'Determined', 'Practical'],
    description: 'Taurus represents stability, material security, and the pleasures of the physical world. Ruled by Venus, Taurus natives appreciate beauty, comfort, and the finer things in life. They are known for their steadfast loyalty and remarkable endurance.',
  },
  Gemini: {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    modality: 'mutable',
    ruler: 'Mercury',
    dateRange: 'May 21 - June 20',
    traits: ['Curious', 'Adaptable', 'Communicative', 'Witty', 'Versatile'],
    description: 'Gemini is the sign of the Twins, representing duality and the exchange of ideas. Ruled by Mercury, Geminis are master communicators with quick minds and an insatiable curiosity. They thrive on intellectual stimulation and social connection.',
  },
  Cancer: {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    modality: 'cardinal',
    ruler: 'Moon',
    dateRange: 'June 21 - July 22',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional', 'Tenacious'],
    description: 'Cancer is the sign of the Crab, deeply connected to home, family, and emotional security. Ruled by the Moon, Cancer natives are highly intuitive and empathic, with a strong need to nurture and protect those they love.',
  },
  Leo: {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    modality: 'fixed',
    ruler: 'Sun',
    dateRange: 'July 23 - August 22',
    traits: ['Creative', 'Generous', 'Confident', 'Dramatic', 'Warm-hearted'],
    description: 'Leo is the sign of the Lion, radiating warmth, creativity, and regal presence. Ruled by the Sun, Leos naturally draw attention and inspire others with their confidence and generosity. They have a flair for the dramatic and a big heart.',
  },
  Virgo: {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    modality: 'mutable',
    ruler: 'Mercury',
    dateRange: 'August 23 - September 22',
    traits: ['Analytical', 'Practical', 'Diligent', 'Modest', 'Health-conscious'],
    description: 'Virgo is the sign of service, precision, and practical wisdom. Ruled by Mercury, Virgos possess sharp analytical minds and a dedication to improvement. They find fulfillment in being helpful and in perfecting their craft.',
  },
  Libra: {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    modality: 'cardinal',
    ruler: 'Venus',
    dateRange: 'September 23 - October 22',
    traits: ['Diplomatic', 'Harmonious', 'Fair-minded', 'Social', 'Idealistic'],
    description: 'Libra is the sign of balance, relationships, and aesthetic beauty. Ruled by Venus, Libras seek harmony in all things and excel at seeing multiple perspectives. They are natural peacemakers with a refined sense of style.',
  },
  Scorpio: {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    modality: 'fixed',
    ruler: 'Pluto',
    dateRange: 'October 23 - November 21',
    traits: ['Intense', 'Passionate', 'Resourceful', 'Transformative', 'Mysterious'],
    description: 'Scorpio is the sign of depth, transformation, and hidden power. Ruled by Pluto, Scorpios dive deep into the mysteries of life and possess remarkable regenerative abilities. They are fiercely loyal and intensely passionate.',
  },
  Sagittarius: {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    modality: 'mutable',
    ruler: 'Jupiter',
    dateRange: 'November 22 - December 21',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Freedom-loving', 'Honest'],
    description: 'Sagittarius is the sign of the Archer, seeking truth, adventure, and expansion. Ruled by Jupiter, Sagittarians are natural philosophers and explorers with an optimistic outlook and love of freedom.',
  },
  Capricorn: {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    modality: 'cardinal',
    ruler: 'Saturn',
    dateRange: 'December 22 - January 19',
    traits: ['Ambitious', 'Disciplined', 'Responsible', 'Traditional', 'Patient'],
    description: 'Capricorn is the sign of achievement, structure, and long-term goals. Ruled by Saturn, Capricorns possess remarkable discipline and determination. They climb steadily toward their ambitions with wisdom and perseverance.',
  },
  Aquarius: {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    modality: 'fixed',
    ruler: 'Uranus',
    dateRange: 'January 20 - February 18',
    traits: ['Innovative', 'Humanitarian', 'Independent', 'Progressive', 'Original'],
    description: 'Aquarius is the sign of innovation, community, and future vision. Ruled by Uranus, Aquarians are ahead of their time, bringing revolutionary ideas and championing collective progress. They value authenticity and intellectual freedom.',
  },
  Pisces: {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    modality: 'mutable',
    ruler: 'Neptune',
    dateRange: 'February 19 - March 20',
    traits: ['Compassionate', 'Intuitive', 'Artistic', 'Dreamy', 'Spiritual'],
    description: 'Pisces is the sign of transcendence, compassion, and artistic imagination. Ruled by Neptune, Pisceans are deeply intuitive and empathic, often possessing psychic sensitivity. They navigate between the material and spiritual realms with ease.',
  },
};

export function getZodiacFromDegree(longitude: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

export function getDegreeInSign(longitude: number): { degree: number; minute: number } {
  const degreeInSign = longitude % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.floor((degreeInSign - degree) * 60);
  return { degree, minute };
}
