import { useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getCurrentPlanetPositions, calculateNatalChart, getMoonPhase } from '../utils/astrology';
import { planets } from '../data/planets';
import { zodiacSigns } from '../data/zodiacSigns';
import { PlanetPosition, ZodiacSign } from '../types';
import './Transits.css';

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

interface AspectInfo {
  planet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
  meaning: string;
}

function calculateAspects(transitPlanets: PlanetPosition[], natalPlanets: PlanetPosition[]): AspectInfo[] {
  const aspects: AspectInfo[] = [];
  const aspectAngles = [
    { name: 'Conjunction', angle: 0, orb: 8, meaning: 'intensifies and merges energies' },
    { name: 'Sextile', angle: 60, orb: 6, meaning: 'offers opportunities and ease' },
    { name: 'Square', angle: 90, orb: 8, meaning: 'creates tension and growth' },
    { name: 'Trine', angle: 120, orb: 8, meaning: 'brings harmony and flow' },
    { name: 'Opposition', angle: 180, orb: 8, meaning: 'highlights balance and awareness' },
  ];

  transitPlanets.forEach(transit => {
    natalPlanets.forEach(natal => {
      const diff = Math.abs(transit.longitude - natal.longitude);
      const normalized = diff > 180 ? 360 - diff : diff;

      aspectAngles.forEach(({ name, angle, orb, meaning }) => {
        const actualOrb = Math.abs(normalized - angle);
        if (actualOrb <= orb) {
          aspects.push({
            planet: transit.name,
            natalPlanet: natal.name,
            aspect: name,
            orb: Math.round(actualOrb * 10) / 10,
            meaning,
          });
        }
      });
    });
  });

  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 10);
}

function PlanetTransitCard({ planet }: { planet: PlanetPosition }) {
  const info = planets[planet.name];
  const signInfo = zodiacSigns[planet.sign];

  return (
    <div className={`transit-card card ${planet.retrograde ? 'retrograde' : ''}`}>
      <div className="transit-header">
        <span className="transit-symbol">{planet.symbol}</span>
        <div className="transit-info">
          <h4>{planet.name}</h4>
          {planet.retrograde && <span className="retrograde-badge">Retrograde</span>}
        </div>
      </div>

      <div className="transit-position">
        <span className="transit-sign-symbol">{ZODIAC_SYMBOLS[planet.sign]}</span>
        <span className="transit-sign-name">{planet.sign}</span>
        <span className="transit-degree">{planet.degree}° {planet.minute}'</span>
      </div>

      <p className="transit-description">
        {info?.signInterpretations[planet.sign]}
      </p>

      <div className="transit-element">
        <span className={`element-badge ${signInfo.element}`}>
          {signInfo.element}
        </span>
        <span className={`modality-badge`}>
          {signInfo.modality}
        </span>
      </div>
    </div>
  );
}

export function Transits() {
  const { profile, hasProfile } = useProfile();

  const currentPlanets = useMemo(() => getCurrentPlanetPositions(), []);
  const moonPhase = useMemo(() => getMoonPhase(), []);

  const natalChart = useMemo(() => {
    if (!hasProfile || !profile.latitude) return null;
    return calculateNatalChart(
      profile.birthDate,
      profile.birthTime,
      profile.latitude,
      profile.longitude
    );
  }, [profile, hasProfile]);

  const aspects = useMemo(() => {
    if (!natalChart) return [];
    return calculateAspects(currentPlanets, natalChart.planets);
  }, [currentPlanets, natalChart]);

  const retrogrades = currentPlanets.filter(p => p.retrograde);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Current Planetary Transits</h1>
          <p>
            The cosmic weather right now. See where the planets are today
            and how they may be influencing your life.
          </p>
        </div>

        <div className="transits-overview">
          <div className="moon-phase-card card">
            <span className="moon-emoji">{moonPhase.emoji}</span>
            <h3>{moonPhase.phase}</h3>
            <p>{Math.round(moonPhase.illumination)}% illuminated</p>
            <div className="moon-guidance">
              {moonPhase.phase.includes('New') && (
                <p>Perfect time for new beginnings, setting intentions, and planting seeds.</p>
              )}
              {moonPhase.phase.includes('Waxing') && (
                <p>Energy is building. Take action on your goals and build momentum.</p>
              )}
              {moonPhase.phase.includes('Full') && (
                <p>Peak energy for manifestation, release, and celebration of achievements.</p>
              )}
              {moonPhase.phase.includes('Waning') && (
                <p>Time for reflection, release, and letting go of what no longer serves.</p>
              )}
            </div>
          </div>

          {retrogrades.length > 0 && (
            <div className="retrogrades-card card">
              <h3>Current Retrogrades</h3>
              <div className="retrograde-list">
                {retrogrades.map(planet => (
                  <div key={planet.name} className="retrograde-item">
                    <span className="retrograde-symbol">{planet.symbol}</span>
                    <span className="retrograde-name">{planet.name}</span>
                    <span className="retrograde-sign">in {planet.sign}</span>
                  </div>
                ))}
              </div>
              <p className="retrograde-note">
                Retrograde planets invite us to review, reflect, and revisit matters
                related to their domain.
              </p>
            </div>
          )}
        </div>

        {hasProfile && aspects.length > 0 && (
          <div className="aspects-section">
            <h2>Personal Transits</h2>
            <p className="section-subtitle">
              How today's planetary positions aspect your natal chart
            </p>
            <div className="aspects-grid">
              {aspects.map((aspect, i) => (
                <div key={i} className="aspect-card card">
                  <div className="aspect-planets">
                    <span>{planets[aspect.planet]?.symbol} {aspect.planet}</span>
                    <span className="aspect-type">{aspect.aspect}</span>
                    <span>{planets[aspect.natalPlanet]?.symbol} natal {aspect.natalPlanet}</span>
                  </div>
                  <p className="aspect-meaning">
                    This transit {aspect.meaning} between {aspect.planet} themes and your
                    natal {aspect.natalPlanet} expression.
                  </p>
                  <span className="aspect-orb">Orb: {aspect.orb}°</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="current-planets-section">
          <h2>Where the Planets Are Now</h2>
          <div className="planets-grid">
            {currentPlanets.map(planet => (
              <PlanetTransitCard key={planet.name} planet={planet} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
