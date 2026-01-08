import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck, Plus, Search, FileText } from 'lucide-react';
import { getStoredAgents, saveStoredAgents, Agent, getStoredTransactions, Transaction } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function AgentsPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [newAgentName, setNewAgentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentTxs, setAgentTxs] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAgents(getStoredAgents());
  }, []);

  const handleAddAgent = () => {
    if (!newAgentName.trim()) return;
    const newAgent: Agent = {
      id: Date.now(),
      name: newAgentName,
      createdAt: Date.now()
    };
    const updated = [newAgent, ...agents];
    setAgents(updated);
    saveStoredAgents(updated);
    setNewAgentName('');
    setOpen(false);
  };

  const handleAgentClick = (agent: Agent) => {
    const allTxs = getStoredTransactions();
    // Filter transactions by Agent Name
    const filtered = allTxs.filter(t => t.agent === agent.name);
    setAgentTxs(filtered); 
    setSelectedAgent(agent);
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
                className="bg-[#eef2f6] p-4 rounded-2xl shadow-3d hover:shadow-3d-hover cursor-pointer transition-all flex items-center gap-4 border border-white/50"
            >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-700 text-lg">{agent.name}</h3>
            </div>
        ))}
      </div>

      {/* Agent Details Dialog */}
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
