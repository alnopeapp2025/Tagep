import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Clock, CheckCircle, XCircle, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Card, CardContent } from '@/components/ui/card';

// --- Types ---
interface Transaction {
  id: number;
  serialNo: string;
  type: string;
  clientPrice: string;
  agentPrice: string;
  agent: string;
  duration: string;
  paymentMethod: string;
  createdAt: number;
  targetDate: number;
  status: 'active' | 'completed' | 'cancelled';
}

// --- Constants ---
const transactionTypesList = [
  "تجديد إقامة", "نقل كفالة", "خروج وعودة", "خروج نهائي", "تأشيرة زيارة", "تأمين طبي", "إصدار رخصة"
];

const agentsList = [
  "إنجاز بنفسي", "أحمد محمد", "مكتب الإنجاز السريع", "خالد عبدالله", "سعيد الشهراني"
];

const banksList = [
  "الراجحي", "الأهلي", "الإنماء", "البلاد", "بنك stc", "الرياض", "الجزيرة", "ساب", "نقداً كاش", "بنك آخر"
];

// --- Helper Component: Countdown Timer ---
const CountdownTimer = ({ targetDate, status }: { targetDate: number, status: string }) => {
  const [timeLeft, setTimeLeft] = useState("جاري الحساب...");

  useEffect(() => {
    if (status !== 'active') return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft("انتهت المدة");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}ي : ${hours}س : ${minutes}د`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, status]);

  if (status === 'completed') return <span className="text-green-600 font-bold">مكتملة</span>;
  if (status === 'cancelled') return <span className="text-red-600 font-bold">ملغاة</span>;

  return <span className="font-mono font-bold text-blue-600" dir="ltr">{timeLeft}</span>;
};

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    manualType: '',
    selectedType: '',
    agentPrice: '',
    clientPrice: '',
    agent: '',
    duration: '',
    paymentMethod: ''
  });

  const handleSave = () => {
    if (!formData.clientPrice || !formData.duration) return; // Basic validation

    const finalType = formData.manualType || formData.selectedType || "غير محدد";
    const durationDays = parseInt(formData.duration) || 0;
    
    const newTx: Transaction = {
      id: Date.now(),
      serialNo: String(transactions.length + 1).padStart(4, '0'),
      type: finalType,
      clientPrice: formData.clientPrice,
      agentPrice: formData.agentPrice,
      agent: formData.agent || "إنجاز بنفسي",
      duration: formData.duration,
      paymentMethod: formData.paymentMethod || "نقداً كاش",
      createdAt: Date.now(),
      targetDate: Date.now() + (durationDays * 24 * 60 * 60 * 1000),
      status: 'active'
    };

    setTransactions([newTx, ...transactions]);
    setOpen(false);
    
    // Reset Form
    setFormData({
      manualType: '',
      selectedType: '',
      agentPrice: '',
      clientPrice: '',
      agent: '',
      duration: '',
      paymentMethod: ''
    });
  };

  const updateStatus = (id: number, newStatus: 'completed' | 'cancelled') => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, status: newStatus } : tx
    ));
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">المعاملات</h1>
          <p className="text-gray-500">إدارة ومتابعة المعاملات</p>
        </div>
      </header>

      {/* Actions Area */}
      <div className="mb-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#eef2f6] text-blue-600 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all w-full sm:w-auto justify-center">
              <div className="p-1 bg-blue-100 rounded-full">
                <Plus className="w-5 h-5" />
              </div>
              <span>أضف معاملة جديدة</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 text-center mb-2">معاملة جديدة</DialogTitle>
              <DialogDescription className="text-center text-gray-500 hidden">
                أدخل تفاصيل المعاملة الجديدة
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              
              {/* Row 1: Transaction Type (Split) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">نوع المعاملة (كتابة)</Label>
                  <Input 
                    placeholder="اكتب المعاملة هنا.. مثلاً" 
                    value={formData.manualType}
                    onChange={(e) => setFormData({...formData, manualType: e.target.value})}
                    className="bg-[#eef2f6] shadow-3d-inset border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">أو اختر من القائمة</Label>
                  <Select 
                    onValueChange={(val) => setFormData({...formData, selectedType: val, manualType: val})}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-[#eef2f6] border-none shadow-3d-inset text-right flex-row-reverse">
                      <SelectValue placeholder="اختر معاملة..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                      {transactionTypesList.map((type) => (
                        <SelectItem key={type} value={type} className="text-right cursor-pointer focus:bg-white/50 my-1">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Prices (Split) - ALWAYS Side by Side (grid-cols-2) */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">سعر المعقب</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.agentPrice}
                      onChange={(e) => setFormData({...formData, agentPrice: e.target.value})}
                      className="pl-12 text-left font-bold text-gray-600"
                    />
                    <span className="absolute left-3 top-3 text-sm font-bold text-gray-400">ر.س</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">السعر للعميل</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.clientPrice}
                      onChange={(e) => setFormData({...formData, clientPrice: e.target.value})}
                      className="pl-12 text-left font-bold text-blue-600"
                    />
                    <span className="absolute left-3 top-3 text-sm font-bold text-blue-400">ر.س</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Agent Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">اختر المعقب</Label>
                <Select 
                   onValueChange={(val) => setFormData({...formData, agent: val})}
                   defaultValue="إنجاز بنفسي"
                >
                  <SelectTrigger className="h-12 rounded-xl bg-[#eef2f6] border-none shadow-3d-inset text-right flex-row-reverse">
                    <SelectValue placeholder="اختر المعقب..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                    {agentsList.map((agent) => (
                      <SelectItem key={agent} value={agent} className="text-right cursor-pointer focus:bg-white/50 my-1">{agent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4: Duration & Payment (Split) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">مدة الإنجاز (أيام)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="مثال: 3" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="pl-10 text-left"
                    />
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">طريقة الدفع</Label>
                  <Select 
                    onValueChange={(val) => setFormData({...formData, paymentMethod: val})}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-[#eef2f6] border-none shadow-3d-inset text-right flex-row-reverse">
                      <SelectValue placeholder="اختر البنك..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                      {banksList.map((bank) => (
                        <SelectItem key={bank} value={bank} className="text-right cursor-pointer focus:bg-white/50 my-1">{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>

            <DialogFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 w-full">
              <button 
                onClick={handleSave}
                className="w-full sm:w-auto min-w-[200px] py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                حفظ المعاملة
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl bg-transparent text-gray-500 font-semibold hover:bg-gray-200/50 transition-all"
              >
                إلغاء
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-[#eef2f6] rounded-3xl shadow-3d p-8 min-h-[300px] flex flex-col items-center justify-center text-center border border-white/20">
            <div className="w-20 h-20 bg-[#eef2f6] rounded-full shadow-3d flex items-center justify-center mb-6 text-gray-400">
                <Banknote className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد معاملات حالياً</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
                قم بإضافة معاملة جديدة للبدء.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className={cn(
                "border-none shadow-3d bg-[#eef2f6] overflow-hidden transition-all",
                tx.status === 'completed' ? "opacity-75" : "",
                tx.status === 'cancelled' ? "opacity-60 grayscale" : ""
              )}>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-stretch">
                    
                    {/* Status Strip */}
                    <div className={cn(
                      "w-full sm:w-2 h-2 sm:h-auto",
                      tx.status === 'active' ? "bg-blue-500" : 
                      tx.status === 'completed' ? "bg-green-500" : "bg-red-500"
                    )} />

                    <div className="flex-1 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      
                      {/* Info Block 1 */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">رقم المعاملة</p>
                        <p className="font-bold text-gray-800">#{tx.serialNo}</p>
                      </div>

                      {/* Info Block 2 */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">نوع المعاملة</p>
                        <p className="font-bold text-gray-800">{tx.type}</p>
                      </div>

                      {/* Info Block 3 */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">السعر للعميل</p>
                        <p className="font-bold text-blue-600">{tx.clientPrice} ر.س</p>
                      </div>

                      {/* Timer Block */}
                      <div className="bg-[#eef2f6] shadow-3d-inset rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">الوقت المتبقي</p>
                        <CountdownTimer targetDate={tx.targetDate} status={tx.status} />
                      </div>

                    </div>

                    {/* Actions */}
                    {tx.status === 'active' && (
                      <div className="flex sm:flex-col border-t sm:border-t-0 sm:border-r border-gray-200 divide-x sm:divide-x-0 sm:divide-y divide-gray-200 rtl:divide-x-reverse">
                        <button 
                          onClick={() => updateStatus(tx.id, 'completed')}
                          className="flex-1 sm:flex-none p-4 hover:bg-green-50 text-green-600 transition-colors flex items-center justify-center gap-2"
                          title="تم الإنجاز"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="sm:hidden text-sm font-bold">إنجاز</span>
                        </button>
                        <button 
                          onClick={() => updateStatus(tx.id, 'cancelled')}
                          className="flex-1 sm:flex-none p-4 hover:bg-red-50 text-red-600 transition-colors flex items-center justify-center gap-2"
                          title="إلغاء المعاملة"
                        >
                          <XCircle className="w-5 h-5" />
                          <span className="sm:hidden text-sm font-bold">إلغاء</span>
                        </button>
                      </div>
                    )}
                    
                    {tx.status !== 'active' && (
                       <div className="flex items-center justify-center p-4 border-t sm:border-t-0 sm:border-r border-gray-200">
                          {tx.status === 'completed' ? (
                            <span className="flex items-center gap-2 text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                              <CheckCircle className="w-4 h-4" /> منجز
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-sm">
                              <XCircle className="w-4 h-4" /> ملغي
                            </span>
                          )}
                       </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
