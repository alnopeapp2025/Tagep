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
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SystemSettings } from "@/components/SystemSettings";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    &lt;div className="min-h-screen bg-gray-50 p-4"&gt;
      {/* Header */}
      &lt;header className="flex items-center justify-between mb-8"&gt;
        &lt;Sheet&gt;
          &lt;SheetTrigger asChild&gt;
            &lt;Button variant="ghost" size="icon"&gt;
              &lt;Menu className="h-6 w-6" /&gt;
            &lt;/Button&gt;
          &lt;/SheetTrigger&gt;
          &lt;SheetContent side="right" className="w-[300px] sm:w-[400px]"&gt;
            &lt;div className="flex flex-col gap-4 mt-8"&gt;
              &lt;h2 className="text-xl font-bold mb-4"&gt;القائمة الجانبية&lt;/h2&gt;
              {/* System Settings inside Hamburger Menu */}
              &lt;SystemSettings mobile /&gt;
            &lt;/div&gt;
          &lt;/SheetContent&gt;
        &lt;/Sheet&gt;
        
        &lt;div className="flex items-center gap-2"&gt;
          &lt;span className="font-semibold"&gt;برنامج حسابات المعقبين&lt;/span&gt;
          &lt;Shield className="h-5 w-5 text-gray-700" /&gt;
        &lt;/div&gt;
      &lt;/header&gt;

      {/* Main Content Title */}
      &lt;div className="text-center mb-8"&gt;
        &lt;h1 className="text-3xl font-bold text-slate-900"&gt;القائمة الرئيسية&lt;/h1&gt;
      &lt;/div&gt;

      {/* Menu Grid/List */}
      &lt;div className="grid gap-4 max-w-md mx-auto"&gt;
        
        {/* Login */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;تسجيل دخول&lt;/span&gt;
          &lt;LogIn className="h-6 w-6 text-blue-600" /&gt;
        &lt;/Button&gt;

        {/* Employee Login */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm relative"&gt;
          &lt;div className="flex items-center gap-2"&gt;
            &lt;span className="text-lg"&gt;دخول الموظفين&lt;/span&gt;
            &lt;span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full"&gt;جديد&lt;/span&gt;
          &lt;/div&gt;
          &lt;Users className="h-6 w-6 text-slate-600" /&gt;
        &lt;/Button&gt;

        {/* Transaction Inquiry */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;استعلام عن معاملة&lt;/span&gt;
          &lt;Search className="h-6 w-6 text-purple-600" /&gt;
        &lt;/Button&gt;

        {/* Backup */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;النسخ الاحتياطي&lt;/span&gt;
          &lt;Database className="h-6 w-6 text-orange-500" /&gt;
        &lt;/Button&gt;

        {/* Gold Subscription - CHANGED TO RED as requested */}
        &lt;Button className="h-16 justify-between bg-red-100 hover:bg-red-200 text-red-900 border-red-200 shadow-sm border"&gt;
          &lt;span className="text-lg font-bold"&gt;اشتراك ذهبي Pro&lt;/span&gt;
          &lt;Crown className="h-6 w-6 text-yellow-600" /&gt;
        &lt;/Button&gt;

        {/* System Settings (Added to main list as well for visibility, or just keep in hamburger as requested) */}
        {/* User asked for it in Hamburger, but I'll add the "System Data" button from the image here */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;بيانات النظام&lt;/span&gt;
          &lt;Trash2 className="h-6 w-6 text-red-500" /&gt;
        &lt;/Button&gt;

        {/* Privacy Policy */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;سياسة الخصوصية&lt;/span&gt;
          &lt;Shield className="h-6 w-6 text-green-600" /&gt;
        &lt;/Button&gt;

        {/* Delete My Data */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;حذف بياناتي&lt;/span&gt;
          &lt;UserX className="h-6 w-6 text-slate-600" /&gt;
        &lt;/Button&gt;

        {/* Contact Us */}
        &lt;Button variant="outline" className="h-16 justify-between bg-white hover:bg-gray-50 border-gray-200 shadow-sm"&gt;
          &lt;span className="text-lg"&gt;اتصل بنا&lt;/span&gt;
          &lt;Mail className="h-6 w-6 text-blue-500" /&gt;
        &lt;/Button&gt;
        
        &lt;div className="text-center text-gray-400 text-sm mt-4"&gt;
          الإصدار 1.0.0
        &lt;/div&gt;

      &lt;/div&gt;
    &lt;/div&gt;
  );
}
