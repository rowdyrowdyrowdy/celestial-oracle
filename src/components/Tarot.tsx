import { useState, useEffect } from 'react';
import { drawCards, fullDeck } from '../data/tarotDeck';
import { TarotReading, DrawnCard } from '../types';
import './Tarot.css';

const STORAGE_KEY = 'celestial-oracle-readings';

type SpreadType = 'single' | 'three-card' | 'celtic-cross';

interface SpreadInfo {
  name: string;
  description: string;
  positions: string[];
  cardCount: number;
}

const spreads: Record<SpreadType, SpreadInfo> = {
  single: {
    name: 'Single Card',
    description: 'A quick daily insight or answer to a simple question',
    positions: ['Your Message'],
    cardCount: 1,
  },
  'three-card': {
    name: 'Three Card Spread',
    description: 'Past, Present, and Future - a complete story arc',
    positions: ['Past', 'Present', 'Future'],
    cardCount: 3,
  },
  'celtic-cross': {
    name: 'Celtic Cross',
    description: 'A comprehensive 10-card spread for deep insight',
    positions: [
      'Present', 'Challenge', 'Past', 'Future',
      'Above (Conscious)', 'Below (Subconscious)',
      'Advice', 'External Influences', 'Hopes & Fears', 'Outcome'
    ],
    cardCount: 10,
  },
};

interface TarotCardProps {
  drawnCard: DrawnCard;
  position: string;
  isFlipped: boolean;
  onFlip: () => void;
}

function TarotCardDisplay({ drawnCard, position, isFlipped, onFlip }: TarotCardProps) {
  const { card, reversed } = drawnCard;

  return (
    <div className="tarot-card-container">
      <div className="card-position">{position}</div>
      <div
        className={`tarot-card ${isFlipped ? 'flipped' : ''} ${reversed ? 'reversed' : ''}`}
        onClick={onFlip}
      >
        <div className="card-inner">
          <div className="card-back">
            <div className="card-back-pattern">
              <span>✧</span>
            </div>
          </div>
          <div className="card-front">
            <div className="card-image">
              <div className="card-placeholder">
                <span className="card-numeral">
                  {card.arcana === 'major' ? toRomanNumeral(card.number) : card.number}
                </span>
                {card.suit && <span className="card-suit">{getSuitSymbol(card.suit)}</span>}
              </div>
            </div>
            <div className="card-name">{card.name}</div>
            {reversed && <div className="reversed-indicator">Reversed</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function toRomanNumeral(num: number): string {
  const numerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  return numerals[num] || String(num);
}

function getSuitSymbol(suit: string): string {
  const symbols: Record<string, string> = {
    wands: '🜂',
    cups: '🜄',
    swords: '🜁',
    pentacles: '🜃',
  };
  return symbols[suit] || '';
}

export function Tarot() {
  const [spreadType, setSpreadType] = useState<SpreadType>('three-card');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isReading, setIsReading] = useState(false);
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<TarotReading[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const startReading = () => {
    const spread = spreads[spreadType];
    const cards = drawCards(spread.cardCount, fullDeck);
    const drawn: DrawnCard[] = cards.map((c, i) => ({
      ...c,
      position: spread.positions[i],
    }));

    setDrawnCards(drawn);
    setFlippedCards(new Set());
    setIsReading(true);

    // Auto-flip cards with delay
    drawn.forEach((_, index) => {
      setTimeout(() => {
        setFlippedCards(prev => new Set([...prev, index]));
      }, 500 + index * 300);
    });
  };

  const saveReading = () => {
    const reading: TarotReading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      spreadType,
      cards: drawnCards,
      question: question || undefined,
    };

    const newHistory = [reading, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const resetReading = () => {
    setDrawnCards([]);
    setFlippedCards(new Set());
    setIsReading(false);
    setQuestion('');
  };

  const flipCard = (index: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Tarot Reading</h1>
          <p>
            Draw cards from the mystic deck to receive guidance and insight.
            Focus on your question as you shuffle and draw.
          </p>
        </div>

        {!isReading ? (
          <div className="tarot-setup">
            <div className="spread-selection card">
              <h3>Choose Your Spread</h3>
              <div className="spread-options">
                {(Object.entries(spreads) as [SpreadType, SpreadInfo][]).map(([key, spread]) => (
                  <button
                    key={key}
                    className={`spread-option ${spreadType === key ? 'active' : ''}`}
                    onClick={() => setSpreadType(key)}
                  >
                    <span className="spread-name">{spread.name}</span>
                    <span className="spread-count">{spread.cardCount} cards</span>
                    <span className="spread-desc">{spread.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="question-input card">
              <h3>Focus Your Intention</h3>
              <p>Optionally, write your question or focus for this reading:</p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What guidance do I need today?"
                rows={3}
              />
            </div>

            <div className="reading-actions">
              <button className="btn-primary draw-button" onClick={startReading}>
                Shuffle & Draw Cards
              </button>
              <button onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? 'Hide History' : 'View Past Readings'}
              </button>
            </div>
          </div>
        ) : (
          <div className="tarot-reading">
            {question && (
              <div className="reading-question">
                <span>Your Question:</span> {question}
              </div>
            )}

            <div className={`cards-display spread-${spreadType}`}>
              {drawnCards.map((drawn, index) => (
                <TarotCardDisplay
                  key={index}
                  drawnCard={drawn}
                  position={spreads[spreadType].positions[index]}
                  isFlipped={flippedCards.has(index)}
                  onFlip={() => flipCard(index)}
                />
              ))}
            </div>

            {flippedCards.size === drawnCards.length && (
              <div className="interpretation-section">
                <h3>Your Reading</h3>
                <div className="interpretations">
                  {drawnCards.map((drawn, index) => (
                    <div key={index} className="card-interpretation card">
                      <h4>
                        {spreads[spreadType].positions[index]}: {drawn.card.name}
                        {drawn.reversed && <span className="rev-badge"> (Reversed)</span>}
                      </h4>
                      <div className="keywords">
                        {drawn.card.keywords.map((kw, i) => (
                          <span key={i} className="keyword">{kw}</span>
                        ))}
                      </div>
                      <p>
                        {drawn.reversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="reading-complete-actions">
                  <button className="btn-primary" onClick={saveReading}>
                    Save Reading
                  </button>
                  <button onClick={resetReading}>
                    New Reading
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showHistory && history.length > 0 && (
          <div className="reading-history">
            <h3>Past Readings</h3>
            <div className="history-list">
              {history.map((reading) => (
                <div key={reading.id} className="history-item card">
                  <div className="history-header">
                    <span className="history-date">
                      {new Date(reading.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="history-spread">{spreads[reading.spreadType].name}</span>
                  </div>
                  {reading.question && (
                    <p className="history-question">{reading.question}</p>
                  )}
                  <div className="history-cards">
                    {reading.cards.map((c, i) => (
                      <span key={i} className="history-card">
                        {c.card.name}{c.reversed ? ' (R)' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
