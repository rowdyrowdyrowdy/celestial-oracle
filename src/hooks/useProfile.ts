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
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
    );
    const data = await response.json();

    if (data.length === 0) return null;

    const { lat, lon, display_name } = data[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Get timezone from coordinates
    const tzResponse = await fetch(
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`
    );
    const tzData = await tzResponse.json();

    return {
      latitude,
      longitude,
      timezone: tzData.timeZone || 'UTC',
      displayName: display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
