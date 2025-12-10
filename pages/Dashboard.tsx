import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateBusinessInsight } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { sales, expenses, inventory, menu } = useApp();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // KPIS
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const lowStockCount = inventory.filter(i => i.quantity <= i.minThreshold).length;

  // Chart Data Preparation
  const last7DaysData = useMemo(() => {
    const days = 7;
    const data: any[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = format(d, 'MMM dd');
      
      // Filter sales for this day
      const daySales = sales.filter(s => {
        const saleDate = new Date(s.timestamp);
        return format(saleDate, 'MMM dd') === dateStr;
      });
      
      const rev = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      data.push({ name: dateStr, revenue: rev });
    }
    return data;
  }, [sales]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    sales.forEach(s => {
      s.items.forEach(item => {
        // Find category from menu (hacky lookup for demo)
        const menuItem = menu.find(m => m.id === item.menuItemId);
        const catName = menuItem?.category || 'Other';
        cats[catName] = (cats[catName] || 0) + item.quantity;
      });
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [sales, menu]);

  // Akbar Theme Colors: Saffron, Green, Deep Red, Blue
  const COLORS = ['#f59e0b', '#10b981', '#7f1d1d', '#3b82f6', '#8b5cf6', '#ec4899'];

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const text = await generateBusinessInsight(sales, expenses, inventory, menu);
    setInsight(text);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-[#4a0404] to-[#7f1d1d] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-900">
        <div>
          <h2 className="text-2xl font-serif font-bold flex items-center gap-2 text-amber-500">
            <Sparkles className="text-amber-300" /> 
            Manager's Assistant
          </h2>
          <p className="text-amber-100/80 mt-1">AI analysis for Akbar's daily operations.</p>
        </div>
        <button 
          onClick={handleGetInsight}
          disabled={loadingAi}
          className="bg-amber-500 text-[#4a0404] px-6 py-2.5 rounded-lg font-bold hover:bg-amber-400 transition-all disabled:opacity-70 shadow-lg"
        >
          {loadingAi ? 'Analyzing...' : 'Generate Daily Report'}
        </button>
      </div>

      {insight && (
        <div className="bg-white border-l-4 border-amber-500 rounded-r-xl p-6 shadow-sm animate-fade-in">
          <h3 className="font-semibold text-[#4a0404] mb-3 text-lg font-serif">Executive Summary</h3>
          <div className="prose prose-stone max-w-none text-stone-600">
             <div dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b class="text-[#7f1d1d]">$1</b>') }} />
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Total Revenue</p>
              <h3 className="text-3xl font-serif font-bold text-stone-800 mt-2">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-700 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Net Profit</p>
              <h3 className={`text-3xl font-serif font-bold mt-2 ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${profit.toFixed(2)}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {profit >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Sales Count</p>
              <h3 className="text-3xl font-serif font-bold text-stone-800 mt-2">{sales.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Inventory Alerts</p>
              <h3 className="text-3xl font-serif font-bold text-stone-800 mt-2">{lowStockCount}</h3>
            </div>
            <div className={`p-3 rounded-lg ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <AlertCircle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-96">
          <h3 className="font-bold text-[#4a0404] mb-6 font-serif">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-96">
          <h3 className="font-bold text-[#4a0404] mb-6 font-serif">Popular Categories</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
           {/* Legend */}
           <div className="flex justify-center flex-wrap gap-4 mt-2">
            {categoryData.slice(0, 5).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-stone-600">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;