import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, Trash2, Landmark, ArrowLeftRight } from 'lucide-react';
import { BANKS_LIST, getStoredBalances, saveStoredBalances } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountsPage() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [totalTreasury, setTotalTreasury] = useState(0);

  // Dialog States
  const [transferOpen, setTransferOpen] = useState(false);
  const [zeroOpen, setZeroOpen] = useState(false);

  // Transfer Form
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getStoredBalances();
    setBalances(data);
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    setTotalTreasury(total);
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!transferFrom || !transferTo || !amount || amount <= 0) return;

    // FIX: Ensure we handle undefined balances by defaulting to 0
    // This prevents 'NaN' errors when transferring to/from new accounts
    const currentFromBalance = balances[transferFrom] || 0;
    const currentToBalance = balances[transferTo] || 0;

    if (currentFromBalance < amount) {
      alert("رصيد البنك المحول منه غير كافي");
      return;
    }

    const newBalances = { ...balances };
    
    // Update balances safely
    newBalances[transferFrom] = currentFromBalance - amount;
    newBalances[transferTo] = currentToBalance + amount;

    saveStoredBalances(newBalances);
    loadData();
    setTransferOpen(false);
    setTransferFrom('');
    setTransferTo('');
    setTransferAmount('');
  };

  const handleZeroTreasury = () => {
    const zeroed = BANKS_LIST.reduce((acc, bank) => ({ ...acc, [bank]: 0 }), {});
    saveStoredBalances(zeroed);
    loadData();
    setZeroOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">الحسابات والخزينة</h1>
          <p className="text-gray-500">إدارة السيولة النقدية والحسابات البنكية</p>
        </div>
      </header>

      {/* Total Treasury Card */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-3d p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <Wallet className="w-16 h-16 mb-4 opacity-80" />
           <h2 className="text-2xl font-medium opacity-90 mb-2">جملة الخزينة</h2>
           <div className="text-5xl sm:text-6xl font-black tracking-tight">
             {totalTreasury.toLocaleString()} <span className="text-2xl font-medium">ر.س</span>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-10 justify-center">
        <button 
          onClick={() => setTransferOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#eef2f6] text-blue-600 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all"
        >
          <ArrowLeftRight className="w-5 h-5" />
          تحويل بين البنوك
        </button>
        <button 
          onClick={() => setZeroOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#eef2f6] text-red-500 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all"
        >
          <Trash2 className="w-5 h-5" />
          تصفير الخزينة
        </button>
      </div>

      {/* Banks Grid */}
      <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <Landmark className="w-6 h-6 text-gray-500" />
        تفاصيل البنوك
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BANKS_LIST.map((bank) => (
          <div key={bank} className="bg-[#eef2f6] rounded-2xl shadow-3d p-4 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-full bg-white shadow-3d-inset flex items-center justify-center mb-3 text-blue-600">
              {bank.includes('كاش') ? <Wallet className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
            </div>
            <h4 className="font-bold text-gray-600 text-sm mb-1">{bank}</h4>
            <span className="text-lg font-black text-blue-800">
              {(balances[bank] || 0).toLocaleString()} <span className="text-xs text-gray-400">ر.س</span>
            </span>
          </div>
        ))}
      </div>

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">تحويل رصيد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>من حساب</Label>
              <Select onValueChange={setTransferFrom} value={transferFrom}>
                <SelectTrigger className="bg-white shadow-3d-inset border-none h-12"><SelectValue placeholder="اختر البنك" /></SelectTrigger>
                <SelectContent dir="rtl">
                  {BANKS_LIST.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>إلى حساب</Label>
              <Select onValueChange={setTransferTo} value={transferTo}>
                <SelectTrigger className="bg-white shadow-3d-inset border-none h-12"><SelectValue placeholder="اختر البنك" /></SelectTrigger>
                <SelectContent dir="rtl">
                  {BANKS_LIST.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المبلغ</Label>
              <Input 
                type="number" 
                className="bg-white shadow-3d-inset border-none h-12"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleTransfer} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700">تأكيد التحويل</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Zero Confirm Dialog */}
      <Dialog open={zeroOpen} onOpenChange={setZeroOpen}>
        <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-red-600">تنبيه هام!</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 py-4">
            هل أنت متأكد من رغبتك في تصفير جميع الحسابات؟ لا يمكن التراجع عن هذا الإجراء.
          </div>
          <DialogFooter className="flex gap-2">
            <button onClick={() => setZeroOpen(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">إلغاء</button>
            <button onClick={handleZeroTreasury} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">نعم، تصفير</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
