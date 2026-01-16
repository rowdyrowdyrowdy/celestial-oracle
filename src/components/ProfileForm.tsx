import { useState, FormEvent } from 'react';
import { useProfile, geocodeLocation } from '../hooks/useProfile';
import { UserProfile } from '../types';
import './ProfileForm.css';

export function ProfileForm() {
  const { profile, hasProfile, saveProfile, clearProfile } = useProfile();
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleLocationBlur = async () => {
    if (!formData.birthPlace || formData.latitude !== 0) return;

    setIsGeolocating(true);
    const result = await geocodeLocation(formData.birthPlace);
    setIsGeolocating(false);

    if (result) {
      setFormData(prev => ({
        ...prev,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
        birthPlace: result.displayName,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.birthDate) {
      setError('Please enter your birth date');
      return;
    }

    if (!formData.birthPlace.trim()) {
      setError('Please enter your birth place');
      return;
    }

    // Geocode if not already done
    if (formData.latitude === 0 && formData.longitude === 0) {
      setIsGeolocating(true);
      const result = await geocodeLocation(formData.birthPlace);
      setIsGeolocating(false);

      if (!result) {
        setError('Could not find location. Please try a different format.');
        return;
      }

      const updatedProfile = {
        ...formData,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
        birthPlace: result.displayName,
      };
      saveProfile(updatedProfile);
      setFormData(updatedProfile);
    } else {
      saveProfile(formData);
    }

    setSuccess('Profile saved successfully!');
  };

  const handleClear = () => {
    clearProfile();
    setFormData({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      latitude: 0,
      longitude: 0,
      timezone: '',
    });
    setSuccess('');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cosmic Profile</h1>
          <p>
            Enter your birth details to unlock personalized astrological insights,
            numerology readings, and celestial guidance tailored to your unique cosmic blueprint.
          </p>
        </div>

        <div className="profile-content">
          <form className="profile-form card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full birth name"
              />
              <span className="form-hint">Used for numerology calculations</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthTime">Birth Time</label>
                <input
                  type="time"
                  id="birthTime"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                />
                <span className="form-hint">Optional but needed for rising sign</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="birthPlace">Birth Place</label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                onBlur={handleLocationBlur}
                placeholder="City, Country"
                disabled={isGeolocating}
              />
              {isGeolocating && (
                <span className="form-hint loading">Locating coordinates...</span>
              )}
              {formData.latitude !== 0 && (
                <span className="form-hint success">
                  Coordinates: {formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°
                  {formData.timezone && ` (${formData.timezone})`}
                </span>
              )}
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isGeolocating}>
                {hasProfile ? 'Update Profile' : 'Save Profile'}
              </button>
              {hasProfile && (
                <button type="button" onClick={handleClear}>
                  Clear Profile
                </button>
              )}
            </div>
          </form>

          <div className="profile-info">
            <div className="info-card card">
              <h3>Why Birth Details Matter</h3>
              <ul>
                <li>
                  <strong>Birth Date:</strong> Determines your Sun sign, Life Path number,
                  and the positions of all celestial bodies at your birth.
                </li>
                <li>
                  <strong>Birth Time:</strong> Essential for calculating your Rising sign
                  (Ascendant), house placements, and Moon sign accuracy.
                </li>
                <li>
                  <strong>Birth Place:</strong> Provides the geographic coordinates needed
                  for precise house calculations and local time conversion.
                </li>
                <li>
                  <strong>Full Name:</strong> Used in numerology to calculate your
                  Expression, Soul Urge, and Personality numbers.
                </li>
              </ul>
            </div>

            {hasProfile && (
              <div className="info-card card">
                <h3>Your Saved Profile</h3>
                <dl className="profile-summary">
                  <dt>Name</dt>
                  <dd>{profile.name}</dd>
                  <dt>Birth Date</dt>
                  <dd>{new Date(profile.birthDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</dd>
                  {profile.birthTime && (
                    <>
                      <dt>Birth Time</dt>
                      <dd>{profile.birthTime}</dd>
                    </>
                  )}
                  <dt>Birth Place</dt>
                  <dd>{profile.birthPlace}</dd>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
