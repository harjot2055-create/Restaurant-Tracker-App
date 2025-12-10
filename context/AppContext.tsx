import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Sale, Expense, InventoryItem, Category } from '../types';

interface AppContextType {
  menu: MenuItem[];
  sales: Sale[];
  inventory: InventoryItem[];
  expenses: Expense[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryQuantity: (id: string, delta: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  checkPin: (pin: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Akbar Menu Data
const INITIAL_MENU: MenuItem[] = [
  // Naan Pizzas
  { id: 'p1', name: 'Lamb Keema Pizza', price: 14.95, cost: 4.50, category: Category.PIZZA, description: 'Minced lamb on a naan base, green peppers, onions, spices.' },
  { id: 'p2', name: 'Makhani Pizza', price: 14.95, cost: 4.00, category: Category.PIZZA, description: 'Naan base with Makhani sauce, peppers, onions. Choice of Chicken/Paneer.' },
  { id: 'p3', name: 'Tikka Masala Pizza', price: 14.95, cost: 4.25, category: Category.PIZZA, description: 'Spicy Tikka sauce base on naan with mozzarella and cilantro.' },
  
  // Appetizers
  { id: 'a1', name: 'Vegetable Samosa', price: 6.95, cost: 1.50, category: Category.APPETIZER, description: 'Crispy turnovers filled with potatoes and peas.' },
  { id: 'a2', name: 'Chicken Pakora', price: 8.50, cost: 2.50, category: Category.APPETIZER, description: 'Chicken fritters fried in gram flour batter.' },
  { id: 'a3', name: 'Fish Pakora', price: 12.95, cost: 4.00, category: Category.APPETIZER, description: 'Fish marinated in spices and fried.' },

  // Chicken Specialties
  { id: 'c1', name: 'Chicken Tikka Masala', price: 19.95, cost: 5.50, category: Category.CHICKEN, description: 'Roasted chicken in creamy tomato sauce.' },
  { id: 'c2', name: 'Chicken Makhani', price: 18.99, cost: 5.00, category: Category.CHICKEN, description: 'Butter chicken cooked in a rich tomato gravy.' },
  { id: 'c3', name: 'Chicken Vindaloo', price: 18.99, cost: 5.00, category: Category.CHICKEN, description: 'Goan style spicy curry with potatoes.' },

  // Lamb
  { id: 'l1', name: 'Lamb Rogan Josh', price: 20.99, cost: 6.50, category: Category.LAMB, description: 'Kashmiri style lamb curry with yogurt and saffron.' },
  { id: 'l2', name: 'Lamb Korma', price: 21.99, cost: 7.00, category: Category.LAMB, description: 'Lamb cooked in a mild cashew nut sauce.' },

  // Vegetarian
  { id: 'v1', name: 'Palak Paneer', price: 17.95, cost: 4.00, category: Category.VEGETARIAN, description: 'Fresh spinach cooked with homemade cottage cheese.' },
  { id: 'v2', name: 'Dal Makhani', price: 17.95, cost: 3.50, category: Category.VEGETARIAN, description: 'Black lentils cooked with butter and cream.' },
  { id: 'v3', name: 'Malai Kofta', price: 17.95, cost: 4.00, category: Category.VEGETARIAN, description: 'Vegetable balls in a rich creamy sauce.' },

  // Breads
  { id: 'b1', name: 'Plain Naan', price: 3.50, cost: 0.50, category: Category.BREAD, description: 'Leavened white flour bread baked in clay oven.' },
  { id: 'b2', name: 'Garlic Naan', price: 4.00, cost: 0.75, category: Category.BREAD, description: 'Naan topped with fresh garlic and cilantro.' },

  // Drinks/Desserts
  { id: 'd1', name: 'Mango Lassi', price: 5.50, cost: 1.50, category: Category.BEVERAGE, description: 'Refreshing yogurt drink with mango pulp.' },
  { id: 'ds1', name: 'Gulab Jamun', price: 5.50, cost: 1.00, category: Category.DESSERT, description: 'Fried milk balls soaked in honey syrup.' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Basmati Rice', quantity: 150, unit: 'lbs', minThreshold: 50 },
  { id: '2', name: 'Boneless Chicken', quantity: 45, unit: 'lbs', minThreshold: 20 },
  { id: '3', name: 'Lamb Meat', quantity: 30, unit: 'lbs', minThreshold: 15 },
  { id: '4', name: 'Paneer Blocks', quantity: 25, unit: 'lbs', minThreshold: 10 },
  { id: '5', name: 'Naan Dough Balls', quantity: 80, unit: 'pcs', minThreshold: 30 },
  { id: '6', name: 'Makhani Sauce Base', quantity: 5, unit: 'gallons', minThreshold: 2 },
  { id: '7', name: 'Mozzarella Cheese', quantity: 15, unit: 'lbs', minThreshold: 5 }, // For Pizzas
  { id: '8', name: 'Cooking Oil', quantity: 10, unit: 'gallons', minThreshold: 4 },
  { id: '9', name: 'Spices (Garam Masala)', quantity: 5, unit: 'lbs', minThreshold: 1 },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', timestamp: Date.now() - 86400000 * 2, description: 'Restaurant Depot - Weekly Grocery', amount: 1250.00, category: 'Grocery' },
  { id: '2', timestamp: Date.now() - 86400000 * 5, description: 'Patel Brothers - Spices & Produce', amount: 345.50, category: 'Grocery' },
  { id: '3', timestamp: Date.now() - 86400000 * 10, description: 'BGE - Electric & Gas', amount: 850.00, category: 'Utilities' },
  { id: '4', timestamp: Date.now() - 86400000 * 1, description: 'Sysco - Paper Goods', amount: 180.00, category: 'Supplies' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('resto_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('resto_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('resto_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('resto_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('resto_auth') === 'true';
  });

  useEffect(() => localStorage.setItem('resto_menu', JSON.stringify(menu)), [menu]);
  useEffect(() => localStorage.setItem('resto_sales', JSON.stringify(sales)), [sales]);
  useEffect(() => localStorage.setItem('resto_inventory', JSON.stringify(inventory)), [inventory]);
  useEffect(() => localStorage.setItem('resto_expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem('resto_auth', String(isAuthenticated)), [isAuthenticated]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setMenu(prev => [...prev, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { ...sale, id: crypto.randomUUID() };
    setSales(prev => [newSale, ...prev]);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryQuantity = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const CORRECT_PIN = '2015';

  const checkPin = (pin: string) => {
    return pin === CORRECT_PIN;
  }

  const login = (pin: string) => {
    if (checkPin(pin)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AppContext.Provider value={{
      menu, sales, inventory, expenses,
      addMenuItem, deleteMenuItem, addSale,
      addInventoryItem, updateInventoryQuantity, addExpense,
      isAuthenticated, login, checkPin, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};