import { NavLink } from 'react-router-dom';
import './Navigation.css';

const navItems = [
  { path: '/', label: 'Home', icon: '✧' },
  { path: '/profile', label: 'Profile', icon: '☽' },
  { path: '/birth-chart', label: 'Birth Chart', icon: '☉' },
  { path: '/numerology', label: 'Numerology', icon: '⟡' },
  { path: '/transits', label: 'Transits', icon: '☿' },
  { path: '/daily', label: 'Daily', icon: '★' },
  { path: '/tarot', label: 'Tarot', icon: '⚝' },
  { path: '/journal', label: 'Journal', icon: '☾' },
];

export function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <span className="nav-logo-icon">☽</span>
          <span className="nav-logo-text">Celestial Oracle</span>
        </NavLink>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="nav-mobile-toggle" aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </nav>
  );
}
