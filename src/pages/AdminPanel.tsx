import { useState, useEffect } from 'react';
import { 
  Lock, Shield, Save, LogOut, CheckCircle2, XCircle, 
  Layout, Eye, EyeOff, Users, BookOpen, Key
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getGlobalSettings, saveGlobalSettings, GlobalSettings } from '@/lib/store';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'permissions' | 'content' | 'settings'>('permissions');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Simple Hash for Admin
  const hash = (pwd: string) => btoa(pwd).split('').reverse().join('');

  useEffect(() => {
    const currentSettings = getGlobalSettings();
    setSettings(currentSettings);
  }, []);

  const handleLogin = () => {
    if (!settings) return;
    if (username === 'admins' && hash(password) === settings.adminPasswordHash) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  const handleSaveSettings = () => {
    if (!settings) return;
    saveGlobalSettings(settings);
    setSuccessMsg('تم حفظ الإعدادات بنجاح');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleChangeAdminPassword = () => {
    if (!settings || !newAdminPass) return;
    const updated = { ...settings, adminPasswordHash: hash(newAdminPass) };
    setSettings(updated);
    saveGlobalSettings(updated);
    setNewAdminPass('');
    setSuccessMsg('تم تغيير كلمة مرور الأدمن');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const togglePermission = (page: keyof GlobalSettings['pagePermissions'], role: 'visitor' | 'member' | 'golden') => {
    if (!settings) return;
    const current = settings.pagePermissions[page];
    const updated = current.includes(role) 
      ? current.filter(r => r !== role)
      : [...current, role];
    
    setSettings({
      ...settings,
      pagePermissions: {
        ...settings.pagePermissions,
        [page]: updated
      }
    });
  };

  const toggleContent = (type: keyof GlobalSettings['contentVisibility'], role: 'visitor' | 'member' | 'golden') => {
    if (!settings) return;
    const current = settings.contentVisibility[type];
    const updated = current.includes(role) 
      ? current.filter(r => r !== role)
      : [...current, role];
    
    setSettings({
      ...settings,
      contentVisibility: {
        ...settings.contentVisibility,
        [type]: updated
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f6] p-4" dir="rtl">
        <div className="w-full max-w-md bg-[#eef2f6] rounded-3xl shadow-3d p-8 border border-white/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-800 rounded-2xl mx-auto shadow-3d flex items-center justify-center mb-4 text-white">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-800">لوحة تحكم النظام</h1>
            <p className="text-gray-500 text-sm">منطقة الإدارة (Admins Only)</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white shadow-3d-inset border-none text-center"
                placeholder="Username"
              />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white shadow-3d-inset border-none text-center"
                placeholder="••••"
              />
            </div>
            
            {error && <p className="text-red-500 text-center text-sm font-bold">{error}</p>}

            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all"
            >
              دخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-[#eef2f6] pb-20" dir="rtl">
      <header className="bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gray-800" />
            <h1 className="text-xl font-black text-gray-800">لوحة التحكم</h1>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {successMsg && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50">
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`p-4 rounded-2xl shadow-3d font-bold transition-all flex flex-col items-center gap-2 ${activeTab === 'permissions' ? 'bg-blue-600 text-white' : 'bg-[#eef2f6] text-gray-600'}`}
          >
            <Layout className="w-6 h-6" /> صلاحيات الصفحات
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`p-4 rounded-2xl shadow-3d font-bold transition-all flex flex-col items-center gap-2 ${activeTab === 'content' ? 'bg-orange-600 text-white' : 'bg-[#eef2f6] text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6" /> المحتوى والميزات
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-4 rounded-2xl shadow-3d font-bold transition-all flex flex-col items-center gap-2 ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'bg-[#eef2f6] text-gray-600'}`}
          >
            <Key className="w-6 h-6" /> إعدادات الأدمن
          </button>
        </div>

        {activeTab === 'permissions' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#eef2f6] p-6 rounded-3xl shadow-3d border border-white/50">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-600" />
                التحكم في ظهور الصفحات
              </h2>
              
              <div className="space-y-4">
                {Object.keys(settings.pagePermissions).map((page) => (
                  <div key={page} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-bold text-gray-700 capitalize">{page}</span>
                    <div className="flex gap-2">
                      {['visitor', 'member', 'golden'].map((role) => (
                        <button
                          key={role}
                          // @ts-ignore
                          onClick={() => togglePermission(page, role)}
                          // @ts-ignore
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${settings.pagePermissions[page].includes(role) 
                            ? (role === 'golden' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : role === 'member' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300')
                            : 'bg-gray-50 text-gray-300 border border-transparent'}`}
                        >
                          {role === 'visitor' ? 'زائر' : role === 'member' ? 'عضو' : 'ذهبي'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveSettings} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> حفظ التغييرات
            </button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#eef2f6] p-6 rounded-3xl shadow-3d border border-white/50">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                إخفاء/إظهار المحتوى
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-bold text-gray-700">أرقام المعقبين المنجزين</span>
                    <div className="flex gap-2">
                      {['visitor', 'member', 'golden'].map((role) => (
                        <button
                          key={role}
                          // @ts-ignore
                          onClick={() => toggleContent('achieversNumbers', role)}
                          // @ts-ignore
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${settings.contentVisibility.achieversNumbers.includes(role) 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-50 text-gray-300'}`}
                        >
                          {role === 'visitor' ? 'زائر' : role === 'member' ? 'عضو' : 'ذهبي'}
                        </button>
                      ))}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-bold text-gray-700">الدروس التعليمية</span>
                    <div className="flex gap-2">
                      {['visitor', 'member', 'golden'].map((role) => (
                        <button
                          key={role}
                          // @ts-ignore
                          onClick={() => toggleContent('lessons', role)}
                          // @ts-ignore
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${settings.contentVisibility.lessons.includes(role) 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-50 text-gray-300'}`}
                        >
                          {role === 'visitor' ? 'زائر' : role === 'member' ? 'عضو' : 'ذهبي'}
                        </button>
                      ))}
                    </div>
                </div>
              </div>
            </div>
            <button onClick={handleSaveSettings} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> حفظ التغييرات
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#eef2f6] p-6 rounded-3xl shadow-3d border border-white/50">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-gray-800" />
                تغيير كلمة مرور الأدمن
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input 
                    type="password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="bg-white shadow-3d-inset border-none"
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                </div>
                <button onClick={handleChangeAdminPassword} className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold shadow-lg">
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
