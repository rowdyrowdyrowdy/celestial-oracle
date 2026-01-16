import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { StarfieldBackground } from './components/StarfieldBackground';
import { Home } from './components/Home';
import { ProfileForm } from './components/ProfileForm';
import { BirthChart } from './components/BirthChart';
import { Numerology } from './components/Numerology';
import { Transits } from './components/Transits';
import { DailyGuidance } from './components/DailyGuidance';
import { Tarot } from './components/Tarot';
import { Journal } from './components/Journal';

function App() {
  return (
    <>
      <StarfieldBackground />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/numerology" element={<Numerology />} />
          <Route path="/transits" element={<Transits />} />
          <Route path="/daily" element={<DailyGuidance />} />
          <Route path="/tarot" element={<Tarot />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
