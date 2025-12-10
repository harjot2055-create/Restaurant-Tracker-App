import { GoogleGenAI } from "@google/genai";
import { Sale, Expense, MenuItem, InventoryItem } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBusinessInsight = async (
  sales: Sale[],
  expenses: Expense[],
  inventory: InventoryItem[],
  menu: MenuItem[]
): Promise<string> => {
  const ai = initGenAI();
  if (!ai) return "AI Service Unavailable: Missing API Key.";

  // Summarize data to avoid token limits
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  
  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold).map(i => i.name);
  
  // Get top selling items
  const itemCounts: Record<string, number> = {};
  sales.forEach(s => {
    s.items.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
    });
  });
  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count})`)
    .join(", ");

  const prompt = `
    Act as a senior restaurant consultant. Analyze the following data snapshot for a small family restaurant:
    
    - Total Revenue (All time): $${totalRevenue.toFixed(2)}
    - Total Expenses (All time): $${totalExpenses.toFixed(2)}
    - Net Profit: $${profit.toFixed(2)}
    - Top Selling Items: ${topItems || "No sales data yet"}
    - Low Stock Warnings: ${lowStockItems.length > 0 ? lowStockItems.join(", ") : "None"}
    
    Provide a concise, 3-bullet point executive summary.
    1. Highlight a positive trend or achievement.
    2. Identify a critical risk (especially regarding inventory or profit margins).
    3. Give one actionable specific recommendation to improve sales or cut costs next week.
    
    Keep the tone encouraging but professional. Use Markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your internet or API key.";
  }
};