import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Utensils, Package, DollarSign, Menu as MenuIcon, X, LogOut, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/sales', label: 'New Sale (POS)', icon: ShoppingCart },
    { to: '/menu', label: 'Menu Items', icon: Utensils },
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/expenses', label: 'Expenses', icon: DollarSign },
  ];

  const getTitle = () => {
    const current = navItems.find(item => item.to === location.pathname);
    return current ? current.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#fdf8f6]"> 
      {/* Desktop Sidebar - Deep Red theme for Akbar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#4a0404] text-white border-r border-[#7f1d1d] shadow-2xl">
        <div className="p-8 text-center border-b border-[#7f1d1d]/50">
          <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-500">
             <ChefHat className="text-amber-500" size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-500 tracking-wide">
            AKBAR
          </h1>
          <p className="text-amber-200/60 text-[10px] uppercase tracking-widest mt-1">Indian Restaurant</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7f1d1d] text-amber-400 border-l-4 border-amber-500 shadow-md'
                    : 'text-amber-100/60 hover:bg-[#5e0a0a] hover:text-amber-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? "text-amber-400" : "text-amber-100/40"} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#7f1d1d]/50 bg-[#380303]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-amber-200/60 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#4a0404] text-white z-50 flex items-center justify-between px-4 shadow-md">
        <h1 className="font-serif font-bold text-amber-500 text-xl tracking-wider">AKBAR</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-amber-100">
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#4a0404] pt-20 px-6">
           <nav className="space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-colors border-b border-[#7f1d1d] ${
                  isActive
                    ? 'text-amber-500 font-bold'
                    : 'text-amber-100/70'
                }`
              }
            >
              <item.icon size={24} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 w-full text-red-300 mt-8"
          >
            <LogOut size={24} />
            <span>Sign Out</span>
          </button>
        </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="hidden md:flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
             <div>
                <h2 className="text-3xl font-serif font-bold text-[#4a0404]">{getTitle()}</h2>
                <p className="text-stone-500 text-sm mt-1">Welcome back, Manager.</p>
             </div>
             <div className="text-right">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Akbar Baltimore</p>
                <p className="text-stone-400 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;