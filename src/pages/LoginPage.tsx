import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Lock, LogIn, UserPlus, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const [officeName, setOfficeName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simple mock login
    if (officeName && phone && password) {
      navigate('/');
    } else {
      alert('يرجى ملء جميع الحقول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#eef2f6] rounded-3xl shadow-3d p-8 border border-white/50">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto shadow-3d flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-all duration-500">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 text-shadow">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">نظام المعقب المحاسبي</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold text-gray-600">اسم المكتب</Label>
            <div className="relative">
              <Input 
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                className="bg-[#eef2f6] shadow-3d-inset border-none pl-10 h-12"
                placeholder="أدخل اسم المكتب"
              />
              <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-600">رقم الهاتف</Label>
            <div className="relative">
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#eef2f6] shadow-3d-inset border-none pl-10 h-12"
                placeholder="05xxxxxxxx"
              />
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-600">كلمة المرور</Label>
            <div className="relative">
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#eef2f6] shadow-3d-inset border-none pl-10 h-12"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-2 mt-6"
          >
            <LogIn className="w-5 h-5" />
            دخول
          </button>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button 
              onClick={() => navigate('/register')}
              className="py-3 bg-[#eef2f6] text-gray-600 rounded-xl font-bold text-xs shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              عضوية جديدة
            </button>
            <button className="py-3 bg-[#eef2f6] text-gray-600 rounded-xl font-bold text-xs shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4" />
              نسيت الاسم؟
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
