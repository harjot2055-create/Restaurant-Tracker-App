import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SaleItem, Sale, MenuItem } from '../types';
import { Plus, Minus, CreditCard, Banknote, Trash } from 'lucide-react';

const Sales: React.FC = () => {
  const { menu, addSale, sales } = useApp();
  const [currentOrder, setCurrentOrder] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Card');

  const addToOrder = (item: MenuItem) => {
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => 
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, priceAtSale: item.price }];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCurrentOrder(prev => {
      return prev.map(item => {
        if (item.menuItemId === menuItemId) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = currentOrder.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);

  const handleCheckout = () => {
    if (cartTotal === 0) return;
    addSale({
      timestamp: Date.now(),
      items: currentOrder,
      totalAmount: cartTotal,
      paymentMethod
    });
    setCurrentOrder([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Menu Selection */}
      <div className="lg:col-span-2 overflow-y-auto pr-2 pb-20 lg:pb-0">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Select Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => addToOrder(item)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-emerald-100 transition-all text-left flex flex-col justify-between h-28"
            >
              <span className="font-semibold text-slate-700 line-clamp-2">{item.name}</span>
              <span className="text-emerald-600 font-bold">${item.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Summary */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800">Current Order</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentOrder.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <p>Basket is empty</p>
            </div>
          ) : (
            currentOrder.map(item => (
              <div key={item.menuItemId} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-700 text-sm">{item.name}</p>
                  <p className="text-slate-500 text-xs">${item.priceAtSale.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><Minus size={14}/></button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Plus size={14}/></button>
                </div>
                <div className="w-16 text-right font-medium text-slate-800">
                  ${(item.priceAtSale * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between text-slate-600 mb-2">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-800 mb-6">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={() => setPaymentMethod('Card')}
              className={`p-3 rounded-lg flex items-center justify-center gap-2 border transition-colors ${paymentMethod === 'Card' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-500'}`}
            >
              <CreditCard size={18} /> Card
            </button>
            <button 
               onClick={() => setPaymentMethod('Cash')}
               className={`p-3 rounded-lg flex items-center justify-center gap-2 border transition-colors ${paymentMethod === 'Cash' ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-500'}`}
            >
              <Banknote size={18} /> Cash
            </button>
          </div>

          <button
            disabled={currentOrder.length === 0}
            onClick={handleCheckout}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;