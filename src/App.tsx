import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  // استخدام import.meta.env.BASE_URL يجعل الراوتر يتكيف تلقائياً مع إعدادات vite.config.ts
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-[#eef2f6] p-4 sm:p-8" dir="rtl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
