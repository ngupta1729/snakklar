import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NorwegianCoach from './pages/NorwegianCoach';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<NorwegianCoach />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
