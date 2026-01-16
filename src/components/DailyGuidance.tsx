import { useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getCurrentPlanetPositions, getMoonPhase, calculateNatalChart } from '../utils/astrology';
import { calculateNumerology } from '../utils/numerology';
import { zodiacSigns } from '../data/zodiacSigns';
import { planets } from '../data/planets';
import { ZodiacSign } from '../types';
import './DailyGuidance.css';

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const dailyMessages: Record<ZodiacSign, string[]> = {
  Aries: [
    'Your pioneering spirit leads the way today. Trust your instincts.',
    'Bold action brings rewards. Don\'t hesitate when opportunity calls.',
    'Your natural leadership shines. Others look to you for guidance.',
  ],
  Taurus: [
    'Steady progress wins the day. Trust your practical wisdom.',
    'Beauty and comfort nurture your soul. Take time for sensory pleasures.',
    'Your patience is your power. Good things come to those who wait.',
  ],
  Gemini: [
    'Your quick mind dances between ideas. Follow your curiosity.',
    'Communication flows easily. Share your thoughts and make connections.',
    'Versatility is your strength. Embrace the variety life offers.',
  ],
  Cancer: [
    'Trust your intuition today. Your feelings are your compass.',
    'Nurturing energy surrounds you. Care for yourself and others.',
    'Home and family bring comfort. Create your sanctuary.',
  ],
  Leo: [
    'Your light shines brightly today. Express yourself with confidence.',
    'Creativity flows from your heart. Let your inner artist play.',
    'Generosity returns to you multiplied. Give from the heart.',
  ],
  Virgo: [
    'Details matter today. Your analytical skills serve you well.',
    'Service to others brings fulfillment. Your help makes a difference.',
    'Health and wellness call for attention. Honor your body\'s wisdom.',
  ],
  Libra: [
    'Balance and harmony guide your path. Seek fairness in all things.',
    'Relationships flourish with your diplomatic touch. Build bridges.',
    'Beauty uplifts your spirit. Surround yourself with aesthetic pleasure.',
  ],
  Scorpio: [
    'Deep transformation is available. Trust the process of renewal.',
    'Your intensity is magnetic. Channel your passion purposefully.',
    'Hidden truths reveal themselves. Your perception cuts through illusion.',
  ],
  Sagittarius: [
    'Adventure calls your spirit. Expand your horizons.',
    'Optimism lights your way. Your faith creates possibilities.',
    'Wisdom flows through experience. Every journey teaches.',
  ],
  Capricorn: [
    'Your ambition aligns with opportunity. Build toward your goals.',
    'Discipline and patience create lasting success. Stay the course.',
    'Authority comes naturally. Take responsibility with grace.',
  ],
  Aquarius: [
    'Innovation sparks your mind. Your unique vision benefits all.',
    'Community connections strengthen. Collaborate for change.',
    'Freedom calls your spirit. Be authentically yourself.',
  ],
  Pisces: [
    'Intuition and dreams guide you. Trust your inner knowing.',
    'Compassion opens doors. Your empathy heals others.',
    'Creativity flows like water. Let imagination carry you.',
  ],
};

const colors = [
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Purple', hex: '#7b4397' },
  { name: 'Blue', hex: '#4a90d9' },
  { name: 'Green', hex: '#2d6a4f' },
  { name: 'Red', hex: '#c1292e' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Pink', hex: '#e07b9a' },
  { name: 'Orange', hex: '#e76f51' },
  { name: 'Turquoise', hex: '#40916c' },
];

function generateLuckyNumbers(lifePath: number, dayOfYear: number): number[] {
  const numbers: Set<number> = new Set();
  numbers.add(lifePath);
  numbers.add((dayOfYear % 9) + 1);
  numbers.add(((lifePath + dayOfYear) % 22) + 1);

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 44) + 1);
  }

  return Array.from(numbers).slice(0, 5).sort((a, b) => a - b);
}

function generateLuckyColors(sunSign: ZodiacSign, dayOfYear: number): typeof colors {
  const element = zodiacSigns[sunSign].element;
  const elementColors: Record<string, string[]> = {
    fire: ['Red', 'Orange', 'Gold'],
    earth: ['Green', 'Brown', 'Gold'],
    air: ['Blue', 'White', 'Silver'],
    water: ['Blue', 'Purple', 'Silver'],
  };

  const baseColors = elementColors[element] || [];
  const result: typeof colors = [];

  colors.forEach(color => {
    if (baseColors.includes(color.name)) {
      result.push(color);
    }
  });

  // Add one more based on day
  const additionalIndex = dayOfYear % colors.length;
  if (!result.find(c => c.name === colors[additionalIndex].name)) {
    result.push(colors[additionalIndex]);
  }

  return result.slice(0, 3);
}

function generateAffirmation(sunSign: ZodiacSign, _moonPhase: string): string {
  const signAffirmations: Record<ZodiacSign, string> = {
    Aries: 'I am bold, courageous, and capable of achieving anything I set my mind to.',
    Taurus: 'I am grounded, abundant, and worthy of all the beauty life offers.',
    Gemini: 'I am adaptable, curious, and my mind is a gift to the world.',
    Cancer: 'I am nurturing, intuitive, and my emotions are my strength.',
    Leo: 'I am radiant, creative, and my light inspires others.',
    Virgo: 'I am precise, helpful, and my attention to detail creates excellence.',
    Libra: 'I am balanced, harmonious, and I create beauty wherever I go.',
    Scorpio: 'I am powerful, transformative, and I embrace my depth.',
    Sagittarius: 'I am optimistic, adventurous, and wisdom flows through me.',
    Capricorn: 'I am disciplined, ambitious, and I build lasting success.',
    Aquarius: 'I am innovative, unique, and my vision serves humanity.',
    Pisces: 'I am intuitive, compassionate, and connected to the divine.',
  };

  return signAffirmations[sunSign];
}

export function DailyGuidance() {
  const { profile, hasProfile } = useProfile();
  const currentPlanets = useMemo(() => getCurrentPlanetPositions(), []);
  const moonPhase = useMemo(() => getMoonPhase(), []);

  const sunPosition = currentPlanets.find(p => p.name === 'Sun');
  const moonPosition = currentPlanets.find(p => p.name === 'Moon');

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  const natalChart = useMemo(() => {
    if (!hasProfile || !profile.latitude) return null;
    return calculateNatalChart(
      profile.birthDate,
      profile.birthTime,
      profile.latitude,
      profile.longitude
    );
  }, [profile, hasProfile]);

  const numerology = useMemo(() => {
    if (!hasProfile) return null;
    return calculateNumerology(profile.name, profile.birthDate);
  }, [profile, hasProfile]);

  const userSunSign = natalChart?.planets.find(p => p.name === 'Sun')?.sign;
  const displaySign = userSunSign || sunPosition?.sign || 'Aries';

  const dailyMessage = useMemo(() => {
    const messages = dailyMessages[displaySign];
    return messages[dayOfYear % messages.length];
  }, [displaySign, dayOfYear]);

  const luckyNumbers = useMemo(() => {
    const lifePath = numerology?.lifePath || (dayOfYear % 9) + 1;
    return generateLuckyNumbers(lifePath, dayOfYear);
  }, [numerology, dayOfYear]);

  const luckyColors = useMemo(() => {
    return generateLuckyColors(displaySign, dayOfYear);
  }, [displaySign, dayOfYear]);

  const affirmation = useMemo(() => {
    return generateAffirmation(displaySign, moonPhase.phase);
  }, [displaySign, moonPhase.phase]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Daily Celestial Guidance</h1>
          <p>
            Your personalized cosmic forecast for{' '}
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="daily-hero card">
          <div className="hero-moon">
            <span className="hero-moon-emoji">{moonPhase.emoji}</span>
            <div className="hero-moon-info">
              <h3>{moonPhase.phase}</h3>
              <p>Moon in {moonPosition?.sign} {ZODIAC_SYMBOLS[moonPosition?.sign || 'Aries']}</p>
            </div>
          </div>

          <div className="hero-message">
            <p className="daily-message">{dailyMessage}</p>
          </div>

          <div className="hero-sun">
            <span className="hero-sun-symbol">{ZODIAC_SYMBOLS[displaySign]}</span>
            <p>Sun in {sunPosition?.sign}</p>
          </div>
        </div>

        <div className="daily-grid">
          <div className="affirmation-card card">
            <h3>Today's Affirmation</h3>
            <p className="affirmation-text">"{affirmation}"</p>
            <span className="affirmation-hint">
              Repeat this throughout the day to align with cosmic energy
            </span>
          </div>

          <div className="lucky-card card">
            <h3>Lucky Numbers</h3>
            <div className="lucky-numbers">
              {luckyNumbers.map((num, i) => (
                <span key={i} className="lucky-number">{num}</span>
              ))}
            </div>
          </div>

          <div className="lucky-card card">
            <h3>Lucky Colors</h3>
            <div className="lucky-colors">
              {luckyColors.map((color, i) => (
                <div key={i} className="lucky-color">
                  <span
                    className="color-swatch"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="color-name">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cosmic-weather card">
          <h3>Cosmic Weather</h3>
          <div className="weather-grid">
            <div className="weather-item">
              <h4>Sun in {sunPosition?.sign}</h4>
              <p>{planets.Sun.signInterpretations[sunPosition?.sign || 'Aries']}</p>
            </div>
            <div className="weather-item">
              <h4>Moon in {moonPosition?.sign}</h4>
              <p>{planets.Moon.signInterpretations[moonPosition?.sign || 'Aries']}</p>
            </div>
          </div>
        </div>

        <div className="moon-guidance-section card">
          <h3>{moonPhase.phase} Guidance</h3>
          <div className="moon-guidance-content">
            {moonPhase.phase === 'New Moon' && (
              <>
                <p><strong>Theme:</strong> New Beginnings</p>
                <p>Set intentions, plant seeds, start fresh projects. The energy supports initiating new ventures and setting goals for the lunar cycle ahead.</p>
                <ul>
                  <li>Write down your intentions for this moon cycle</li>
                  <li>Begin new projects or habits</li>
                  <li>Practice visualization and manifestation</li>
                </ul>
              </>
            )}
            {moonPhase.phase.includes('Waxing Crescent') && (
              <>
                <p><strong>Theme:</strong> Building Momentum</p>
                <p>Take action on your New Moon intentions. Energy is building—use it to make progress on your goals.</p>
                <ul>
                  <li>Take concrete steps toward your goals</li>
                  <li>Stay committed despite early challenges</li>
                  <li>Trust the process and maintain faith</li>
                </ul>
              </>
            )}
            {moonPhase.phase === 'First Quarter' && (
              <>
                <p><strong>Theme:</strong> Action & Decisions</p>
                <p>Time to take decisive action. You may face challenges that require courage and commitment.</p>
                <ul>
                  <li>Make important decisions</li>
                  <li>Overcome obstacles with determination</li>
                  <li>Adjust your approach if needed</li>
                </ul>
              </>
            )}
            {moonPhase.phase.includes('Waxing Gibbous') && (
              <>
                <p><strong>Theme:</strong> Refinement</p>
                <p>Fine-tune your efforts. Make adjustments and prepare for the Full Moon culmination.</p>
                <ul>
                  <li>Review and refine your work</li>
                  <li>Trust that completion is near</li>
                  <li>Stay focused on your vision</li>
                </ul>
              </>
            )}
            {moonPhase.phase === 'Full Moon' && (
              <>
                <p><strong>Theme:</strong> Illumination & Release</p>
                <p>Peak energy for manifestation and release. Emotions run high—use this for healing and celebration.</p>
                <ul>
                  <li>Celebrate your achievements</li>
                  <li>Release what no longer serves you</li>
                  <li>Practice gratitude and forgiveness</li>
                </ul>
              </>
            )}
            {moonPhase.phase.includes('Waning Gibbous') && (
              <>
                <p><strong>Theme:</strong> Gratitude & Sharing</p>
                <p>Share your wisdom and gifts. Express gratitude for what you've received and learned.</p>
                <ul>
                  <li>Share knowledge with others</li>
                  <li>Express appreciation and thanks</li>
                  <li>Begin to wind down activities</li>
                </ul>
              </>
            )}
            {moonPhase.phase === 'Last Quarter' && (
              <>
                <p><strong>Theme:</strong> Release & Forgiveness</p>
                <p>Let go of what's complete. Forgive, release, and create space for the new.</p>
                <ul>
                  <li>Complete unfinished business</li>
                  <li>Practice forgiveness and letting go</li>
                  <li>Clear physical and emotional clutter</li>
                </ul>
              </>
            )}
            {moonPhase.phase.includes('Waning Crescent') && (
              <>
                <p><strong>Theme:</strong> Rest & Reflection</p>
                <p>Time for introspection and rest before the new cycle. Honor your need for solitude.</p>
                <ul>
                  <li>Rest and restore your energy</li>
                  <li>Reflect on the cycle's lessons</li>
                  <li>Prepare for new beginnings</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
