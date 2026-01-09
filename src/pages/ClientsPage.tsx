import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Plus, Search, FileText, Phone, MessageCircle, AlertCircle, Wallet, CheckCircle2, Send, X } from 'lucide-react';
import { 
  getStoredClients, saveStoredClients, Client, 
  getStoredTransactions, Transaction, saveStoredTransactions,
  getStoredBalances, saveStoredBalances, BANKS_LIST,
  getStoredClientRefunds, saveStoredClientRefunds, ClientRefundRecord,
  getStoredPendingBalances, saveStoredPendingBalances
} from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  
  // Form States
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');
  const [errors, setErrors] = useState({ phone: '', whatsapp: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientTxs, setClientTxs] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  // Refund States
  const [transferStep, setTransferStep] = useState<'summary' | 'bank-select' | 'success'>('summary');
  const [selectedBank, setSelectedBank] = useState('');
  const [pendingBalances, setPendingBalances] = useState<Record<string, number>>({});
  const [transferError, setTransferError] = useState('');
  const [totalRefundable, setTotalRefundable] = useState(0);

  useEffect(() => {
    setClients(getStoredClients());
    setPendingBalances(getStoredPendingBalances());
  }, []);

  // Calculate Total Refundable whenever transactions change
  useEffect(() => {
    if (clientTxs.length > 0) {
        // Count cancelled transactions that haven't been refunded yet
        const total = clientTxs
            .filter(t => t.status === 'cancelled' && !t.clientRefunded)
            .reduce((sum, t) => sum + (parseFloat(t.clientPrice) || 0), 0);
        setTotalRefundable(total);
    } else {
        setTotalRefundable(0);
    }
  }, [clientTxs]);

  const validateSaudiNumber = (num: string) => {
    // Must be 9 digits and start with 5
    const regex = /^5[0-9]{8}$/;
    return regex.test(num);
  };

  const handleAddClient = () => {
    let hasError = false;
    const newErrors = { phone: '', whatsapp: '' };

    if (!newClientName.trim()) return;

    // Validate Phone
    if (newClientPhone && !validateSaudiNumber(newClientPhone)) {
        newErrors.phone = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    // Validate WhatsApp
    if (newClientWhatsapp && !validateSaudiNumber(newClientWhatsapp)) {
        newErrors.whatsapp = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    setErrors(newErrors);
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
    
    // Reset
    setNewClientName('');
    setNewClientPhone('');
    setNewClientWhatsapp('');
    setErrors({ phone: '', whatsapp: '' });
    setOpen(false);
  };

  const handleClientClick = (client: Client) => {
    const allTxs = getStoredTransactions();
    const filtered = allTxs.filter(t => t.clientName === client.name && !t.clientRefunded);
    
    setClientTxs(filtered); 
    setSelectedClient(client);
    setTransferStep('summary');
    setTransferError('');
    setSelectedBank('');
    setPendingBalances(getStoredPendingBalances());
  };

  const handleWhatsAppClick = (e: React.MouseEvent, number?: string) => {
    e.stopPropagation();
    if (!number) return;
    window.open(`https://wa.me/${number}`, '_blank');
  };

  const handlePhoneClick = (e: React.MouseEvent, number?: string) => {
    e.stopPropagation();
    if (!number) return;
    window.location.href = `tel:+${number}`;
  };

  const handleRefundProcess = () => {
    if (!selectedBank || !selectedClient) return;
    
    // MODIFIED: Deduct from Pending Balances (not actual balances)
    const currentPending = pendingBalances[selectedBank] || 0;
    
    // Note: We might allow refund even if pending is low if data was inconsistent, 
    // but typically we check availability.
    if (currentPending < totalRefundable) {
        setTransferError('رصيد الخزنة غير المستحقة (المعلقة) لهذا البنك غير كافي');
        return;
    }

    // 1. Deduct Amount from Pending Treasury
    const newPending = { ...pendingBalances };
    newPending[selectedBank] = currentPending - totalRefundable;
    saveStoredPendingBalances(newPending);
    setPendingBalances(newPending);

    // 2. Mark Transactions as Refunded
    const allTxs = getStoredTransactions();
    const refundedTxIds: number[] = [];
    
    const updatedTxs = allTxs.map(t => {
        if (t.clientName === selectedClient.name && t.status === 'cancelled' && !t.clientRefunded) {
            refundedTxIds.push(t.id);
            return { ...t, clientRefunded: true };
        }
        return t;
    });
    saveStoredTransactions(updatedTxs);

    // 3. Create Refund Record for Reports
    const refundRecord: ClientRefundRecord = {
        id: Date.now(),
        clientName: selectedClient.name,
        amount: totalRefundable,
        bank: selectedBank,
        date: Date.now(),
        transactionCount: refundedTxIds.length
    };
    const refunds = getStoredClientRefunds();
    saveStoredClientRefunds([refundRecord, ...refunds]);

    // 4. Update Local View (Remove refunded txs)
    setClientTxs(prev => prev.filter(t => !refundedTxIds.includes(t.id)));

    // Move to success step
    setTransferStep('success');
  };

  const sendRefundWhatsApp = () => {
    if (!selectedClient?.whatsapp) return;
    
    const message = `مرحباً ${selectedClient.name}،\nتم استرجاع مبلغ المعاملات الملغاة.\nالمبلغ المسترد: ${totalRefundable} ر.س\nتم التحويل من: ${selectedBank}\nنأمل خدمتكم بشكل أفضل مستقبلاً.`;
    
    window.open(`https://wa.me/${selectedClient.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredClients = clients.filter(c => c.name.includes(searchTerm));

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">العملاء</h1>
          <p className="text-gray-500">إدارة قائمة العملاء</p>
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <Input 
                placeholder="بحث عن عميل..." 
                className="pr-10 bg-[#eef2f6] shadow-3d-inset border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-blue-600 text-white px-6 rounded-xl font-bold shadow-3d hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    أضف عميل
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#eef2f6] shadow-3d border-none" dir="rtl">
                <DialogHeader><DialogTitle>إضافة عميل جديد</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>اسم العميل</Label>
                        <Input 
                            value={newClientName} 
                            onChange={(e) => setNewClientName(e.target.value)} 
                            className="bg-white shadow-3d-inset border-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>رقم الجوال</Label>
                        <div className="relative flex items-center" dir="ltr">
                            <div className="absolute left-3 z-10 text-gray-400 font-bold text-sm pointer-events-none">+966</div>
                            <Input 
                                value={newClientPhone} 
                                onChange={(e) => {
                                    // Allow only numbers and max 9 digits
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setNewClientPhone(val);
                                    if(errors.phone) setErrors({...errors, phone: ''});
                                }} 
                                className={`bg-white shadow-3d-inset border-none pl-14 text-left ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                                placeholder="5xxxxxxxx"
                            />
                            <Phone className="absolute right-3 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>رقم الواتساب</Label>
                        <div className="relative flex items-center" dir="ltr">
                            <div className="absolute left-3 z-10 text-green-600 font-bold text-sm pointer-events-none">+966</div>
                            <Input 
                                value={newClientWhatsapp} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setNewClientWhatsapp(val);
                                    if(errors.whatsapp) setErrors({...errors, whatsapp: ''});
                                }} 
                                className={`bg-white shadow-3d-inset border-none pl-14 text-left ${errors.whatsapp ? 'ring-2 ring-red-400' : ''}`}
                                placeholder="5xxxxxxxx"
                            />
                            <MessageCircle className="absolute right-3 w-4 h-4 text-green-500" />
                        </div>
                        {errors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.whatsapp}</p>}
                    </div>

                    <button onClick={handleAddClient} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">حفظ</button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map(client => (
            <div 
                key={client.id} 
                onClick={() => handleClientClick(client)}
                className="bg-[#eef2f6] p-4 rounded-2xl shadow-3d hover:shadow-3d-hover cursor-pointer transition-all flex items-center justify-between gap-4 border border-white/50"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 text-lg">{client.name}</h3>
                        <div className="flex gap-2 text-xs text-gray-400 mt-1">
                            {client.phone && <span className="flex items-center gap-1" dir="ltr">+{client.phone} <Phone className="w-3 h-3"/></span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {client.phone && (
                        <button 
                            onClick={(e) => handlePhoneClick(e, client.phone)}
                            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-3d hover:scale-110 transition-transform"
                        >
                            <Phone className="w-5 h-5" />
                        </button>
                    )}
                    {client.whatsapp && (
                        <button 
                            onClick={(e) => handleWhatsAppClick(e, client.whatsapp)}
                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-3d hover:scale-110 transition-transform"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>

      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="bg-[#eef2f6] shadow-3d border-none max-w-2xl" dir="rtl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    سجل معاملات: {selectedClient?.name}
                </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[50vh] overflow-y-auto">
                {clientTxs.length > 0 ? clientTxs.map(tx => (
                    <div key={tx.id} className="bg-white/50 p-3 rounded-xl flex justify-between items-center border border-white">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-700">{tx.type}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <span className={`font-bold ${tx.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                                {tx.clientPrice} ر.س
                            </span>
                            {tx.status === 'cancelled' && <p className="text-[10px] text-red-500 font-bold">ملغاة (مسترجعة)</p>}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">لا توجد معاملات مسجلة لهذا العميل.</p>
                )}
            </div>

            {/* Refund Section */}
            {clientTxs.length > 0 && totalRefundable > 0 && (
                <div className="mt-2 pt-4 border-t border-gray-200">
                    
                    {/* Step 1: Summary & Refund Button */}
                    {transferStep === 'summary' && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-3d-inset">
                            <div>
                                <p className="text-xs text-gray-500 font-bold mb-1">إجمالي المسترجع (ملغاة)</p>
                                <p className="text-2xl font-black text-red-600">{totalRefundable.toLocaleString()} ر.س</p>
                            </div>
                            <button 
                                onClick={() => setTransferStep('bank-select')}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all"
                            >
                                <Wallet className="w-4 h-4" />
                                تحويل للعميل
                            </button>
                        </div>
                    )}

                    {/* Step 2: Bank Selection */}
                    {transferStep === 'bank-select' && (
                        <div className="bg-white p-4 rounded-xl shadow-3d-inset space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center mb-2">
                                <Label className="font-bold text-gray-700">اختر البنك للخصم (الاسترجاع)</Label>
                                <button onClick={() => setTransferStep('summary')} className="text-xs text-red-500 font-bold">إلغاء</button>
                            </div>
                            
                            <Select onValueChange={(val) => { setSelectedBank(val); setTransferError(''); }} value={selectedBank}>
                                <SelectTrigger className="bg-[#eef2f6] border-none h-12 text-right flex-row-reverse">
                                    <SelectValue placeholder="اختر البنك" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#eef2f6] shadow-3d border-none text-right" dir="rtl">
                                    {BANKS_LIST.map((bank) => (
                                        <SelectItem key={bank} value={bank} className="text-right cursor-pointer my-1">
                                            <div className="flex justify-between w-full gap-4">
                                                <span>{bank}</span>
                                                <span className={`font-bold ${(pendingBalances[bank] || 0) >= totalRefundable ? 'text-green-600' : 'text-red-500'}`}>
                                                    {(pendingBalances[bank] || 0).toLocaleString()} ر.س
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {transferError && <p className="text-red-500 text-xs font-bold">{transferError}</p>}

                            <button 
                                onClick={handleRefundProcess}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all mt-2"
                            >
                                تأكيد الاسترجاع ({totalRefundable} ر.س)
                            </button>
                        </div>
                    )}

                    {/* Step 3: Success & WhatsApp */}
                    {transferStep === 'success' && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center space-y-4 animate-in zoom-in">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-green-800">تم التحويل بنجاح للعميل</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={sendRefundWhatsApp}
                                    className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700"
                                >
                                    <Send className="w-4 h-4" />
                                    إرسال المبلغ للعميل
                                </button>
                                <button 
                                    onClick={() => setSelectedClient(null)}
                                    className="flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                                >
                                    <X className="w-4 h-4" />
                                    خروج
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
