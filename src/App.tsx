import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { SoundManager } from './components/SoundManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
        <SoundManager />
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
