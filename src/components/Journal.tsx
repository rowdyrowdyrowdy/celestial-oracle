import { useState, useEffect, useMemo } from 'react';
import { getMoonPhase, getCurrentPlanetPositions } from '../utils/astrology';
import { JournalEntry, MoonPhase as MoonPhaseType } from '../types';
import './Journal.css';

const STORAGE_KEY = 'celestial-oracle-journal';

const moonPhaseMap: Record<string, MoonPhaseType> = {
  'New Moon': 'new',
  'Waxing Crescent': 'waxing-crescent',
  'First Quarter': 'first-quarter',
  'Waxing Gibbous': 'waxing-gibbous',
  'Full Moon': 'full',
  'Waning Gibbous': 'waning-gibbous',
  'Last Quarter': 'last-quarter',
  'Waning Crescent': 'waning-crescent',
};

const prompts: Record<MoonPhaseType, string[]> = {
  'new': [
    'What new beginning am I ready to embrace?',
    'What seeds do I want to plant this lunar cycle?',
    'What intentions will I set for this fresh start?',
  ],
  'waxing-crescent': [
    'What first steps am I taking toward my goals?',
    'What challenges might arise, and how will I meet them?',
    'What momentum am I building?',
  ],
  'first-quarter': [
    'What decisions need to be made right now?',
    'What obstacles am I facing, and how can I overcome them?',
    'What action feels most aligned with my intentions?',
  ],
  'waxing-gibbous': [
    'What refinements can I make to my approach?',
    'How am I staying committed to my goals?',
    'What adjustments will help me succeed?',
  ],
  'full': [
    'What has come to fruition in my life?',
    'What am I ready to release and let go of?',
    'What insights have I gained this cycle?',
  ],
  'waning-gibbous': [
    'What wisdom have I gained to share with others?',
    'What am I grateful for this cycle?',
    'How have I grown since the New Moon?',
  ],
  'last-quarter': [
    'What needs to be completed before the new cycle?',
    'What am I ready to forgive and release?',
    'What habits or patterns am I letting go of?',
  ],
  'waning-crescent': [
    'What rest and renewal do I need right now?',
    'What lessons from this cycle will I carry forward?',
    'How can I prepare for the next New Moon?',
  ],
};

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [intentions, setIntentions] = useState<string[]>(['']);
  const [gratitude, setGratitude] = useState<string[]>(['']);
  const [editingId, setEditingId] = useState<string | null>(null);

  const moonPhase = useMemo(() => getMoonPhase(), []);
  const currentPlanets = useMemo(() => getCurrentPlanetPositions(), []);
  const moonSign = currentPlanets.find(p => p.name === 'Moon')?.sign || 'Aries';

  const currentMoonPhaseType: MoonPhaseType = moonPhaseMap[moonPhase.phase] || 'new';
  const todayPrompts = prompts[currentMoonPhaseType];

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const handleSave = () => {
    const entry: JournalEntry = {
      id: editingId || Date.now().toString(),
      date: new Date().toISOString(),
      moonPhase: currentMoonPhaseType,
      content,
      intentions: intentions.filter(i => i.trim()),
      gratitude: gratitude.filter(g => g.trim()),
    };

    let newEntries: JournalEntry[];
    if (editingId) {
      newEntries = entries.map(e => e.id === editingId ? entry : e);
    } else {
      newEntries = [entry, ...entries];
    }

    saveEntries(newEntries);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    saveEntries(newEntries);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setContent(entry.content);
    setIntentions(entry.intentions.length ? entry.intentions : ['']);
    setGratitude(entry.gratitude.length ? entry.gratitude : ['']);
    setIsWriting(true);
  };

  const resetForm = () => {
    setContent('');
    setIntentions(['']);
    setGratitude(['']);
    setEditingId(null);
    setIsWriting(false);
  };

  const addIntention = () => setIntentions([...intentions, '']);
  const addGratitude = () => setGratitude([...gratitude, '']);

  const updateIntention = (index: number, value: string) => {
    const updated = [...intentions];
    updated[index] = value;
    setIntentions(updated);
  };

  const updateGratitude = (index: number, value: string) => {
    const updated = [...gratitude];
    updated[index] = value;
    setGratitude(updated);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Manifestation Journal</h1>
          <p>
            Write your intentions aligned with the moon phases. Track your
            spiritual journey and manifest your desires through conscious reflection.
          </p>
        </div>

        <div className="journal-header">
          <div className="current-energy card">
            <div className="energy-moon">
              <span className="energy-emoji">{moonPhase.emoji}</span>
              <div>
                <h3>{moonPhase.phase}</h3>
                <p>Moon in {moonSign}</p>
              </div>
            </div>
            <div className="energy-guidance">
              <h4>Today's Energy</h4>
              {currentMoonPhaseType === 'new' && (
                <p>Perfect for setting intentions and new beginnings. Plant the seeds of what you wish to manifest.</p>
              )}
              {currentMoonPhaseType === 'waxing-crescent' && (
                <p>Build momentum toward your goals. Take action on your intentions.</p>
              )}
              {currentMoonPhaseType === 'first-quarter' && (
                <p>Time for decisive action. Face challenges head-on and stay committed.</p>
              )}
              {currentMoonPhaseType === 'waxing-gibbous' && (
                <p>Refine your approach. Make adjustments and trust the process.</p>
              )}
              {currentMoonPhaseType === 'full' && (
                <p>Peak manifestation energy. Celebrate achievements and release what no longer serves.</p>
              )}
              {currentMoonPhaseType === 'waning-gibbous' && (
                <p>Share your wisdom and express gratitude. Reflect on your growth.</p>
              )}
              {currentMoonPhaseType === 'last-quarter' && (
                <p>Complete unfinished business. Forgive, release, and create space.</p>
              )}
              {currentMoonPhaseType === 'waning-crescent' && (
                <p>Rest and restore. Prepare for the new cycle through reflection.</p>
              )}
            </div>
          </div>

          {!isWriting && (
            <button className="btn-primary new-entry-btn" onClick={() => setIsWriting(true)}>
              Write New Entry
            </button>
          )}
        </div>

        {isWriting && (
          <div className="journal-editor card">
            <h3>{editingId ? 'Edit Entry' : 'New Journal Entry'}</h3>

            <div className="prompt-section">
              <h4>Prompts for {moonPhase.phase}</h4>
              <ul className="prompts-list">
                {todayPrompts.map((prompt, i) => (
                  <li key={i}>{prompt}</li>
                ))}
              </ul>
            </div>

            <div className="editor-section">
              <label>Reflections</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, reflections, and insights..."
                rows={6}
              />
            </div>

            <div className="editor-section">
              <label>Intentions</label>
              {intentions.map((intention, i) => (
                <input
                  key={i}
                  type="text"
                  value={intention}
                  onChange={(e) => updateIntention(i, e.target.value)}
                  placeholder={`Intention ${i + 1}`}
                />
              ))}
              <button type="button" className="add-item-btn" onClick={addIntention}>
                + Add Intention
              </button>
            </div>

            <div className="editor-section">
              <label>Gratitude</label>
              {gratitude.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={(e) => updateGratitude(i, e.target.value)}
                  placeholder={`I am grateful for...`}
                />
              ))}
              <button type="button" className="add-item-btn" onClick={addGratitude}>
                + Add Gratitude
              </button>
            </div>

            <div className="editor-actions">
              <button className="btn-primary" onClick={handleSave}>
                Save Entry
              </button>
              <button onClick={resetForm}>Cancel</button>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="journal-entries">
            <h2>Your Journal</h2>
            <div className="entries-list">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card card">
                  <div className="entry-header">
                    <div className="entry-date">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="entry-moon">
                      {getMoonEmoji(entry.moonPhase)} {formatMoonPhase(entry.moonPhase)}
                    </div>
                  </div>

                  {entry.content && (
                    <div className="entry-content">
                      <p>{entry.content}</p>
                    </div>
                  )}

                  {entry.intentions.length > 0 && (
                    <div className="entry-section">
                      <h4>Intentions</h4>
                      <ul>
                        {entry.intentions.map((intention, i) => (
                          <li key={i}>{intention}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entry.gratitude.length > 0 && (
                    <div className="entry-section">
                      <h4>Gratitude</h4>
                      <ul>
                        {entry.gratitude.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="entry-actions">
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && !isWriting && (
          <div className="empty-state card">
            <span className="empty-icon">☾</span>
            <h3>Begin Your Journey</h3>
            <p>Start journaling your intentions and reflections aligned with the moon phases.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getMoonEmoji(phase: MoonPhaseType): string {
  const emojis: Record<MoonPhaseType, string> = {
    'new': '🌑',
    'waxing-crescent': '🌒',
    'first-quarter': '🌓',
    'waxing-gibbous': '🌔',
    'full': '🌕',
    'waning-gibbous': '🌖',
    'last-quarter': '🌗',
    'waning-crescent': '🌘',
  };
  return emojis[phase];
}

function formatMoonPhase(phase: MoonPhaseType): string {
  return phase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
