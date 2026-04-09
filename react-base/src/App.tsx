import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NorwegianCoach from './pages/NorwegianCoach';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<NorwegianCoach />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
