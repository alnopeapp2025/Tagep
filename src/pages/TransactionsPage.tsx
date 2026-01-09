import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Plus, Clock, Banknote, AlertCircle, Wallet, Printer, Send, Phone, MessageCircle } from 'lucide-react';
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
import { 
  getStoredTransactions, saveStoredTransactions, 
  getStoredBalances, saveStoredBalances, 
  getStoredPendingBalances, saveStoredPendingBalances,
  BANKS_LIST, getStoredClients, saveStoredClients, Client, getStoredAgents, saveStoredAgents, Agent 
} from '@/lib/store';

// --- Types ---
export interface Transaction {
  id: number;
  serialNo: string;
  type: string;
  clientPrice: string;
  agentPrice: string;
  agent: string;
  clientName?: string;
  duration: string;
  paymentMethod: string;
  createdAt: number;
  targetDate: number;
  status: 'active' | 'completed' | 'cancelled';
  agentPaid?: boolean; // Track if agent has been paid
  clientRefunded?: boolean; // Track if client has been refunded
}

// --- Constants ---
const transactionTypesList = [
  "تجديد إقامة", "نقل كفالة", "خروج وعودة", "خروج نهائي", "تأشيرة زيارة", "تأمين طبي", "إصدار رخصة"
];

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
  
  // Wallet State
  const [officeBalance, setOfficeBalance] = useState(0);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Clients & Agents State
  const [clients, setClients] = useState<Client[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // Quick Add States
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');
  const [clientErrors, setClientErrors] = useState({ phone: '', whatsapp: '' });

  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentWhatsapp, setNewAgentWhatsapp] = useState('');
  const [agentErrors, setAgentErrors] = useState({ phone: '', whatsapp: '' });

  // Form State
  const [inputTypeMode, setInputTypeMode] = useState<'manual' | 'select'>('manual');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    manualType: '',
    selectedType: '',
    agentPrice: '',
    clientPrice: '',
    agent: '',
    clientName: '',
    duration: '',
    paymentMethod: ''
  });

  // Refs for Smart Navigation
  const manualTypeRef = useRef<HTMLInputElement>(null);
  const agentPriceRef = useRef<HTMLInputElement>(null);
  const clientPriceRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const clientSelectRef = useRef<HTMLButtonElement>(null);
  const agentSelectRef = useRef<HTMLButtonElement>(null);

  // Load Initial Data
  useEffect(() => {
    const loadedTxs = getStoredTransactions();
    setTransactions(loadedTxs);
    setClients(getStoredClients());
    setAgents(getStoredAgents());
    updateBalancesDisplay();
  }, []);

  const updateBalancesDisplay = () => {
    const bals = getStoredBalances();
    const total = Object.values(bals).reduce((a, b) => a + b, 0);
    setOfficeBalance(total);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let firstErrorField = null;
    
    if (inputTypeMode === 'manual' && !formData.manualType) {
        newErrors.type = "يرجى كتابة نوع المعاملة";
        if(!firstErrorField) firstErrorField = manualTypeRef;
    }
    if (inputTypeMode === 'select' && !formData.selectedType) {
        newErrors.type = "يرجى اختيار نوع المعاملة";
    }
    if (!formData.agentPrice) {
        newErrors.agentPrice = "مطلوب";
        if(!firstErrorField) firstErrorField = agentPriceRef;
    }
    if (!formData.clientPrice) {
        newErrors.clientPrice = "مطلوب";
        if(!firstErrorField) firstErrorField = clientPriceRef;
    }
    if (!formData.agent) {
        newErrors.agent = "يرجى اختيار المعقب";
    }
    if (!formData.duration) {
        newErrors.duration = "مطلوب";
        if(!firstErrorField) firstErrorField = durationRef;
    }
    if (!formData.paymentMethod) {
        newErrors.paymentMethod = "يرجى اختيار طريقة الدفع";
    }

    setErrors(newErrors);

    // Focus on first error
    if (firstErrorField && firstErrorField.current) {
        firstErrorField.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const finalType = inputTypeMode === 'manual' ? formData.manualType : formData.selectedType;
    const durationDays = parseInt(formData.duration) || 0;
    const clientP = parseFloat(formData.clientPrice) || 0;
    
    const newTx: Transaction = {
      id: Date.now(),
      serialNo: String(transactions.length + 1).padStart(4, '0'),
      type: finalType,
      clientPrice: formData.clientPrice,
      agentPrice: formData.agentPrice,
      agent: formData.agent,
      clientName: formData.clientName || 'عميل عام',
      duration: formData.duration,
      paymentMethod: formData.paymentMethod,
      createdAt: Date.now(),
      targetDate: Date.now() + (durationDays * 24 * 60 * 60 * 1000),
      status: 'active',
      agentPaid: false,
      clientRefunded: false
    };

    // --- NEW LOGIC: Add to Pending Balances ---
    const pendingBalances = getStoredPendingBalances();
    if (pendingBalances[formData.paymentMethod] !== undefined) {
        pendingBalances[formData.paymentMethod] += clientP;
    } else {
        pendingBalances[formData.paymentMethod] = clientP;
    }
    saveStoredPendingBalances(pendingBalances);
    // ------------------------------------------

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
      clientName: '',
      duration: '',
      paymentMethod: ''
    });
    setErrors({});
  };

  const validateSaudiNumber = (num: string) => {
    const regex = /^5[0-9]{8}$/;
    return regex.test(num);
  };

  const handleAddClientQuick = () => {
    let hasError = false;
    const newErrors = { phone: '', whatsapp: '' };

    if(!newClientName.trim()) return;

    if (newClientPhone && !validateSaudiNumber(newClientPhone)) {
        newErrors.phone = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    if (newClientWhatsapp && !validateSaudiNumber(newClientWhatsapp)) {
        newErrors.whatsapp = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    setClientErrors(newErrors);
    if (hasError) return;

    const newClient: Client = {
      id: Date.now(),
      name: newClientName,
      phone: newClientPhone ? `966${newClientPhone}` : '',
      whatsapp: newClientWhatsapp ? `966${newClientWhatsapp}` : '',
      createdAt: Date.now()
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    saveStoredClients(updated);
    
    setFormData(prev => ({ ...prev, clientName: newClientName }));
    setNewClientName('');
    setNewClientPhone('');
    setNewClientWhatsapp('');
    setClientErrors({ phone: '', whatsapp: '' });
    setAddClientOpen(false);
    setTimeout(() => durationRef.current?.focus(), 100);
  };

  const handleAddAgentQuick = () => {
    let hasError = false;
    const newErrors = { phone: '', whatsapp: '' };

    if(!newAgentName.trim()) return;

    if (newAgentPhone && !validateSaudiNumber(newAgentPhone)) {
        newErrors.phone = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    if (newAgentWhatsapp && !validateSaudiNumber(newAgentWhatsapp)) {
        newErrors.whatsapp = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    setAgentErrors(newErrors);
    if (hasError) return;

    const newAgent: Agent = {
      id: Date.now(),
      name: newAgentName,
      phone: newAgentPhone ? `966${newAgentPhone}` : '',
      whatsapp: newAgentWhatsapp ? `966${newAgentWhatsapp}` : '',
      createdAt: Date.now()
    };
    const updated = [newAgent, ...agents];
    setAgents(updated);
    saveStoredAgents(updated);

    setFormData(prev => ({ ...prev, agent: newAgentName }));
    setNewAgentName('');
    setNewAgentPhone('');
    setNewAgentWhatsapp('');
    setAgentErrors({ phone: '', whatsapp: '' });
    setAddAgentOpen(false);
  };

  const updateStatus = (id: number, newStatus: 'completed' | 'cancelled') => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const clientP = parseFloat(tx.clientPrice) || 0;
    const pendingBalances = getStoredPendingBalances();
    const currentBalances = getStoredBalances();

    // Logic when completing a transaction
    if (newStatus === 'completed' && tx.status === 'active') {
        // 1. Remove from Pending
        if (pendingBalances[tx.paymentMethod] !== undefined) {
            pendingBalances[tx.paymentMethod] = Math.max(0, pendingBalances[tx.paymentMethod] - clientP);
        }
        // 2. Add to Actual Treasury
        if (currentBalances[tx.paymentMethod] !== undefined) {
            currentBalances[tx.paymentMethod] += clientP;
        } else {
            currentBalances[tx.paymentMethod] = clientP;
        }
        
        saveStoredPendingBalances(pendingBalances);
        saveStoredBalances(currentBalances);
        updateBalancesDisplay();
    }

    // Logic when cancelling a transaction
    if (newStatus === 'cancelled' && tx.status === 'active') {
         // 1. Remove from Pending (Money goes back to client or disappears from system view)
         if (pendingBalances[tx.paymentMethod] !== undefined) {
            pendingBalances[tx.paymentMethod] = Math.max(0, pendingBalances[tx.paymentMethod] - clientP);
        }
        saveStoredPendingBalances(pendingBalances);
    }

    const updatedTxs = transactions.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    );
    setTransactions(updatedTxs);
    saveStoredTransactions(updatedTxs);
  };

  const handlePrint = (tx: Transaction) => {
    window.print();
  };

  const handleWhatsApp = (tx: Transaction) => {
    // Find client to get phone number
    const client = clients.find(c => c.name === tx.clientName);
    const phoneNumber = client?.whatsapp || client?.phone;

    const text = `تفاصيل المعاملة:\nنوع: ${tx.type}\nالسعر: ${tx.clientPrice} ر.س\nرقم: ${tx.serialNo}\nالحالة: ${tx.status === 'completed' ? 'تم الإنجاز' : 'قيد التنفيذ'}`;
    
    if (phoneNumber) {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
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
              
              {/* 1. Transaction Type */}
              <div className="relative border-2 border-red-400/30 rounded-xl p-3 bg-white/30">
                 <Label className="text-gray-700 font-bold text-xs mb-2 block">نوع المعاملة</Label>
                 
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
                    <div className="relative">
                        <Input 
                            ref={manualTypeRef}
                            placeholder="اكتب المعاملة هنا.. مثلاً" 
                            value={formData.manualType}
                            onChange={(e) => {
                                setFormData({...formData, manualType: e.target.value});
                                if(errors.type) setErrors({...errors, type: ''});
                            }}
                            onKeyDown={(e) => handleKeyDown(e, agentPriceRef)}
                            className="bg-[#eef2f6] shadow-3d-inset border-none h-10 text-sm animate-pulse"
                        />
                    </div>
                 ) : (
                    <Select 
                        onValueChange={(val) => {
                            setFormData({...formData, selectedType: val});
                            if(errors.type) setErrors({...errors, type: ''});
                        }}
                    >
                        <SelectTrigger className="h-10 rounded-xl bg-[#eef2f6] border-none shadow-3d-inset text-right flex-row-reverse text-sm [&>svg]:text-red-500 [&>svg]:animate-pulse">
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

              {/* 2. Prices */}
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

              {/* 3. Agent Selection with Add Button */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-bold text-xs">اختر المعقب</Label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Select 
                            value={formData.agent}
                            onValueChange={(val) => {
                                setFormData({...formData, agent: val});
                                if(errors.agent) setErrors({...errors, agent: ''});
                            }}
                        >
                        <SelectTrigger ref={agentSelectRef} className={cn(
                            "h-10 rounded-xl bg-[#eef2f6] shadow-3d-inset text-right flex-row-reverse text-sm",
                            errors.agent ? "border border-red-400" : "border-none"
                        )}>
                            <SelectValue placeholder="اختر المعقب..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                            <SelectItem value="إنجاز بنفسي" className="text-right font-bold text-blue-600">إنجاز بنفسي</SelectItem>
                            {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name} className="text-right cursor-pointer focus:bg-white/50 my-1">{agent.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
                        <DialogTrigger asChild>
                            <button className="w-10 h-10 rounded-xl bg-orange-500 text-white shadow-3d flex items-center justify-center hover:bg-orange-600">
                                <Plus className="w-5 h-5" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl" dir="rtl">
                            <DialogHeader><DialogTitle>إضافة معقب سريع</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-3">
                                <Input 
                                    placeholder="اسم المعقب" 
                                    value={newAgentName}
                                    onChange={(e) => setNewAgentName(e.target.value)}
                                    className="bg-white shadow-3d-inset border-none"
                                />
                                <div className="space-y-1">
                                    <div className="relative flex items-center" dir="ltr">
                                        <div className="absolute left-3 z-10 text-gray-400 font-bold text-sm pointer-events-none">+966</div>
                                        <Input 
                                            value={newAgentPhone} 
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                setNewAgentPhone(val);
                                                if(agentErrors.phone) setAgentErrors({...agentErrors, phone: ''});
                                            }} 
                                            className={`bg-white shadow-3d-inset border-none pl-14 text-left ${agentErrors.phone ? 'ring-2 ring-red-400' : ''}`}
                                            placeholder="5xxxxxxxx"
                                        />
                                        <Phone className="absolute right-3 w-4 h-4 text-gray-400" />
                                    </div>
                                    {agentErrors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {agentErrors.phone}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className="relative flex items-center" dir="ltr">
                                        <div className="absolute left-3 z-10 text-green-600 font-bold text-sm pointer-events-none">+966</div>
                                        <Input 
                                            value={newAgentWhatsapp} 
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                setNewAgentWhatsapp(val);
                                                if(agentErrors.whatsapp) setAgentErrors({...agentErrors, whatsapp: ''});
                                            }} 
                                            className={`bg-white shadow-3d-inset border-none pl-14 text-left ${agentErrors.whatsapp ? 'ring-2 ring-red-400' : ''}`}
                                            placeholder="5xxxxxxxx"
                                        />
                                        <MessageCircle className="absolute right-3 w-4 h-4 text-green-500" />
                                    </div>
                                    {agentErrors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {agentErrors.whatsapp}</p>}
                                </div>
                                <button onClick={handleAddAgentQuick} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold">حفظ وإكمال</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>

               {/* 4. Client Selection with Add Button */}
               <div className="space-y-1">
                <Label className="text-gray-700 font-bold text-xs">العميل</Label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Select 
                            value={formData.clientName}
                            onValueChange={(val) => setFormData({...formData, clientName: val})}
                        >
                            <SelectTrigger ref={clientSelectRef} className="h-10 rounded-xl bg-[#eef2f6] shadow-3d-inset text-right flex-row-reverse text-sm border-none">
                                <SelectValue placeholder="اختر عميل..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.name} className="text-right">{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
                        <DialogTrigger asChild>
                            <button className="w-10 h-10 rounded-xl bg-blue-600 text-white shadow-3d flex items-center justify-center hover:bg-blue-700">
                                <Plus className="w-5 h-5" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl" dir="rtl">
                            <DialogHeader><DialogTitle>إضافة عميل سريع</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-3">
                                <Input 
                                    placeholder="اسم العميل" 
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    className="bg-white shadow-3d-inset border-none"
                                />
                                <div className="space-y-1">
                                    <div className="relative flex items-center" dir="ltr">
                                        <div className="absolute left-3 z-10 text-gray-400 font-bold text-sm pointer-events-none">+966</div>
                                        <Input 
                                            value={newClientPhone} 
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                setNewClientPhone(val);
                                                if(clientErrors.phone) setClientErrors({...clientErrors, phone: ''});
                                            }} 
                                            className={`bg-white shadow-3d-inset border-none pl-14 text-left ${clientErrors.phone ? 'ring-2 ring-red-400' : ''}`}
                                            placeholder="5xxxxxxxx"
                                        />
                                        <Phone className="absolute right-3 w-4 h-4 text-gray-400" />
                                    </div>
                                    {clientErrors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {clientErrors.phone}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className="relative flex items-center" dir="ltr">
                                        <div className="absolute left-3 z-10 text-green-600 font-bold text-sm pointer-events-none">+966</div>
                                        <Input 
                                            value={newClientWhatsapp} 
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                setNewClientWhatsapp(val);
                                                if(clientErrors.whatsapp) setClientErrors({...clientErrors, whatsapp: ''});
                                            }} 
                                            className={`bg-white shadow-3d-inset border-none pl-14 text-left ${clientErrors.whatsapp ? 'ring-2 ring-red-400' : ''}`}
                                            placeholder="5xxxxxxxx"
                                        />
                                        <MessageCircle className="absolute right-3 w-4 h-4 text-green-500" />
                                    </div>
                                    {clientErrors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {clientErrors.whatsapp}</p>}
                                </div>
                                <button onClick={handleAddClientQuick} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">حفظ وإكمال</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>

              {/* 5. Duration & Payment */}
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
                      {BANKS_LIST.map((bank) => (
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
              <Dialog key={tx.id}>
                <DialogTrigger asChild>
                    <Card className={cn(
                        "border-none shadow-3d bg-[#eef2f6] overflow-hidden transition-all cursor-pointer hover:scale-[1.01]",
                        tx.status === 'completed' ? "opacity-75" : "",
                        tx.status === 'cancelled' ? "opacity-60 grayscale" : ""
                    )}>
                        <CardContent className="p-0">
                        <div className="flex flex-col">
                            
                            {/* Top Row: Info (One Line) - Yellow Background */}
                            <div className="flex items-center justify-between p-4 bg-yellow-200 border-b border-yellow-300">
                                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                                    <span className="font-mono font-bold text-yellow-800 text-sm">#{tx.serialNo}</span>
                                    <span className="h-4 w-[1px] bg-yellow-400"></span>
                                    {/* Type */}
                                    <span className="font-bold text-gray-800 text-sm truncate">
                                        {tx.type}
                                    </span>
                                    <span className="h-4 w-[1px] bg-yellow-400"></span>
                                    <span className="font-bold text-blue-700 text-sm whitespace-nowrap">{tx.clientPrice} ر.س</span>
                                </div>
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    tx.status === 'active' ? "bg-blue-500 animate-pulse" : 
                                    tx.status === 'completed' ? "bg-green-500" : "bg-red-500"
                                )} />
                            </div>

                            {/* Middle: Timer & Status (Outside Yellow Block) */}
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="w-full bg-[#eef2f6] shadow-3d-inset rounded-xl p-3 text-center flex-1">
                                    <CountdownTimer targetDate={tx.targetDate} status={tx.status} />
                                </div>
                            </div>

                        </div>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                
                {/* Transaction Details & Actions Modal */}
                <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-center font-bold text-gray-800">تفاصيل المعاملة #{tx.serialNo}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/50 p-3 rounded-xl"><span className="text-gray-500 block text-xs">النوع</span><span className="font-bold">{tx.type}</span></div>
                            <div className="bg-white/50 p-3 rounded-xl"><span className="text-gray-500 block text-xs">العميل</span><span className="font-bold">{tx.clientName || '-'}</span></div>
                            <div className="bg-white/50 p-3 rounded-xl"><span className="text-gray-500 block text-xs">السعر</span><span className="font-bold text-blue-600">{tx.clientPrice} ر.س</span></div>
                            <div className="bg-white/50 p-3 rounded-xl"><span className="text-gray-500 block text-xs">المعقب</span><span className="font-bold">{tx.agent}</span></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handlePrint(tx)} className="flex items-center justify-center gap-2 py-3 bg-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-300">
                                <Printer className="w-4 h-4" /> طباعة
                            </button>
                            <button onClick={() => handleWhatsApp(tx)} className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200">
                                <Send className="w-4 h-4" /> واتساب للعميل
                            </button>
                        </div>

                        {tx.status === 'active' && (
                            <div className="flex gap-3 pt-2 border-t border-gray-200">
                                <button 
                                onClick={() => { updateStatus(tx.id, 'completed'); }}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700"
                                >
                                إنجاز
                                </button>
                                <button 
                                onClick={() => { updateStatus(tx.id, 'cancelled'); }}
                                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200"
                                >
                                إلغاء
                                </button>
                            </div>
                        )}
                    </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
