export enum Category {
  PIZZA = 'Naan Pizza',
  APPETIZER = 'Appetizer',
  CHICKEN = 'Chicken',
  LAMB = 'Lamb',
  SEAFOOD = 'Seafood',
  VEGETARIAN = 'Vegetarian',
  RICE = 'Rice',
  BREAD = 'Indian Bread',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  OTHER = 'Other'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  cost: number; // Cost to produce
  category: Category;
  description?: string;
}

export interface SaleItem {
  menuItemId: string;
  name: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  timestamp: number; // Unix timestamp
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
}

export interface Expense {
  id: string;
  timestamp: number;
  description: string;
  amount: number;
  category: string;
}

// Chart Data Types
export interface DailySalesData {
  date: string;
  revenue: number;
  profit: number;
}

export interface CategoryData {
  name: string;
  value: number;
}