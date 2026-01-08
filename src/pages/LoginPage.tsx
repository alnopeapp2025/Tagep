import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, LogIn, UserPlus, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const securityQuestions = [
  "اين ولدت والدتك؟",
  "ماهو اقرب صديق لك؟",
  "متي تزوجت؟",
  "ماهي الهواية المفضله؟",
  "مدينة في السعوديه اقرب لقلبك؟",
  "ما وجبتك المفضلة؟"
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Refs for auto-focus
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Forgot Password State
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleLogin = () => {
    setError('');
    
    if (!phone) {
        setError('يرجى ملء جميع الحقول');
        phoneRef.current?.focus();
        return;
    }

    if (!password) {
        setError('يرجى ملء جميع الحقول');
        passwordRef.current?.focus();
        return;
    }

    // Mock Login Success
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#eef2f6] rounded-3xl shadow-3d p-8 border border-white/50">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto shadow-3d flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-all duration-500">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 text-shadow">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">نظام المعقب المحاسبي</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-in slide-in-from-top-2 shadow-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold text-gray-600">رقم الهاتف</Label>
            <div className="relative">
              <Input 
                ref={phoneRef}
                value={phone}
                onChange={(e) => {
                    setPhone(e.target.value);
                    if(error) setError('');
                }}
                className={`bg-[#eef2f6] shadow-3d-inset border-none pl-10 h-12 ${error && !phone ? 'ring-2 ring-red-400' : ''}`}
                placeholder="05xxxxxxxx"
              />
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-600">كلمة المرور</Label>
            <div className="relative">
              <Input 
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if(error) setError('');
                }}
                className={`bg-[#eef2f6] shadow-3d-inset border-none pl-10 h-12 ${error && !password ? 'ring-2 ring-red-400' : ''}`}
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
            
            <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                <DialogTrigger asChild>
                    <button className="py-3 bg-[#eef2f6] text-gray-600 rounded-xl font-bold text-xs shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-1">
                        <HelpCircle className="w-4 h-4" />
                        نسيت كلمة المرور؟
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-[#eef2f6] shadow-3d border-none" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-center font-bold text-gray-800">استعادة كلمة المرور</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>رقم الهاتف</Label>
                            <Input className="bg-white shadow-3d-inset border-none" placeholder="05xxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                            <Label>سؤال الأمان</Label>
                            <Select>
                                <SelectTrigger className="bg-white shadow-3d-inset border-none h-10 text-right flex-row-reverse">
                                    <SelectValue placeholder="اختر السؤال..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                                    {securityQuestions.map((q) => (
                                    <SelectItem key={q} value={q} className="text-right cursor-pointer my-1">{q}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>الإجابة</Label>
                            <Input className="bg-white shadow-3d-inset border-none" placeholder="إجابتك..." />
                        </div>
                        <button onClick={() => { alert('تم إرسال كلمة المرور المؤقتة'); setForgotOpen(false); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            إستعادة
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
