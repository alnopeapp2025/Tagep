import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { SoundManager } from './components/SoundManager';
import LoginPage from './pages/LoginPage';
import AgentsPage from './pages/AgentsPage';
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import ClientsPage from './pages/ClientsPage';
import ReportsPage from './pages/ReportsPage';
import AchieversHub from './pages/AchieversHub';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// مكون بسيط للصفحات التي لا تزال قيد التطوير
const PagePlaceholder = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center text-center" dir="rtl">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500 mb-8">هذه الصفحة قيد الصيانة أو الاستعادة حالياً.</p>
    <Link to="/">
      <Button className="gap-2">
        <ArrowRight className="h-4 w-4" />
        العودة للرئيسية
      </Button>
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
        <SoundManager />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* الصفحات الستة الرئيسية */}
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/achievers" element={<AchieversHub />} />
          <Route path="/agents" element={<AgentsPage />} />
          
          {/* صفحات أخرى */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/backup" element={<PagePlaceholder title="النسخ الاحتياطي" />} />
          <Route path="/subscription" element={<PagePlaceholder title="اشتراك ذهبي Pro" />} />
          <Route path="/system-data" element={<PagePlaceholder title="بيانات النظام" />} />
          <Route path="/privacy" element={<PagePlaceholder title="سياسة الخصوصية" />} />
          <Route path="/delete-account" element={<PagePlaceholder title="حذف بياناتي" />} />
          <Route path="/contact" element={<PagePlaceholder title="اتصل بنا" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
