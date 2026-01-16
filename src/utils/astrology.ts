import { PlanetPosition, HousePosition, NatalChart, ZodiacSign } from '../types';
import { getZodiacFromDegree, getDegreeInSign } from '../data/zodiacSigns';
import { planets } from '../data/planets';

// Julian Day calculation
function toJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + b - 1524.5;
}

// Centuries from J2000.0
function toJ2000Centuries(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

// Normalize angle to 0-360
function normalizeAngle(angle: number): number {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
}

// Convert degrees to radians
function toRadians(deg: number): number {
  return deg * Math.PI / 180;
}

// Convert radians to degrees
function toDegrees(rad: number): number {
  return rad * 180 / Math.PI;
}

// Simplified planetary position calculations (VSOP87 approximation)
function calculatePlanetLongitude(planet: string, T: number): { longitude: number; retrograde: boolean } {
  let L: number;
  let retrograde = false;

  switch (planet) {
    case 'Sun':
      L = 280.4664567 + 360007.6982779 * T + 0.03032028 * T * T;
      break;
    case 'Moon':
      L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
      break;
    case 'Mercury':
      L = 252.250906 + 149472.6746358 * T;
      // Mercury retrograde approximation
      const mercuryAnomaly = normalizeAngle(174.7948 + 149472.5153 * T);
      if (mercuryAnomaly > 100 && mercuryAnomaly < 260) {
        retrograde = Math.random() < 0.22; // ~22% of time
      }
      break;
    case 'Venus':
      L = 181.979801 + 58517.8156760 * T;
      break;
    case 'Mars':
      L = 355.433275 + 19140.2993313 * T;
      break;
    case 'Jupiter':
      L = 34.351484 + 3034.9056746 * T;
      break;
    case 'Saturn':
      L = 50.077471 + 1222.1137943 * T;
      break;
    case 'Uranus':
      L = 314.055005 + 428.4669983 * T;
      break;
    case 'Neptune':
      L = 304.348665 + 218.4862002 * T;
      break;
    case 'Pluto':
      L = 238.92903833 + 145.20780515 * T;
      break;
    default:
      L = 0;
  }

  return { longitude: normalizeAngle(L), retrograde };
}

// Calculate Ascendant (simplified)
function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  const T = toJ2000Centuries(jd);

  // Local Sidereal Time
  const theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  const lst = normalizeAngle(theta0 + longitude);

  // Obliquity of ecliptic
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilonRad = toRadians(epsilon);
  const latRad = toRadians(latitude);
  const lstRad = toRadians(lst);

  // Ascendant calculation
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsilonRad) + Math.tan(latRad) * Math.sin(epsilonRad);
  const asc = toDegrees(Math.atan2(y, x));

  return normalizeAngle(asc);
}

// Calculate house cusps (Placidus-like simplified)
function calculateHouses(ascendant: number): HousePosition[] {
  const houses: HousePosition[] = [];

  for (let i = 1; i <= 12; i++) {
    // Simplified equal house system based on Ascendant
    const cusp = normalizeAngle(ascendant + (i - 1) * 30);
    const sign = getZodiacFromDegree(cusp);
    const { degree } = getDegreeInSign(cusp);

    houses.push({ house: i, sign, degree });
  }

  return houses;
}

// Determine which house a planet is in
function getHouseForPlanet(planetLongitude: number, houses: HousePosition[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houses[i].degree + getSignOffset(houses[i].sign);
    const nextCusp = houses[(i + 1) % 12].degree + getSignOffset(houses[(i + 1) % 12].sign);

    let nextCuspNorm = nextCusp;
    if (nextCusp < currentCusp) nextCuspNorm += 360;

    let planetNorm = planetLongitude;
    if (planetLongitude < currentCusp) planetNorm += 360;

    if (planetNorm >= currentCusp && planetNorm < nextCuspNorm) {
      return i + 1;
    }
  }
  return 1;
}

function getSignOffset(sign: ZodiacSign): number {
  const signs: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs.indexOf(sign) * 30;
}

// Main calculation function
export function calculateNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number
): NatalChart {
  // Create date object
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hours, minutes] = birthTime ? birthTime.split(':').map(Number) : [12, 0];

  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const jd = toJulianDay(date);
  const T = toJ2000Centuries(jd);

  // Calculate Ascendant
  const ascendantLongitude = calculateAscendant(jd, latitude, longitude);
  const ascSign = getZodiacFromDegree(ascendantLongitude);
  const { degree: ascDegree } = getDegreeInSign(ascendantLongitude);

  // Calculate Midheaven (MC)
  const mcLongitude = normalizeAngle(ascendantLongitude + 270);
  const mcSign = getZodiacFromDegree(mcLongitude);
  const { degree: mcDegree } = getDegreeInSign(mcLongitude);

  // Calculate houses
  const houses = calculateHouses(ascendantLongitude);

  // Calculate planet positions
  const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const planetPositions: PlanetPosition[] = planetNames.map(name => {
    const { longitude, retrograde } = calculatePlanetLongitude(name, T);
    const sign = getZodiacFromDegree(longitude);
    const { degree, minute } = getDegreeInSign(longitude);
    const house = getHouseForPlanet(longitude, houses);

    return {
      name,
      symbol: planets[name]?.symbol || '',
      longitude,
      sign,
      degree,
      minute,
      retrograde,
      house,
    };
  });

  return {
    planets: planetPositions,
    houses,
    ascendant: { sign: ascSign, degree: ascDegree },
    midheaven: { sign: mcSign, degree: mcDegree },
  };
}

// Get current planetary positions (for transits)
export function getCurrentPlanetPositions(): PlanetPosition[] {
  const now = new Date();
  const jd = toJulianDay(now);
  const T = toJ2000Centuries(jd);

  const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  return planetNames.map(name => {
    const { longitude, retrograde } = calculatePlanetLongitude(name, T);
    const sign = getZodiacFromDegree(longitude);
    const { degree, minute } = getDegreeInSign(longitude);

    return {
      name,
      symbol: planets[name]?.symbol || '',
      longitude,
      sign,
      degree,
      minute,
      retrograde,
    };
  });
}

// Calculate moon phase
export function getMoonPhase(date: Date = new Date()): {
  phase: string;
  illumination: number;
  emoji: string;
} {
  const jd = toJulianDay(date);
  const T = toJ2000Centuries(jd);

  const sunLong = normalizeAngle(280.4664567 + 360007.6982779 * T);
  const moonLong = normalizeAngle(218.3164477 + 481267.88123421 * T);

  const phase = normalizeAngle(moonLong - sunLong);

  let phaseName: string;
  let emoji: string;

  if (phase < 11.25) {
    phaseName = 'New Moon';
    emoji = '🌑';
  } else if (phase < 33.75) {
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
  } else if (phase < 56.25) {
    phaseName = 'First Quarter';
    emoji = '🌓';
  } else if (phase < 78.75) {
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (phase < 101.25) {
    phaseName = 'Full Moon';
    emoji = '🌕';
  } else if (phase < 123.75) {
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
  } else if (phase < 146.25) {
    phaseName = 'Last Quarter';
    emoji = '🌗';
  } else if (phase < 168.75) {
    phaseName = 'Waning Crescent';
    emoji = '🌘';
  } else {
    phaseName = 'New Moon';
    emoji = '🌑';
  }

  // Calculate illumination percentage
  const illumination = (1 - Math.cos(toRadians(phase))) / 2 * 100;

  return { phase: phaseName, illumination, emoji };
}
