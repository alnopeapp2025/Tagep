import { useEffect, useState } from 'react';
import { 
  FileText, Wallet, BarChart3, Users, UserCheck, Settings, Bell, LogOut, 
  Trophy, Menu, Award, LogIn, Receipt, Calculator, Activity, Clock, CheckCircle2,
  Search, Database, Trash2, Shield, AlertTriangle, Download, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardButton } from '@/components/DashboardButton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getStoredTransactions, 
  calculateAchievers, 
  createBackup, 
  restoreBackup, 
  clearAgents, 
  clearClients, 
  clearTransactions, 
  clearAllData,
  Transaction 
} from '@/lib/store';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [achievers, setAchievers] = useState<{name: string, count: number, total: number}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerStats, setTickerStats] = useState({ active: 0, inProgress: 0, completedWeek: 0 });

  // Inquiry State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [foundTx, setFoundTx] = useState<Transaction | null>(null);

  // Backup State
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreText, setRestoreText] = useState('');

  // Delete States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  useEffect(() => {
    const txs = getStoredTransactions();
    setTransactions(txs);
    setAchievers(calculateAchievers(txs));

    // Calculate Ticker Stats
    const now = Date.now();
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const active = txs.filter(t => t.status === 'active').length;
    const inProgress = txs.filter(t => t.status === 'active' && t.targetDate > now).length;
    const completedWeek = txs.filter(t => t.status === 'completed' && t.createdAt >= startOfWeek.getTime()).length;

    setTickerStats({ active, inProgress, completedWeek });

    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToAchievers = () => {
    const element = document.getElementById('achievers-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquiry = () => {
    const tx = transactions.find(t => t.serialNo === inquiryId);
    setFoundTx(tx || null);
    if (!tx) alert('لم يتم العثور على معاملة بهذا الرقم');
  };

  const handleCreateBackup = () => {
    const data = createBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_moaqeb_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRestoreBackup = () => {
    if (!restoreText) return;
    const success = restoreBackup(restoreText);
    if (success) {
      alert('تم استعادة النسخة الاحتياطية بنجاح! سيتم إعادة تحميل الصفحة.');
      window.location.reload();
    } else {
      alert('فشل استعادة النسخة. تأكد من صحة الكود.');
    }
  };

  const tickerItems = [
    { label: "المعاملات النشطة", value: tickerStats.active, icon: Activity, color: "text-blue-600" },
    { label: "تحت الإنجاز", value: tickerStats.inProgress, icon: Clock, color: "text-orange-600" },
    { label: "إنجاز هذا الأسبوع", value: tickerStats.completedWeek, icon: CheckCircle2, color: "text-green-600" }
  ];

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
              <SheetContent side="right" className="bg-[#eef2f6] w-[300px] sm:w-[400px] overflow-y-auto" dir="rtl">
                <SheetHeader className="mb-6 text-right">
                  <SheetTitle className="text-2xl font-black text-gray-800">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/login')} className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                    <LogIn className="w-5 h-5 text-blue-600" />
                    تسجيل دخول
                  </button>
                  
                  <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                        <Search className="w-5 h-5 text-purple-600" />
                        استعلام عن معاملة
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#eef2f6] border-none shadow-3d" dir="rtl">
                      <DialogHeader><DialogTitle>الاستعلام عن معاملة</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="رقم المعاملة (مثلاً 0001)" 
                            value={inquiryId}
                            onChange={(e) => setInquiryId(e.target.value)}
                            className="bg-white shadow-3d-inset border-none"
                          />
                          <button onClick={handleInquiry} className="bg-purple-600 text-white px-4 rounded-xl font-bold shadow-lg">بحث</button>
                        </div>
                        {foundTx && (
                          <div className="bg-white/50 p-4 rounded-xl border border-white space-y-2 animate-in fade-in">
                            <p><span className="font-bold">النوع:</span> {foundTx.type}</p>
                            <p><span className="font-bold">العميل:</span> {foundTx.clientName}</p>
                            <p><span className="font-bold">السعر:</span> <span className="text-blue-600">{foundTx.clientPrice} ر.س</span></p>
                            <p><span className="font-bold">الحالة:</span> {foundTx.status === 'active' ? 'نشطة' : foundTx.status === 'completed' ? 'مكتملة' : 'ملغاة'}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={backupOpen} onOpenChange={setBackupOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                        <Database className="w-5 h-5 text-orange-600" />
                        النسخ الاحتياطي
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#eef2f6] border-none shadow-3d" dir="rtl">
                      <DialogHeader><DialogTitle>النسخ الاحتياطي والاستعادة</DialogTitle></DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label>إنشاء نسخة احتياطية</Label>
                          <button onClick={handleCreateBackup} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> تحميل ملف النسخة
                          </button>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label>استعادة نسخة (لصق الكود)</Label>
                          <textarea 
                            className="w-full h-24 rounded-xl bg-white shadow-3d-inset border-none p-3 text-xs"
                            placeholder="الصق كود النسخة الاحتياطية هنا..."
                            value={restoreText}
                            onChange={(e) => setRestoreText(e.target.value)}
                          />
                          <button onClick={handleRestoreBackup} className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" /> استعادة البيانات
                          </button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        بيانات النظام
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#eef2f6] border-none shadow-3d" dir="rtl">
                      <DialogHeader><DialogTitle>إدارة وحذف البيانات</DialogTitle></DialogHeader>
                      <div className="space-y-3 py-4">
                        <button onClick={() => { if(confirm('هل أنت متأكد من حذف جميع المعقبين؟')) { clearAgents(); alert('تم الحذف'); window.location.reload(); } }} className="w-full py-3 bg-white text-red-600 rounded-xl font-bold shadow-3d hover:bg-red-50 text-right px-4">حذف المعقبين</button>
                        <button onClick={() => { if(confirm('هل أنت متأكد من حذف جميع العملاء؟')) { clearClients(); alert('تم الحذف'); window.location.reload(); } }} className="w-full py-3 bg-white text-red-600 rounded-xl font-bold shadow-3d hover:bg-red-50 text-right px-4">حذف العملاء</button>
                        <button onClick={() => { if(confirm('هل أنت متأكد من حذف جميع المعاملات؟')) { clearTransactions(); alert('تم الحذف'); window.location.reload(); } }} className="w-full py-3 bg-white text-red-600 rounded-xl font-bold shadow-3d hover:bg-red-50 text-right px-4">حذف المعاملات</button>
                        
                        <div className="pt-4">
                          <button onClick={() => setDeleteAllConfirm(true)} className="w-full py-4 bg-red-600 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 animate-pulse">
                            <AlertTriangle className="w-5 h-5" />
                            حذف الكل (تهيئة النظام)
                          </button>
                        </div>

                        {deleteAllConfirm && (
                          <div className="bg-red-100 border-2 border-red-500 p-4 rounded-xl mt-4 text-center animate-in zoom-in">
                            <p className="text-red-800 font-bold mb-3">تحذير شديد اللهجة: سيتم حذف جميع البيانات نهائياً ولا يمكن استعادتها!</p>
                            <div className="flex gap-2">
                              <button onClick={() => { clearAllData(); window.location.reload(); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">نعم، احذف كل شيء</button>
                              <button onClick={() => setDeleteAllConfirm(false)} className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold">إلغاء</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <button className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                    <Shield className="w-5 h-5 text-green-600" />
                    سياسة الخصوصية
                  </button>

                  <button onClick={() => { if(confirm('سيتم حذف بياناتك الشخصية من المتصفح.')) { clearAllData(); window.location.reload(); }}} className="flex items-center gap-3 p-4 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-gray-700 font-bold">
                    <UserCheck className="w-5 h-5 text-gray-600" />
                    حذف بياناتي
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

          {/* المنصرفات */}
          <DashboardButton 
            icon={Receipt} 
            label="المنصرفات" 
            variant="danger"
            onClick={() => navigate('/expenses')}
          />

          {/* الحاسبة */}
          <DashboardButton 
            icon={Calculator} 
            label="الحاسبة" 
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
            <div className="p-6 rounded-2xl bg-[#eef2f6] shadow-3d relative overflow-hidden">
                <h3 className="text-lg font-bold text-gray-700 mb-4">ملخص سريع</h3>
                
                {/* Ticker Container */}
                <div className="relative h-16 w-full">
                  {tickerItems.map((item, idx) => {
                    const isActive = idx === tickerIndex;
                    return (
                      <div 
                        key={idx}
                        className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out transform ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                      >
                        <div className="flex justify-between items-center p-3 rounded-xl shadow-3d-inset bg-[#eef2f6]">
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                              <span className="text-gray-600 font-bold">{item.label}</span>
                            </div>
                            <span className={`font-black text-xl ${item.color}`}>{item.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#eef2f6] shadow-3d flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 mb-4">هل تحتاج إلى مساعدة؟</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 rounded-xl bg-[#eef2f6] text-red-500 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
