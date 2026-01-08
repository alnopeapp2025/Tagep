import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Plus, Clock, CheckCircle, XCircle, Banknote, AlertCircle, Wallet } from 'lucide-react';
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
import { getStoredTransactions, saveStoredTransactions, getStoredBalances, saveStoredBalances, BANKS_LIST } from '@/lib/store';

// --- Types ---
export interface Transaction {
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

const banksList = BANKS_LIST;

// --- Helper Component: Detailed Countdown Timer ---
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
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`تبقي علي الإنجاز: ${days}يوم ${hours}ساعات ${minutes}دقيقة ${seconds}ثانية`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, status]);

  if (status === 'completed') return <span className="text-green-600 font-bold text-sm">تم الإنجاز بنجاح</span>;
  if (status === 'cancelled') return <span className="text-red-600 font-bold text-sm">تم إلغاء المعاملة</span>;

  return <span className="font-mono font-bold text-blue-600 text-xs sm:text-sm" dir="rtl">{timeLeft}</span>;
};

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Wallet State (Real Data from Store)
  const [officeBalance, setOfficeBalance] = useState(0);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Form State
  const [inputTypeMode, setInputTypeMode] = useState<'manual' | 'select'>('manual');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    manualType: '',
    selectedType: '',
    agentPrice: '',
    clientPrice: '',
    agent: '',
    duration: '',
    paymentMethod: ''
  });

  // Refs for Smart Navigation
  const manualTypeRef = useRef<HTMLInputElement>(null);
  const agentPriceRef = useRef<HTMLInputElement>(null);
  const clientPriceRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);

  // Load Initial Data
  useEffect(() => {
    const loadedTxs = getStoredTransactions();
    setTransactions(loadedTxs);
    updateBalancesDisplay();
  }, []);

  const updateBalancesDisplay = () => {
    const bals = getStoredBalances();
    const total = Object.values(bals).reduce((a, b) => a + b, 0);
    setOfficeBalance(total);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (inputTypeMode === 'manual' && !formData.manualType) newErrors.type = "يرجى كتابة نوع المعاملة";
    if (inputTypeMode === 'select' && !formData.selectedType) newErrors.type = "يرجى اختيار نوع المعاملة";
    if (!formData.agentPrice) newErrors.agentPrice = "مطلوب";
    if (!formData.clientPrice) newErrors.clientPrice = "مطلوب";
    if (!formData.agent) newErrors.agent = "يرجى اختيار المعقب";
    if (!formData.duration) newErrors.duration = "مطلوب";
    if (!formData.paymentMethod) newErrors.paymentMethod = "يرجى اختيار طريقة الدفع";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const finalType = inputTypeMode === 'manual' ? formData.manualType : formData.selectedType;
    const durationDays = parseInt(formData.duration) || 0;
    
    const newTx: Transaction = {
      id: Date.now(),
      serialNo: String(transactions.length + 1).padStart(4, '0'),
      type: finalType,
      clientPrice: formData.clientPrice,
      agentPrice: formData.agentPrice,
      agent: formData.agent,
      duration: formData.duration,
      paymentMethod: formData.paymentMethod,
      createdAt: Date.now(),
      targetDate: Date.now() + (durationDays * 24 * 60 * 60 * 1000),
      status: 'active'
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveStoredTransactions(updatedTxs);
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
    setErrors({});
  };

  const updateStatus = (id: number, newStatus: 'completed' | 'cancelled') => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (newStatus === 'completed' && tx.status === 'active') {
        // Update Bank Balance
        const clientP = parseFloat(tx.clientPrice) || 0;
        const currentBalances = getStoredBalances();
        
        if (currentBalances[tx.paymentMethod] !== undefined) {
          currentBalances[tx.paymentMethod] += clientP;
          saveStoredBalances(currentBalances);
          updateBalancesDisplay();
        }
    }

    const updatedTxs = transactions.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    );
    setTransactions(updatedTxs);
    saveStoredTransactions(updatedTxs);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header & Wallet Summary */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <button 
                onClick={() => navigate('/')}
                className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
                >
                <ArrowRight className="w-6 h-6" />
                </button>
                <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 text-shadow">المعاملات</h1>
                <p className="text-gray-500 text-sm">إدارة ومتابعة المعاملات المالية</p>
                </div>
            </div>
            
            {/* Wallet Simulation Display */}
            <div className="hidden sm:flex gap-4">
                <div className="bg-[#eef2f6] shadow-3d-inset px-4 py-2 rounded-xl flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <div className="text-xs text-gray-500">جملة الخزينة</div>
                    <div className="font-bold text-blue-700">{officeBalance.toLocaleString()} ر.س</div>
                </div>
            </div>
        </div>
      </header>

      {/* Actions Area */}
      <div className="mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#eef2f6] text-blue-600 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all w-full sm:w-auto justify-center">
              <div className="p-1 bg-blue-100 rounded-full">
                <Plus className="w-5 h-5" />
              </div>
              <span>أضف معاملة جديدة</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800 text-center mb-1">بيانات المعاملة</DialogTitle>
              <DialogDescription className="hidden">Form</DialogDescription>
            </DialogHeader>

            {/* Compact Form Grid */}
            <div className="grid gap-3 py-2">
              
              {/* 1. Transaction Type (Red Frame Logic) */}
              <div className="relative border-2 border-red-400/30 rounded-xl p-3 bg-white/30">
                 <Label className="text-gray-700 font-bold text-xs mb-2 block">نوع المعاملة</Label>
                 
                 {/* Toggle Switch */}
                 <div className="flex bg-[#eef2f6] p-1 rounded-lg shadow-3d-inset mb-3">
                    <button 
                        onClick={() => setInputTypeMode('manual')}
                        className={cn(
                            "flex-1 py-1 text-xs font-bold rounded-md transition-all",
                            inputTypeMode === 'manual' ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                        )}
                    >
                        كتابة يدوية
                    </button>
                    <button 
                        onClick={() => setInputTypeMode('select')}
                        className={cn(
                            "flex-1 py-1 text-xs font-bold rounded-md transition-all",
                            inputTypeMode === 'select' ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                        )}
                    >
                        اختر من قائمة
                    </button>
                 </div>

                 {inputTypeMode === 'manual' ? (
                    <Input 
                        ref={manualTypeRef}
                        placeholder="اكتب المعاملة هنا.. مثلاً" 
                        value={formData.manualType}
                        onChange={(e) => {
                            setFormData({...formData, manualType: e.target.value});
                            if(errors.type) setErrors({...errors, type: ''});
                        }}
                        onKeyDown={(e) => handleKeyDown(e, agentPriceRef)}
                        className="bg-[#eef2f6] shadow-3d-inset border-none h-10 text-sm"
                    />
                 ) : (
                    <Select 
                        onValueChange={(val) => {
                            setFormData({...formData, selectedType: val});
                            if(errors.type) setErrors({...errors, type: ''});
                        }}
                    >
                        <SelectTrigger className="h-10 rounded-xl bg-[#eef2f6] border-none shadow-3d-inset text-right flex-row-reverse text-sm">
                        <SelectValue placeholder="اختر معاملة..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                        {transactionTypesList.map((type) => (
                            <SelectItem key={type} value={type} className="text-right cursor-pointer focus:bg-white/50 my-1">{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                 )}
                 {errors.type && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.type}</p>}
              </div>

              {/* 2. Prices (Side by Side) */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                  <Label className="text-gray-700 font-bold text-xs">سعر المعقب</Label>
                  <div className="relative">
                    <Input 
                      ref={agentPriceRef}
                      type="number" 
                      placeholder="0" 
                      value={formData.agentPrice}
                      onChange={(e) => {
                          setFormData({...formData, agentPrice: e.target.value});
                          if(errors.agentPrice) setErrors({...errors, agentPrice: ''});
                      }}
                      onKeyDown={(e) => handleKeyDown(e, clientPriceRef)}
                      className={cn(
                          "pl-10 text-left font-bold text-gray-600 h-10 text-sm",
                          errors.agentPrice ? "border border-red-400" : "border-none"
                      )}
                    />
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">ر.س</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-700 font-bold text-xs">السعر للعميل</Label>
                  <div className="relative">
                    <Input 
                      ref={clientPriceRef}
                      type="number" 
                      placeholder="0" 
                      value={formData.clientPrice}
                      onChange={(e) => {
                          setFormData({...formData, clientPrice: e.target.value});
                          if(errors.clientPrice) setErrors({...errors, clientPrice: ''});
                      }}
                      onKeyDown={(e) => handleKeyDown(e, durationRef)}
                      className={cn(
                        "pl-10 text-left font-bold text-blue-600 h-10 text-sm",
                        errors.clientPrice ? "border border-red-400" : "border-none"
                      )}
                    />
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-blue-400">ر.س</span>
                  </div>
                </div>
              </div>

              {/* 3. Agent Selection */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-bold text-xs">اختر المعقب</Label>
                <Select 
                   onValueChange={(val) => {
                       setFormData({...formData, agent: val});
                       if(errors.agent) setErrors({...errors, agent: ''});
                   }}
                >
                  <SelectTrigger className={cn(
                      "h-10 rounded-xl bg-[#eef2f6] shadow-3d-inset text-right flex-row-reverse text-sm",
                      errors.agent ? "border border-red-400" : "border-none"
                  )}>
                    <SelectValue placeholder="اختر المعقب..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                    {agentsList.map((agent) => (
                      <SelectItem key={agent} value={agent} className="text-right cursor-pointer focus:bg-white/50 my-1">{agent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Duration & Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-gray-700 font-bold text-xs">مدة الإنجاز (أيام)</Label>
                  <div className="relative">
                    <Input 
                      ref={durationRef}
                      type="number" 
                      placeholder="3" 
                      value={formData.duration}
                      onChange={(e) => {
                          setFormData({...formData, duration: e.target.value});
                          if(errors.duration) setErrors({...errors, duration: ''});
                      }}
                      className={cn(
                        "pl-8 text-left h-10 text-sm",
                        errors.duration ? "border border-red-400" : "border-none"
                      )}
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-700 font-bold text-xs">طريقة الدفع</Label>
                  <Select 
                    onValueChange={(val) => {
                        setFormData({...formData, paymentMethod: val});
                        if(errors.paymentMethod) setErrors({...errors, paymentMethod: ''});
                    }}
                  >
                    <SelectTrigger className={cn(
                        "h-10 rounded-xl bg-[#eef2f6] shadow-3d-inset text-right flex-row-reverse text-sm",
                        errors.paymentMethod ? "border border-red-400" : "border-none"
                    )}>
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

            <DialogFooter className="flex justify-center mt-4">
              <button 
                onClick={handleSave}
                className="w-full max-w-[200px] py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all text-sm"
              >
                حفظ المعاملة
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
                  <div className="flex flex-col">
                    
                    {/* Top Row: Info (One Line) */}
                    <div className="flex items-center justify-between p-4 bg-white/40 border-b border-white/50">
                        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                            <span className="font-mono font-bold text-gray-400 text-sm">#{tx.serialNo}</span>
                            <span className="h-4 w-[1px] bg-gray-300"></span>
                            <span className="font-bold text-gray-800 text-sm truncate">{tx.type}</span>
                            <span className="h-4 w-[1px] bg-gray-300"></span>
                            <span className="font-bold text-blue-600 text-sm whitespace-nowrap">{tx.clientPrice} ر.س</span>
                        </div>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            tx.status === 'active' ? "bg-blue-500 animate-pulse" : 
                            tx.status === 'completed' ? "bg-green-500" : "bg-red-500"
                        )} />
                    </div>

                    {/* Middle: Timer & Actions */}
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Countdown */}
                        <div className="w-full sm:w-auto bg-[#eef2f6] shadow-3d-inset rounded-xl p-3 text-center flex-1">
                            <CountdownTimer targetDate={tx.targetDate} status={tx.status} />
                        </div>

                        {/* Actions */}
                        {tx.status === 'active' && (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button 
                                onClick={() => updateStatus(tx.id, 'completed')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors text-sm flex items-center justify-center gap-1"
                                >
                                <CheckCircle className="w-4 h-4" />
                                إنجاز
                                </button>
                                <button 
                                onClick={() => updateStatus(tx.id, 'cancelled')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors text-sm flex items-center justify-center gap-1"
                                >
                                <XCircle className="w-4 h-4" />
                                إلغاء
                                </button>
                            </div>
                        )}
                    </div>

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
