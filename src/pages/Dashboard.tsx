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
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardButton } from '@/components/DashboardButton';
import { Separator } from '@/components/ui/separator';
import { getStoredTransactions, calculateAchievers } from '@/lib/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const [achievers, setAchievers] = useState<{name: string, count: number, total: number}[]>([]);

  useEffect(() => {
    const txs = getStoredTransactions();
    setAchievers(calculateAchievers(txs));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 text-shadow">
            برنامج حسابات المعقبين
          </h1>
          <p className="text-gray-500 font-medium">لوحة التحكم الرئيسية</p>
        </div>
        
        <div className="flex gap-4">
          <button className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all hidden sm:block">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
        
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
          onClick={() => console.log('Reports clicked')}
        />

        {/* العملاء */}
        <DashboardButton 
          icon={Users} 
          label="العملاء" 
          onClick={() => console.log('Clients clicked')}
        />

        {/* المعقبين */}
        <DashboardButton 
          icon={UserCheck} 
          label="المعقبين" 
          onClick={() => console.log('Agents clicked')}
        />

        {/* Placeholder */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400">
           <span className="text-sm">مساحة إضافية</span>
        </div>

      </div>

      <div className="my-12">
        <Separator className="bg-gray-300" />
      </div>

      {/* Achievers Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            أفضل المنجزين
        </h3>
        
        {achievers.length === 0 ? (
            <div className="text-center p-8 bg-[#eef2f6] rounded-2xl shadow-3d-inset text-gray-500">
                لا توجد بيانات كافية لعرض المنجزين حتى الآن.
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {achievers.slice(0, 3).map((achiever, index) => (
                    <div key={achiever.name} className="relative bg-[#eef2f6] shadow-3d rounded-2xl p-4 flex items-center gap-4 border border-white/50">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg",
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                        )}>
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
  );
}
