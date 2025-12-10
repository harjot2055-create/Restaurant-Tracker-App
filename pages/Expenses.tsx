import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';
import { Plus, DollarSign, Store, ShoppingBag, Zap, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

const Expenses: React.FC = () => {
  const { expenses, addExpense } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    category: 'Grocery'
  });

  const categories = ['Grocery', 'Supplies', 'Utilities', 'Rent', 'Salaries', 'Maintenance', 'Marketing', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.description && newExpense.amount) {
      addExpense({
        description: newExpense.description,
        amount: Number(newExpense.amount),
        category: newExpense.category || 'Other',
        timestamp: Date.now()
      });
      setNewExpense({ description: '', amount: 0, category: 'Grocery' });
      setIsAdding(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Grocery': return <ShoppingBag size={16} className="text-green-600"/>;
      case 'Utilities': return <Zap size={16} className="text-yellow-600"/>;
      case 'Rent': return <Store size={16} className="text-blue-600"/>;
      case 'Salaries': return <Briefcase size={16} className="text-purple-600"/>;
      default: return <DollarSign size={16} className="text-stone-500"/>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#4a0404]">Expense Tracking</h2>
          <p className="text-stone-500">Log invoices, grocery runs, and utility bills.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-900 transition-colors shadow-sm"
        >
          <Plus size={20} /> Record Expense
        </button>
      </div>

       {isAdding && (
         <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-800 animate-slide-in-down">
          <h3 className="font-serif font-bold mb-4 text-lg text-[#4a0404]">New Expense Entry</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border border-stone-300 rounded-lg"
                placeholder="e.g. Patel Brothers Weekly Run"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <select 
                className="w-full p-2 border border-stone-300 rounded-lg"
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full p-2 border border-stone-300 rounded-lg"
                value={newExpense.amount || ''}
                onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
              />
            </div>
             <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900">Save Record</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-b border-stone-100 bg-stone-50 text-stone-500 font-medium text-sm tracking-wider uppercase">
           <div>Date</div>
           <div>Description</div>
           <div>Category</div>
           <div className="text-right">Amount</div>
        </div>
        <div className="divide-y divide-stone-100">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-stone-400">No expenses recorded.</div>
          ) : (
            expenses.sort((a,b) => b.timestamp - a.timestamp).map(exp => (
              <div key={exp.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 items-center hover:bg-stone-50 transition-colors">
                <div className="text-stone-600 text-sm">{format(new Date(exp.timestamp), 'MMM dd, yyyy')}</div>
                <div className="font-medium text-stone-800">{exp.description}</div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-stone-100">{getCategoryIcon(exp.category)}</span>
                  <span className="text-stone-600 text-sm">{exp.category}</span>
                </div>
                <div className="text-right font-bold text-red-700 flex items-center justify-end gap-1">
                   -${exp.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;