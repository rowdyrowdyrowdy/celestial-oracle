import { useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { calculateNumerology, numerologyInterpretations } from '../utils/numerology';
import './Numerology.css';

interface NumberCardProps {
  title: string;
  number: number;
  description: string;
  interpretation: string;
}

function NumberCard({ title, number, description, interpretation }: NumberCardProps) {
  const isMaster = number === 11 || number === 22 || number === 33;
  const info = numerologyInterpretations[number];

  return (
    <div className={`number-card card ${isMaster ? 'master-number' : ''}`}>
      <div className="number-header">
        <span className="number-value">{number}</span>
        <div className="number-title-group">
          <h3>{title}</h3>
          {info && <span className="number-archetype">{info.title}</span>}
        </div>
      </div>

      <p className="number-description">{description}</p>

      {info && (
        <div className="number-keywords">
          {info.keywords.map((keyword, i) => (
            <span key={i} className="keyword">{keyword}</span>
          ))}
        </div>
      )}

      <div className="number-interpretation">
        <p>{interpretation}</p>
      </div>
    </div>
  );
}

export function Numerology() {
  const { profile, hasProfile } = useProfile();

  const numerology = useMemo(() => {
    if (!hasProfile) return null;
    return calculateNumerology(profile.name, profile.birthDate);
  }, [profile.name, profile.birthDate, hasProfile]);

  if (!hasProfile) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Numerology</h1>
            <p>
              Please complete your profile first to see your personal numerology reading.
            </p>
          </div>
          <div className="empty-state card">
            <span className="empty-icon">⟡</span>
            <h3>Profile Required</h3>
            <p>Your numerology calculations require your full name and birth date.</p>
            <a href="/profile" className="btn-primary">Complete Profile</a>
          </div>
        </div>
      </div>
    );
  }

  if (!numerology) return null;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Your Numerology Profile</h1>
          <p>
            Discover the mystical numbers that shape your destiny. Each number reveals
            different aspects of your personality, purpose, and potential.
          </p>
        </div>

        <div className="numerology-grid">
          <NumberCard
            title="Life Path Number"
            number={numerology.lifePath}
            description="Your life's purpose and the path you're meant to walk. This is the most important number in your numerology chart."
            interpretation={numerologyInterpretations[numerology.lifePath]?.lifePath || ''}
          />

          <NumberCard
            title="Expression Number"
            number={numerology.expression}
            description="Also called the Destiny Number, this reveals your natural talents and the way you express yourself in the world."
            interpretation={numerologyInterpretations[numerology.expression]?.expression || ''}
          />

          <NumberCard
            title="Soul Urge Number"
            number={numerology.soulUrge}
            description="Your heart's deepest desire. This number reveals what truly motivates you at your core."
            interpretation={numerologyInterpretations[numerology.soulUrge]?.soulUrge || ''}
          />

          <NumberCard
            title="Personality Number"
            number={numerology.personality}
            description="How others perceive you. This is the outer you that the world sees."
            interpretation={numerologyInterpretations[numerology.personality]?.personality || ''}
          />

          <NumberCard
            title="Birthday Number"
            number={numerology.birthday}
            description="A special gift or talent you possess. This number adds flavor to your life path."
            interpretation={`Your birthday number of ${numerology.birthday} adds the qualities of ${numerologyInterpretations[numerology.birthday]?.title || 'this vibration'} to your cosmic blueprint.`}
          />
        </div>

        <div className="numerology-info card">
          <h3>Understanding Your Numbers</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Single Digits (1-9)</h4>
              <p>Each single digit carries a unique vibration and meaning in numerology.</p>
            </div>
            <div className="info-item">
              <h4>Master Numbers (11, 22, 33)</h4>
              <p>These powerful numbers indicate souls with special missions and heightened potential.</p>
            </div>
            <div className="info-item">
              <h4>Pythagorean System</h4>
              <p>We use the ancient Pythagorean system of letter-to-number correspondence.</p>
            </div>
            <div className="info-item">
              <h4>Your Full Name</h4>
              <p>Use your full birth name as it appears on your birth certificate for accuracy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
