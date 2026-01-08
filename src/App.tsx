import { 
  FileText, 
  Wallet, 
  BarChart3, 
  Users, 
  UserCheck, 
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { DashboardButton } from './components/DashboardButton';
import { Separator } from '@/components/ui/separator';

function App() {
  return (
    <div className="min-h-screen bg-[#eef2f6] p-4 sm:p-8" dir="rtl">
      
      {/* Header Section */}
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 text-shadow">
            برنامج حسابات المعقبين
          </h1>
          <p className="text-gray-500 font-medium">لوحة التحكم الرئيسية</p>
        </div>
        
        {/* Header Actions (Profile/Notifs) */}
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
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* المعاملات */}
          <DashboardButton 
            icon={FileText} 
            label="المعاملات" 
            onClick={() => console.log('Transactions clicked')}
          />

          {/* الحسابات */}
          <DashboardButton 
            icon={Wallet} 
            label="الحسابات" 
            onClick={() => console.log('Accounts clicked')}
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

          {/* Placeholder for future module or Quick Action */}
          <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400">
             <span className="text-sm">مساحة إضافية</span>
          </div>

        </div>

        <div className="my-12">
          <Separator className="bg-gray-300" />
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

      </main>
    </div>
  );
}

export default App;
