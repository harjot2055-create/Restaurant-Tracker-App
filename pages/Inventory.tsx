import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';
import { Plus, Minus, AlertTriangle, Search } from 'lucide-react';

const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryQuantity } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    quantity: 0,
    unit: 'pcs',
    minThreshold: 10
  });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newItem.name) {
      addInventoryItem({
        name: newItem.name,
        quantity: Number(newItem.quantity),
        unit: newItem.unit || 'pcs',
        minThreshold: Number(newItem.minThreshold)
      });
      setNewItem({ name: '', quantity: 0, unit: 'pcs', minThreshold: 10 });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
          <p className="text-slate-500">Track stock levels and get alerts for re-ordering.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
        >
          <Plus size={20} /> Add Stock Item
        </button>
      </div>

      {isAdding && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-slide-in-down">
          <h3 className="font-semibold mb-4 text-lg">Add New Inventory Item</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Qty</label>
              <input 
                type="number" 
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newItem.quantity}
                onChange={e => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit (kg, pcs)</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newItem.unit}
                onChange={e => setNewItem({...newItem, unit: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alert Threshold</label>
              <input 
                type="number" 
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newItem.minThreshold}
                onChange={e => setNewItem({...newItem, minThreshold: parseFloat(e.target.value)})}
              />
            </div>
             <div className="md:col-span-4 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search inventory..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Item Name</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Quantity</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.map(item => {
              const isLow = item.quantity <= item.minThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{item.name}</td>
                  <td className="p-4">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.quantity}
                    </span> 
                    <span className="text-slate-400 text-sm ml-1">{item.unit}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                       <button 
                        onClick={() => updateInventoryQuantity(item.id, -1)}
                        className="p-1 text-slate-500 hover:bg-slate-200 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <button 
                        onClick={() => updateInventoryQuantity(item.id, 1)}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">No inventory items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;