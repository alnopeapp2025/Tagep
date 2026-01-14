import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { SoundManager } from './components/SoundManager';
import { Toaster } from "@/components/ui/toaster" // Assuming toaster exists or we skip it if not needed, but good practice.

function App() {
  return (
    &lt;Router&gt;
      &lt;div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl"&gt;
        &lt;SoundManager /&gt;
        &lt;Routes&gt;
          &lt;Route path="/" element={&lt;Dashboard /&gt;} /&gt;
          {/* Add other routes here as needed */}
        &lt;/Routes&gt;
      &lt;/div&gt;
    &lt;/Router&gt;
  );
}

export default App;
