import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck, Plus, Search, FileText, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import { getStoredAgents, saveStoredAgents, Agent, getStoredTransactions, Transaction } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function AgentsPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // Form States
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentWhatsapp, setNewAgentWhatsapp] = useState('');
  const [errors, setErrors] = useState({ phone: '', whatsapp: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentTxs, setAgentTxs] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAgents(getStoredAgents());
  }, []);

  const validateSaudiNumber = (num: string) => {
    const regex = /^5[0-9]{8}$/;
    return regex.test(num);
  };

  const handleAddAgent = () => {
    let hasError = false;
    const newErrors = { phone: '', whatsapp: '' };

    if (!newAgentName.trim()) return;

    if (newAgentPhone && !validateSaudiNumber(newAgentPhone)) {
        newErrors.phone = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    if (newAgentWhatsapp && !validateSaudiNumber(newAgentWhatsapp)) {
        newErrors.whatsapp = 'يجب أن يبدأ بـ 5 ويتكون من 9 أرقام';
        hasError = true;
    }

    setErrors(newErrors);
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
    
    setNewAgentName('');
    setNewAgentPhone('');
    setNewAgentWhatsapp('');
    setErrors({ phone: '', whatsapp: '' });
    setOpen(false);
  };

  const handleAgentClick = (agent: Agent) => {
    const allTxs = getStoredTransactions();
    const filtered = allTxs.filter(t => t.agent === agent.name);
    setAgentTxs(filtered); 
    setSelectedAgent(agent);
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

  const filteredAgents = agents.filter(a => a.name.includes(searchTerm));

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">المعقبين</h1>
          <p className="text-gray-500">إدارة قائمة المعقبين</p>
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <Input 
                placeholder="بحث عن معقب..." 
                className="pr-10 bg-[#eef2f6] shadow-3d-inset border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-blue-600 text-white px-6 rounded-xl font-bold shadow-3d hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    أضف معقب
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#eef2f6] shadow-3d border-none" dir="rtl">
                <DialogHeader><DialogTitle>إضافة معقب جديد</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>اسم المعقب</Label>
                        <Input 
                            value={newAgentName} 
                            onChange={(e) => setNewAgentName(e.target.value)} 
                            className="bg-white shadow-3d-inset border-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>رقم الجوال</Label>
                        <div className="relative flex items-center" dir="ltr">
                            <div className="absolute left-3 z-10 text-gray-400 font-bold text-sm pointer-events-none">+966</div>
                            <Input 
                                value={newAgentPhone} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setNewAgentPhone(val);
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
                                value={newAgentWhatsapp} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setNewAgentWhatsapp(val);
                                    if(errors.whatsapp) setErrors({...errors, whatsapp: ''});
                                }} 
                                className={`bg-white shadow-3d-inset border-none pl-14 text-left ${errors.whatsapp ? 'ring-2 ring-red-400' : ''}`}
                                placeholder="5xxxxxxxx"
                            />
                            <MessageCircle className="absolute right-3 w-4 h-4 text-green-500" />
                        </div>
                        {errors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.whatsapp}</p>}
                    </div>

                    <button onClick={handleAddAgent} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">حفظ</button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map(agent => (
            <div 
                key={agent.id} 
                onClick={() => handleAgentClick(agent)}
                className="bg-[#eef2f6] p-4 rounded-2xl shadow-3d hover:shadow-3d-hover cursor-pointer transition-all flex items-center justify-between gap-4 border border-white/50"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 text-lg">{agent.name}</h3>
                        <div className="flex gap-2 text-xs text-gray-400 mt-1">
                            {agent.phone && <span className="flex items-center gap-1" dir="ltr">+{agent.phone} <Phone className="w-3 h-3"/></span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {agent.phone && (
                        <button 
                            onClick={(e) => handlePhoneClick(e, agent.phone)}
                            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-3d hover:scale-110 transition-transform"
                        >
                            <Phone className="w-5 h-5" />
                        </button>
                    )}
                    {agent.whatsapp && (
                        <button 
                            onClick={(e) => handleWhatsAppClick(e, agent.whatsapp)}
                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-3d hover:scale-110 transition-transform"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="bg-[#eef2f6] shadow-3d border-none max-w-2xl" dir="rtl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-600" />
                    معاملات المعقب: {selectedAgent?.name}
                </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {agentTxs.length > 0 ? agentTxs.map(tx => (
                    <div key={tx.id} className="bg-white/50 p-3 rounded-xl flex justify-between items-center border border-white">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-700">{tx.type}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-orange-600">{tx.agentPrice} ر.س</p>
                            <p className={`text-[10px] font-bold ${tx.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`}>
                                {tx.status === 'completed' ? 'مكتملة' : 'قيد التنفيذ'}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">لا توجد معاملات مسجلة لهذا المعقب.</p>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
