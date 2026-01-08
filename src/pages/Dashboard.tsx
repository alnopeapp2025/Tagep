import { useEffect, useState } from 'react';
import { 
  FileText, 
  Wallet, 
  BarChart3, 
  Users, 
  UserCheck, 
  Settings,
  Bell,
  LogOut,
  Trophy,
  Menu,
  Award,
  LogIn,
  Receipt,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardButton } from '@/components/DashboardButton';
import { Separator } from '@/components/ui/separator';
import { getStoredTransactions, calculateAchievers } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Dashboard() {
  const navigate = useNavigate();
  const [achievers, setAchievers] = useState<{name: string, count: number, total: number}[]>([]);

  useEffect(() => {
    const txs = getStoredTransactions();
    setAchievers(calculateAchievers(txs));
  }, []);

  const scrollToAchievers = () => {
    const element = document.getElementById('achievers-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-10">
      
      {/* Marquee Banner */}
      <div className="w-full bg-yellow-400 text-yellow-900 py-2 mb-6 overflow-hidden shadow-sm border-b border-yellow-500/20">
        <div className="marquee-container">
          <div className="marquee-content font-bold text-sm sm:text-base">
            مرحباً بكم في نظام المعقب المحاسبي
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-800 mb-1 text-shadow">
              برنامج حسابات المعقبين
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base">لوحة التحكم الرئيسية</p>
          </div>
          
          <div className="flex gap-3">
            {/* Hamburger Menu (Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#eef2f6] w-[300px] sm:w-[400px]" dir="rtl">
                <SheetHeader className="mb-6 text-right">
                  <SheetTitle className="text-2xl font-black text-gray-800">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-4">
                  <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                    <LogIn className="w-5 h-5 text-blue-600" />
                    تسجيل دخول
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                    <Settings className="w-5 h-5 text-gray-600" />
                    إعدادات النظام
                  </button>
                </div>

                <div className="absolute bottom-8 left-0 w-full px-6">
                   <div className="text-center text-xs text-gray-400">
                      الإصدار 1.0.0
                   </div>
                </div>
              </SheetContent>
            </Sheet>

            <button className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all hidden sm:block">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-8">
          
          {/* المعاملات */}
          <DashboardButton 
            icon={FileText} 
            label="المعاملات" 
            onClick={() => navigate('/transactions')}
          />

          {/* الحسابات */}
          <DashboardButton 
            icon={Wallet} 
            label="الحسابات" 
            onClick={() => navigate('/accounts')}
          />

          {/* التقارير */}
          <DashboardButton 
            icon={BarChart3} 
            label="التقارير" 
            onClick={() => navigate('/reports')}
          />

          {/* العملاء */}
          <DashboardButton 
            icon={Users} 
            label="العملاء" 
            onClick={() => navigate('/clients')}
          />

          {/* المعقبين */}
          <DashboardButton 
            icon={UserCheck} 
            label="المعقبين" 
            onClick={() => navigate('/agents')}
          />

          {/* المنجزين */}
          <DashboardButton 
            icon={Award} 
            label="المنجزين" 
            variant="primary"
            onClick={scrollToAchievers}
          />

          {/* المنصرفات (NEW) */}
          <DashboardButton 
            icon={Receipt} 
            label="المنصرفات" 
            variant="danger"
            onClick={() => navigate('/expenses')}
          />

          {/* الآلة الحاسبة (NEW) */}
          <DashboardButton 
            icon={Calculator} 
            label="الآلة الحاسبة" 
            onClick={() => navigate('/calculator')}
          />

        </div>

        <div className="my-10">
          <Separator className="bg-gray-300" />
        </div>

        {/* Achievers Section */}
        <div id="achievers-section" className="mb-12 scroll-mt-10">
          <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              قائمة أفضل المنجزين
          </h3>
          
          {achievers.length === 0 ? (
              <div className="text-center p-8 bg-[#eef2f6] rounded-2xl shadow-3d-inset text-gray-500">
                  لا توجد بيانات كافية لعرض المنجزين حتى الآن.
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {achievers.slice(0, 3).map((achiever, index) => (
                      <div key={achiever.name} className="relative bg-[#eef2f6] shadow-3d rounded-2xl p-4 flex items-center gap-4 border border-white/50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                              index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                          }`}>
                              {index + 1}
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-800">{achiever.name}</h4>
                              <p className="text-xs text-gray-500">أنجز {achiever.count} معاملة</p>
                          </div>
                          <div className="mr-auto font-bold text-blue-600 text-sm">
                              {achiever.total.toLocaleString()} ر.س
                          </div>
                      </div>
                  ))}
              </div>
          )}
        </div>

        {/* Footer / Stats Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#eef2f6] shadow-3d">
                <h3 className="text-lg font-bold text-gray-700 mb-4">ملخص سريع</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl shadow-3d-inset bg-[#eef2f6]">
                        <span className="text-gray-600">المعاملات النشطة</span>
                        <span className="font-bold text-blue-600">24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl shadow-3d-inset bg-[#eef2f6]">
                        <span className="text-gray-600">رصيد الصندوق</span>
                        <span className="font-bold text-green-600">15,400 ر.س</span>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#eef2f6] shadow-3d flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 mb-4">هل تحتاج إلى مساعدة؟</p>
                <button className="px-8 py-3 rounded-xl bg-[#eef2f6] text-red-500 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
