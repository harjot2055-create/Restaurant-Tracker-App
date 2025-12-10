import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import { Lock, Smartphone, ArrowRight, Loader } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login, checkPin } = useApp();
  const [step, setStep] = useState<'PIN' | '2FA'>('PIN');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA Logic
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPin(pin)) {
      setIsLoading(true);
      setError('');
      // Simulate API call to send SMS
      setTimeout(() => {
        setIsLoading(false);
        setStep('2FA');
      }, 1500);
    } else {
      setError('Incorrect PIN. Try 2015.');
      setPin('');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification - simplified for portfolio
    if (otp === '123456') {
      login(pin); // Authenticate
    } else {
      setError('Invalid code. For demo use: 123456');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen bg-[#4a0404] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>

      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative z-10 border border-amber-500/30">
        
        {step === 'PIN' ? (
          <>
            <div className="text-center mb-8">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-500">
                <Lock className="text-amber-600" size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#4a0404]">Manager Access</h1>
              <p className="text-stone-500">Enter your secure PIN to continue.</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full text-center text-4xl tracking-widest p-4 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:ring-0 outline-none transition-colors"
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <p className="text-red-500 text-center text-sm font-medium animate-pulse">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4a0404] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#680b0b] transition-all shadow-lg shadow-[#4a0404]/30 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader className="animate-spin" /> : <>Next <ArrowRight size={20} /></>}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8 animate-fade-in">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500">
                <Smartphone className="text-blue-600" size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#4a0404]">Two-Step Verification</h1>
              <p className="text-stone-500">We sent a code to <span className="font-bold text-stone-800">***-***-8892</span></p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-slide-in-up">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError('');
                  }}
                  className="w-full text-center text-3xl tracking-widest p-4 border-2 border-stone-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors font-mono"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>
              
              <div className="text-center">
                 {error && (
                  <p className="text-red-500 text-center text-sm font-medium mb-2">
                    {error}
                  </p>
                )}
                 <p className="text-xs text-stone-400">Demo Code: <span className="font-bold text-stone-600">123456</span></p>
              </div>

              <div className="flex gap-3">
                 <button
                  type="button"
                  onClick={() => {
                    setStep('PIN');
                    setPin('');
                    setOtp('');
                    setError('');
                  }}
                  className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                >
                  Verify & Login
                </button>
              </div>
            </form>
          </>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400">Akbar Management System • Secure Access</p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <LoginScreen />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;