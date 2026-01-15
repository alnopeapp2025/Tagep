import { 
  LogIn, 
  Users, 
  Search, 
  Database, 
  Crown, 
  Trash2, 
  Shield, 
  UserX, 
  Mail, 
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SystemSettings } from "@/components/SystemSettings";
import { NewsTicker } from "@/components/NewsTicker";
import { FooterTicker } from "@/components/FooterTicker";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold mb-4">القائمة الجانبية</h2>
                <SystemSettings mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">برنامج حسابات المعقبين</span>
          <Shield className="h-6 w-6 text-blue-900" />
        </div>
      </header>

      {/* الشريط المتحرك العلوي */}
      <NewsTicker />

      <main className="p-4 max-w-md mx-auto w-full flex-grow">
        {/* العنوان الرئيسي */}
        <div className="text-center my-6">
          <h1 className="text-3xl font-bold text-slate-900">القائمة الرئيسية</h1>
        </div>

        {/* شبكة القوائم */}
        <div className="grid gap-4 mb-6">
          
          {/* تسجيل دخول */}
          <Link to="/login">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">تسجيل دخول</span>
              <LogIn className="h-6 w-6 text-blue-600" />
            </Button>
          </Link>

          {/* دخول الموظفين */}
          <Link to="/agents">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm relative">
              <div className="flex items-center gap-2">
                <span className="text-lg">دخول الموظفين</span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">جديد</span>
              </div>
              <Users className="h-6 w-6 text-slate-600" />
            </Button>
          </Link>

          {/* استعلام عن معاملة */}
          <Link to="/transactions">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">استعلام عن معاملة</span>
              <Search className="h-6 w-6 text-purple-600" />
            </Button>
          </Link>

          {/* النسخ الاحتياطي */}
          <Link to="/backup">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">النسخ الاحتياطي</span>
              <Database className="h-6 w-6 text-orange-500" />
            </Button>
          </Link>

          {/* اشتراك ذهبي - أصفر */}
          <Link to="/subscription">
            <Button className="w-full h-16 justify-between bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-200 shadow-sm border">
              <span className="text-lg font-bold">اشتراك ذهبي Pro</span>
              <Crown className="h-6 w-6 text-yellow-600" />
            </Button>
          </Link>

          {/* بيانات النظام */}
          <Link to="/system-data">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">بيانات النظام</span>
              <Trash2 className="h-6 w-6 text-red-500" />
            </Button>
          </Link>

          {/* سياسة الخصوصية */}
          <Link to="/privacy">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">سياسة الخصوصية</span>
              <Shield className="h-6 w-6 text-green-600" />
            </Button>
          </Link>

          {/* حذف بياناتي */}
          <Link to="/delete-account">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">حذف بياناتي</span>
              <UserX className="h-6 w-6 text-slate-600" />
            </Button>
          </Link>

          {/* اتصل بنا */}
          <Link to="/contact">
            <Button variant="outline" className="w-full h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
              <span className="text-lg">اتصل بنا</span>
              <Mail className="h-6 w-6 text-blue-500" />
            </Button>
          </Link>
          
          <div className="text-center text-gray-400 text-sm mt-4">
            الإصدار 1.0.0 (Restored)
          </div>

        </div>
      </main>

      {/* الشريط الأصفر المتحرك السفلي */}
      <FooterTicker />
    </div>
  );
}
