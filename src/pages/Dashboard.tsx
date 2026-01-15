import { 
  Menu,
  Wallet,
  FileText,
  Users,
  BarChart3,
  Medal,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SystemSettings } from "@/components/SystemSettings";
import { FooterTicker } from "@/components/FooterTicker";
import { Link } from "react-router-dom";
import { NewsTicker } from "@/components/NewsTicker";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col" dir="rtl">
      
      {/* الشريط الأصفر العلوي - مطابق للصورة */}
      <div className="bg-[#FCD34D] w-full py-4 px-6 text-right font-bold text-slate-900 text-lg shadow-sm">
        المعقب المحاسبي
      </div>

      <NewsTicker />

      <main className="p-6 max-w-md mx-auto w-full flex-grow flex flex-col">
        
        {/* زر القائمة والعنوان */}
        <div className="flex justify-between items-start mb-8 mt-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white rounded-full shadow-sm h-12 w-12 hover:bg-gray-100">
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold mb-4">القائمة الجانبية</h2>
                <SystemSettings mobile />
                <div className="border-t pt-4 mt-4">
                    <Link to="/login" className="block w-full">
                        <Button variant="outline" className="w-full justify-start">تسجيل الخروج</Button>
                    </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              برنامج حسابات<br />المعقبين
            </h1>
            <p className="text-red-500 text-sm font-medium mt-1">
              لوحة التحكم الرئيسية <span className="font-sans">v.1</span>
            </p>
          </div>
        </div>

        {/* شبكة الأيقونات الستة */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* 1. الحسابات */}
          <Link to="/accounts" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <Wallet className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">الحسابات</span>
            </div>
          </Link>

          {/* 2. المعاملات */}
          <Link to="/transactions" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <FileText className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">المعاملات</span>
            </div>
          </Link>

          {/* 3. العملاء */}
          <Link to="/clients" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <Users className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">العملاء</span>
            </div>
          </Link>

          {/* 4. التقارير */}
          <Link to="/reports" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <BarChart3 className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">التقارير</span>
            </div>
          </Link>

          {/* 5. المنجزين */}
          <Link to="/achievers" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <Medal className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">المنجزين</span>
            </div>
          </Link>

          {/* 6. المعقبين */}
          <Link to="/agents" className="block">
            <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow aspect-square">
              <div className="bg-gray-50 rounded-full p-4">
                <UserCheck className="h-8 w-8 text-slate-600" />
              </div>
              <span className="font-bold text-slate-800 text-lg">المعقبين</span>
            </div>
          </Link>

        </div>
      </main>

      {/* الشريط الأصفر المتحرك السفلي */}
      <FooterTicker />
    </div>
  );
}
