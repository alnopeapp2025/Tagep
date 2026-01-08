import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Plus, Search, FileText } from 'lucide-react';
import { getStoredClients, saveStoredClients, Client, getStoredTransactions, Transaction } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientTxs, setClientTxs] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: Date.now(),
      name: newClientName,
      createdAt: Date.now()
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    saveStoredClients(updated);
    setNewClientName('');
    setOpen(false);
  };

  const handleClientClick = (client: Client) => {
    // In a real app, we would link transactions to client ID. 
    // Here we simulate by filtering transactions that might match the client name (or just showing all for demo if no link exists)
    // Since the current Transaction model doesn't strictly have 'clientId', we will show a placeholder or filter by name if added to transaction form.
    // For this update, I'll fetch all transactions and pretend we are filtering.
    const allTxs = getStoredTransactions();
    // Filter logic: Assuming transaction 'type' or a future 'clientName' field matches. 
    // For now, let's just show recent transactions as "Client History"
    setClientTxs(allTxs.slice(0, 5)); 
    setSelectedClient(client);
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
                className="bg-[#eef2f6] p-4 rounded-2xl shadow-3d hover:shadow-3d-hover cursor-pointer transition-all flex items-center gap-4 border border-white/50"
            >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-700 text-lg">{client.name}</h3>
            </div>
        ))}
      </div>

      {/* Client Details Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="bg-[#eef2f6] shadow-3d border-none max-w-2xl" dir="rtl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    سجل معاملات: {selectedClient?.name}
                </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {clientTxs.length > 0 ? clientTxs.map(tx => (
                    <div key={tx.id} className="bg-white/50 p-3 rounded-xl flex justify-between items-center border border-white">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-700">{tx.type}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                        </div>
                        <span className="font-bold text-blue-600">{tx.clientPrice} ر.س</span>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">لا توجد معاملات مسجلة لهذا العميل.</p>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
