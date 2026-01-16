import { useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { calculateNatalChart } from '../utils/astrology';
import { zodiacSigns } from '../data/zodiacSigns';
import { planets } from '../data/planets';
import { houses, getHouseInterpretation } from '../data/houses';
import { PlanetPosition, ZodiacSign } from '../types';
import './BirthChart.css';

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

interface ChartWheelProps {
  planetPositions: PlanetPosition[];
  ascendantDegree: number;
}

function ChartWheel({ planetPositions, ascendantDegree }: ChartWheelProps) {
  const size = 400;
  const center = size / 2;
  const outerRadius = size / 2 - 10;
  const zodiacRadius = outerRadius - 30;
  const planetRadius = zodiacRadius - 40;
  const innerRadius = planetRadius - 30;

  // Rotate chart so Ascendant is on the left (9 o'clock position)
  const rotation = -ascendantDegree - 180;

  const zodiacPositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 + 15 + rotation) * Math.PI / 180;
    return {
      x: center + Math.cos(angle) * zodiacRadius,
      y: center + Math.sin(angle) * zodiacRadius,
      sign: Object.keys(ZODIAC_SYMBOLS)[i] as ZodiacSign,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="chart-wheel">
      {/* Outer circle */}
      <circle cx={center} cy={center} r={outerRadius} className="chart-outer" />

      {/* Zodiac ring */}
      <circle cx={center} cy={center} r={zodiacRadius} className="chart-zodiac-ring" />

      {/* House divisions */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 + rotation) * Math.PI / 180;
        const x1 = center + Math.cos(angle) * innerRadius;
        const y1 = center + Math.sin(angle) * innerRadius;
        const x2 = center + Math.cos(angle) * outerRadius;
        const y2 = center + Math.sin(angle) * outerRadius;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="chart-division" />;
      })}

      {/* Inner circle */}
      <circle cx={center} cy={center} r={innerRadius} className="chart-inner" />

      {/* Zodiac symbols */}
      {zodiacPositions.map(({ x, y, sign }) => (
        <text
          key={sign}
          x={x}
          y={y}
          className={`chart-zodiac-symbol ${zodiacSigns[sign].element}`}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {ZODIAC_SYMBOLS[sign]}
        </text>
      ))}

      {/* Planet positions */}
      {planetPositions.map((planet) => {
        const angle = (planet.longitude + rotation) * Math.PI / 180;
        const x = center + Math.cos(angle) * planetRadius;
        const y = center + Math.sin(angle) * planetRadius;

        return (
          <g key={planet.name}>
            <circle cx={x} cy={y} r={12} className="planet-bg" />
            <text
              x={x}
              y={y}
              className={`chart-planet ${planet.retrograde ? 'retrograde' : ''}`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {planet.symbol}
            </text>
          </g>
        );
      })}

      {/* Ascendant marker */}
      <text
        x={10}
        y={center}
        className="chart-asc-marker"
        textAnchor="start"
        dominantBaseline="middle"
      >
        ASC
      </text>
    </svg>
  );
}

interface PlanetListProps {
  positions: PlanetPosition[];
}

function PlanetList({ positions }: PlanetListProps) {
  return (
    <div className="planet-list">
      {positions.map((planet) => (
        <div key={planet.name} className="planet-row">
          <div className="planet-symbol-cell">
            <span className="planet-symbol">{planet.symbol}</span>
            <span className="planet-name">{planet.name}</span>
            {planet.retrograde && <span className="retrograde-badge">R</span>}
          </div>
          <div className="planet-position-cell">
            <span className="zodiac-symbol">{ZODIAC_SYMBOLS[planet.sign]}</span>
            <span className="sign-name">{planet.sign}</span>
            <span className="degree">
              {planet.degree}° {planet.minute}'
            </span>
          </div>
          {planet.house && (
            <div className="planet-house-cell">
              House {planet.house}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function BirthChart() {
  const { profile, hasProfile } = useProfile();

  const natalChart = useMemo(() => {
    if (!hasProfile || !profile.latitude) return null;
    return calculateNatalChart(
      profile.birthDate,
      profile.birthTime,
      profile.latitude,
      profile.longitude
    );
  }, [profile, hasProfile]);

  if (!hasProfile) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Birth Chart</h1>
            <p>Please complete your profile first to see your natal chart.</p>
          </div>
          <div className="empty-state card">
            <span className="empty-icon">☉</span>
            <h3>Profile Required</h3>
            <p>Your birth chart requires your birth date, time, and location.</p>
            <a href="/profile" className="btn-primary">Complete Profile</a>
          </div>
        </div>
      </div>
    );
  }

  if (!natalChart) return null;

  const ascendantLongitude = natalChart.houses[0].degree +
    Object.keys(ZODIAC_SYMBOLS).indexOf(natalChart.ascendant.sign) * 30;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Your Natal Chart</h1>
          <p>
            The cosmic snapshot of the sky at the moment of your birth.
            This map reveals your soul's blueprint and life potential.
          </p>
        </div>

        <div className="birth-chart-layout">
          <div className="chart-visual card">
            <ChartWheel
              planetPositions={natalChart.planets}
              ascendantDegree={ascendantLongitude}
            />
            <div className="chart-legend">
              <div className="legend-item fire">Fire Signs</div>
              <div className="legend-item earth">Earth Signs</div>
              <div className="legend-item air">Air Signs</div>
              <div className="legend-item water">Water Signs</div>
            </div>
          </div>

          <div className="chart-details">
            <div className="card key-points">
              <h3>Key Points</h3>
              <div className="key-point">
                <span className="key-label">Rising Sign (ASC)</span>
                <span className="key-value">
                  {ZODIAC_SYMBOLS[natalChart.ascendant.sign]} {natalChart.ascendant.sign} {natalChart.ascendant.degree}°
                </span>
              </div>
              <div className="key-point">
                <span className="key-label">Midheaven (MC)</span>
                <span className="key-value">
                  {ZODIAC_SYMBOLS[natalChart.midheaven.sign]} {natalChart.midheaven.sign} {natalChart.midheaven.degree}°
                </span>
              </div>
            </div>

            <div className="card">
              <h3>Planetary Positions</h3>
              <PlanetList positions={natalChart.planets} />
            </div>
          </div>
        </div>

        <div className="interpretations">
          <h2>Your Planetary Interpretations</h2>
          <div className="interpretation-grid">
            {natalChart.planets.slice(0, 5).map((planet) => (
              <div key={planet.name} className="interpretation-card card">
                <div className="interp-header">
                  <span className="interp-symbol">{planet.symbol}</span>
                  <div>
                    <h4>{planet.name} in {planet.sign}</h4>
                    {planet.house && <span className="interp-house">House {planet.house}</span>}
                  </div>
                </div>
                <p className="interp-sign">
                  {planets[planet.name]?.signInterpretations[planet.sign]}
                </p>
                {planet.house && (
                  <p className="interp-house-text">
                    {getHouseInterpretation(planet.name, planet.house)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="houses-section">
          <h2>House Meanings</h2>
          <div className="houses-grid">
            {houses.map((house) => (
              <div key={house.number} className="house-card card">
                <div className="house-number">{house.number}</div>
                <h4>{house.name}</h4>
                <div className="house-keywords">
                  {house.keywords.slice(0, 3).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
