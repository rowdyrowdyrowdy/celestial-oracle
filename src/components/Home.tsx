import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { getMoonPhase, getCurrentPlanetPositions } from '../utils/astrology';
import { zodiacSigns } from '../data/zodiacSigns';
import './Home.css';

const features = [
  {
    icon: '☉',
    title: 'Birth Chart',
    description: 'Discover your complete natal chart with planetary positions, houses, and interpretations.',
    path: '/birth-chart',
  },
  {
    icon: '⟡',
    title: 'Numerology',
    description: 'Calculate your Life Path, Expression, Soul Urge, and Personality numbers.',
    path: '/numerology',
  },
  {
    icon: '☿',
    title: 'Transits',
    description: 'Track current planetary positions and how they interact with your chart.',
    path: '/transits',
  },
  {
    icon: '★',
    title: 'Daily Guidance',
    description: 'Receive personalized daily cosmic guidance based on current energies.',
    path: '/daily',
  },
  {
    icon: '⚝',
    title: 'Tarot',
    description: 'Draw cards from the mystical deck for insight and guidance.',
    path: '/tarot',
  },
  {
    icon: '☾',
    title: 'Journal',
    description: 'Write intentions and reflections aligned with moon phases.',
    path: '/journal',
  },
];

export function Home() {
  const { profile, hasProfile } = useProfile();
  const moonPhase = useMemo(() => getMoonPhase(), []);
  const currentPlanets = useMemo(() => getCurrentPlanetPositions(), []);

  const sunSign = currentPlanets.find(p => p.name === 'Sun')?.sign || 'Aries';
  const moonSign = currentPlanets.find(p => p.name === 'Moon')?.sign || 'Aries';

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Celestial Oracle</h1>
          <p className="hero-subtitle">
            Your personal guide to the cosmic mysteries
          </p>
          <p className="hero-description">
            Explore your birth chart, discover your numerology profile, draw tarot cards,
            and align with the rhythms of the cosmos.
          </p>
          {!hasProfile ? (
            <Link to="/profile" className="btn-primary hero-cta">
              Begin Your Journey
            </Link>
          ) : (
            <Link to="/daily" className="btn-primary hero-cta">
              View Today's Guidance
            </Link>
          )}
        </div>

        <div className="cosmic-status">
          <div className="status-item">
            <span className="status-emoji">{moonPhase.emoji}</span>
            <div className="status-info">
              <span className="status-label">Moon Phase</span>
              <span className="status-value">{moonPhase.phase}</span>
            </div>
          </div>
          <div className="status-item">
            <span className="status-symbol">{zodiacSigns[sunSign].symbol}</span>
            <div className="status-info">
              <span className="status-label">Sun in</span>
              <span className="status-value">{sunSign}</span>
            </div>
          </div>
          <div className="status-item">
            <span className="status-symbol">{zodiacSigns[moonSign].symbol}</span>
            <div className="status-info">
              <span className="status-label">Moon in</span>
              <span className="status-value">{moonSign}</span>
            </div>
          </div>
        </div>
      </section>

      {hasProfile && (
        <section className="welcome-back">
          <div className="container">
            <div className="welcome-card card">
              <h2>Welcome back, {profile.name.split(' ')[0]}</h2>
              <p>
                The stars continue their eternal dance. What cosmic wisdom do you seek today?
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="features">
        <div className="container">
          <h2>Explore the Mysteries</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <Link to={feature.path} key={feature.path} className="feature-card card">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <div className="about-content card">
            <h2>About Celestial Oracle</h2>
            <p>
              Celestial Oracle combines ancient wisdom with modern technology to provide
              you with personalized spiritual insights. Our calculations are based on
              established astrological and numerological traditions, adapted for the
              digital age.
            </p>
            <div className="about-features">
              <div className="about-item">
                <h4>Accurate Calculations</h4>
                <p>Planetary positions calculated using astronomical algorithms</p>
              </div>
              <div className="about-item">
                <h4>Personal Privacy</h4>
                <p>All your data is stored locally on your device</p>
              </div>
              <div className="about-item">
                <h4>Comprehensive Tools</h4>
                <p>Astrology, numerology, tarot, and journaling in one place</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
