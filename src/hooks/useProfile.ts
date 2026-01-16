import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

const STORAGE_KEY = 'celestial-oracle-profile';

const defaultProfile: UserProfile = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  latitude: 0,
  longitude: 0,
  timezone: '',
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } catch {
        setProfile(null);
      }
    }
    setLoading(false);
  }, []);

  const saveProfile = useCallback((newProfile: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  const hasProfile = profile !== null && profile.birthDate !== '';

  return {
    profile: profile || defaultProfile,
    hasProfile,
    loading,
    saveProfile,
    clearProfile,
  };
}

export async function geocodeLocation(place: string): Promise<{
  latitude: number;
  longitude: number;
  timezone: string;
  displayName: string;
} | null> {
  try {
    // Use OpenStreetMap Nominatim for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'AndreasCelestialOracle/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Geocoding response error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.error('No geocoding results for:', place);
      return null;
    }

    const { lat, lon, display_name } = data[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Try to get timezone, but don't fail if it doesn't work
    let timezone = 'UTC';
    try {
      const tzResponse = await fetch(
        `https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`
      );
      if (tzResponse.ok) {
        const tzData = await tzResponse.json();
        timezone = tzData.timeZone || 'UTC';
      }
    } catch (tzError) {
      console.warn('Timezone lookup failed, using UTC:', tzError);
    }

    return {
      latitude,
      longitude,
      timezone,
      displayName: display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
