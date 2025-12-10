import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, MenuItem } from '../types';
import { Plus, Trash2, Utensils, Pizza, Coffee, Bean } from 'lucide-react';

const Menu: React.FC = () => {
  const { menu, addMenuItem, deleteMenuItem } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    cost: 0,
    category: Category.CHICKEN,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      addMenuItem({
        name: newItem.name,
        price: Number(newItem.price),
        cost: Number(newItem.cost || 0),
        category: newItem.category as Category,
        description: newItem.description
      });
      setNewItem({ name: '', price: 0, cost: 0, category: Category.CHICKEN, description: '' });
      setIsAdding(false);
    }
  };

  const filteredMenu = filter === 'ALL' ? menu : menu.filter(m => m.category === filter);

  // Group items by category for the ALL view
  const groupedMenu = Object.values(Category).reduce((acc, cat) => {
    const items = menu.filter(m => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          <button 
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'ALL' ? 'bg-[#4a0404] text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
          >
            All Items
          </button>
          {Object.values(Category).map(cat => (
             <button 
             key={cat}
             onClick={() => setFilter(cat)}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === cat ? 'bg-[#4a0404] text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
          >
            {cat}
          </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-md whitespace-nowrap"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500 animate-slide-in-down">
          <h3 className="font-serif font-bold mb-4 text-xl text-[#4a0404]">Add New Menu Item</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Item Name</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <select 
                className="w-full p-2 border border-stone-300 rounded-lg"
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Selling Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full p-2 border border-stone-300 rounded-lg"
                value={newItem.price || ''}
                onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Cost to Make ($)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full p-2 border border-stone-300 rounded-lg"
                value={newItem.cost || ''}
                onChange={e => setNewItem({...newItem, cost: parseFloat(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea 
                className="w-full p-2 border border-stone-300 rounded-lg"
                rows={2}
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-[#4a0404] text-white rounded-lg hover:bg-[#680b0b]"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Items */}
      <div className="space-y-8">
        {filter === 'ALL' ? (
          Object.entries(groupedMenu).map(([cat, items]) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-xl font-serif font-bold text-[#4a0404] border-b border-amber-200 pb-2 flex items-center gap-2">
                {cat === Category.PIZZA && <Pizza className="text-amber-600" size={24} />}
                {cat === Category.BEVERAGE && <Coffee className="text-amber-600" size={24} />}
                {cat === Category.VEGETARIAN && <Bean className="text-amber-600" size={24} />}
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => <MenuCard key={item.id} item={item} onDelete={deleteMenuItem} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map(item => <MenuCard key={item.id} item={item} onDelete={deleteMenuItem} />)}
          </div>
        )}

        {menu.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
            <Utensils size={48} className="mx-auto mb-4 opacity-50" />
            <p>No items in the menu yet. Click "Add Item" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard: React.FC<{ item: MenuItem, onDelete: (id: string) => void }> = ({ item, onDelete }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
    <div>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider
          ${item.category === Category.PIZZA ? 'bg-amber-100 text-amber-800' : 
            item.category === Category.VEGETARIAN ? 'bg-green-100 text-green-800' : 
            item.category === Category.LAMB || item.category === Category.CHICKEN ? 'bg-red-50 text-red-800' : 'bg-stone-100 text-stone-600'}`}>
          {item.category}
        </span>
        <span className="font-bold text-[#4a0404] text-lg font-serif">${item.price.toFixed(2)}</span>
      </div>
      <h3 className="font-bold text-stone-800 text-lg leading-tight">{item.name}</h3>
      <p className="text-stone-500 text-xs mt-2 leading-relaxed">{item.description || 'No description provided.'}</p>
    </div>
    <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
       <span className="text-[10px] text-stone-400">Cost: ${item.cost.toFixed(2)}</span>
       <button 
        onClick={() => onDelete(item.id)}
        className="text-stone-300 hover:text-red-600 transition-colors p-1"
       >
         <Trash2 size={16} />
       </button>
    </div>
  </div>
);

export default Menu;