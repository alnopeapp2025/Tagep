import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Receipt, Plus } from 'lucide-react';
import { getStoredExpenses, saveStoredExpenses, Expense, getStoredBalances, saveStoredBalances } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setExpenses(getStoredExpenses());
  }, []);

  const handleAddExpense = () => {
    if (!title || !amount) return;
    const cost = parseFloat(amount);
    if (cost <= 0) return;

    // Deduct from Treasury (Cash) - Assuming 'نقداً كاش' is the main treasury for expenses
    // Or we could add a selector. For simplicity, let's use Cash.
    const balances = getStoredBalances();
    const cashKey = "نقداً كاش";
    const currentCash = balances[cashKey] || 0;

    if (currentCash < cost) {
        alert("رصيد الكاش غير كافي لتغطية المصروف");
        return;
    }

    // Update Balance
    balances[cashKey] = currentCash - cost;
    saveStoredBalances(balances);

    // Save Expense
    const newExp: Expense = {
      id: Date.now(),
      title,
      amount: cost,
      date: Date.now()
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    saveStoredExpenses(updated);
    
    setTitle('');
    setAmount('');
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">المنصرفات</h1>
          <p className="text-gray-500">تسجيل المصروفات اليومية</p>
        </div>
      </header>

      <div className="mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full py-4 rounded-2xl bg-[#eef2f6] text-red-500 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    تسجيل مصروف جديد
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#eef2f6] shadow-3d border-none" dir="rtl">
                <DialogHeader><DialogTitle>تسجيل مصروف</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>بيان المصروف</Label>
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="bg-white shadow-3d-inset border-none"
                            placeholder="مثلاً: فواتير كهرباء، ضيافة..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>المبلغ</Label>
                        <Input 
                            type="number"
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="bg-white shadow-3d-inset border-none"
                        />
                    </div>
                    <button onClick={handleAddExpense} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">خصم من الخزينة</button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {expenses.map(exp => (
            <div key={exp.id} className="bg-[#eef2f6] p-4 rounded-2xl shadow-3d flex justify-between items-center border border-white/50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shadow-sm">
                        <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700">{exp.title}</h3>
                        <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString('ar-SA')}</p>
                    </div>
                </div>
                <span className="font-bold text-red-600 text-lg">-{exp.amount.toLocaleString()} ر.س</span>
            </div>
        ))}
        {expenses.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد مصروفات مسجلة.</p>}
      </div>
    </div>
  );
}
