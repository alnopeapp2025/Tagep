import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Calendar, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';
import { getStoredTransactions, Transaction } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalValue: 0,
    weekValue: 0,
    monthValue: 0,
    agentsTotal: 0,
    monthProfit: 0
  });

  useEffect(() => {
    const txs = getStoredTransactions();
    calculateStats(txs);
  }, []);

  const calculateStats = (txs: Transaction[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime(); // Start of week (Sunday)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let todayC = 0, weekC = 0, monthC = 0;
    let compC = 0, cancC = 0;
    let totalV = 0, weekV = 0, monthV = 0;
    let agentsV = 0;
    let monthRev = 0, monthCost = 0;

    txs.forEach(t => {
      const tDate = t.createdAt;
      const clientPrice = parseFloat(t.clientPrice) || 0;
      const agentPrice = parseFloat(t.agentPrice) || 0;

      // Counts
      if (tDate >= startOfDay) todayC++;
      if (tDate >= startOfWeek) weekC++;
      if (tDate >= startOfMonth) monthC++;

      if (t.status === 'completed') compC++;
      if (t.status === 'cancelled') cancC++;

      // Values (Revenue)
      totalV += clientPrice;
      if (tDate >= startOfWeek) weekV += clientPrice;
      if (tDate >= startOfMonth) monthV += clientPrice;

      // Agent Totals (Cost)
      agentsV += agentPrice;

      // Monthly Profit Calculation (Revenue - Cost for this month)
      if (tDate >= startOfMonth) {
        monthRev += clientPrice;
        monthCost += agentPrice;
      }
    });

    setStats({
      todayCount: todayC,
      weekCount: weekC,
      monthCount: monthC,
      completedCount: compC,
      cancelledCount: cancC,
      totalValue: totalV,
      weekValue: weekV,
      monthValue: monthV,
      agentsTotal: agentsV,
      monthProfit: monthRev - monthCost
    });
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-[#eef2f6] rounded-2xl shadow-3d p-5 flex items-center gap-4 border border-white/50">
      <div className={`w-12 h-12 rounded-xl shadow-3d-inset flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold mb-1">{title}</p>
        <h3 className="text-xl font-black text-gray-800">{value}</h3>
        {subText && <p className="text-[10px] text-gray-400">{subText}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">التقارير والإحصائيات</h1>
          <p className="text-gray-500">نظرة شاملة على أداء المكتب</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="معاملات اليوم" 
            value={stats.todayCount} 
            icon={Calendar} 
            colorClass="text-blue-500" 
        />
        <StatCard 
            title="معاملات الأسبوع" 
            value={stats.weekCount} 
            icon={Calendar} 
            colorClass="text-indigo-500" 
        />
        <StatCard 
            title="معاملات الشهر" 
            value={stats.monthCount} 
            icon={Calendar} 
            colorClass="text-purple-500" 
        />
        <StatCard 
            title="أرباح الشهر الصافية" 
            value={`${stats.monthProfit.toLocaleString()} ر.س`} 
            icon={DollarSign} 
            colorClass="text-green-600" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="تم الإنجاز" 
            value={stats.completedCount} 
            icon={CheckCircle} 
            colorClass="text-green-500" 
            subText="إجمالي المعاملات المكتملة"
        />
        <StatCard 
            title="تم الإلغاء" 
            value={stats.cancelledCount} 
            icon={XCircle} 
            colorClass="text-red-500" 
            subText="إجمالي المعاملات الملغاة"
        />
        <StatCard 
            title="مجموع حساب المعقبين" 
            value={`${stats.agentsTotal.toLocaleString()} ر.س`} 
            icon={Users} 
            colorClass="text-orange-500" 
            subText="المبالغ المستحقة للمعقبين"
        />
      </div>

      <h3 className="text-xl font-bold text-gray-700 mb-4">القيم المالية</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 text-white rounded-3xl shadow-3d p-6 text-center">
            <p className="opacity-80 mb-2 font-medium">قيمة معاملات الأسبوع</p>
            <h2 className="text-3xl font-black">{stats.weekValue.toLocaleString()} ر.س</h2>
        </div>
        <div className="bg-indigo-600 text-white rounded-3xl shadow-3d p-6 text-center">
            <p className="opacity-80 mb-2 font-medium">قيمة معاملات الشهر</p>
            <h2 className="text-3xl font-black">{stats.monthValue.toLocaleString()} ر.س</h2>
        </div>
        <div className="bg-gray-800 text-white rounded-3xl shadow-3d p-6 text-center">
            <p className="opacity-80 mb-2 font-medium">قيمة كل المعاملات</p>
            <h2 className="text-3xl font-black">{stats.totalValue.toLocaleString()} ر.س</h2>
        </div>
      </div>

    </div>
  );
}
