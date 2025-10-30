import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../hooks/useAppData';
import type { Budgets } from '../types';

export const BudgetPage: React.FC = () => {
  const context = useContext(AppContext);
  const [localBudgets, setLocalBudgets] = useState<Budgets>({
    week1: 0, week2: 0, week3: 0, week4: 0, week5: 0, misc: 0
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (context && !context.isLoading) {
      setLocalBudgets(context.data.budgets);
    }
  }, [context]);

  if (!context || context.isLoading) return <div className="text-center p-8">טוען נתונים...</div>;

  const handleBudgetChange = (category: keyof Budgets, value: string) => {
    const amount = Number(value) >= 0 ? Number(value) : 0;
    setLocalBudgets(prev => ({ ...prev, [category]: amount }));
    setIsSaved(false);
  };

  const handleSave = () => {
    context.setBudgets(localBudgets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Fix: Explicitly type accumulator and value in reduce to prevent TypeScript from inferring them as 'unknown'.
  const totalBudget = Object.values(localBudgets).reduce((sum: number, val: number) => sum + val, 0);
  
  const weekLabels: { key: keyof Budgets; label: string }[] = [
    { key: 'week1', label: 'שבוע 1' },
    { key: 'week2', label: 'שבוע 2' },
    { key: 'week3', label: 'שבוע 3' },
    { key: 'week4', label: 'שבוע 4' },
    { key: 'week5', label: 'שבוע 5' },
    { key: 'misc', label: 'הוצאות שונות' },
  ];

  return (
    <div className="p-4 pt-8 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-teal-400">הגדרת תקציב חודשי</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        {weekLabels.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <label htmlFor={key} className="text-lg font-medium text-gray-300">{label}</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
              <input
                id={key}
                type="number"
                value={localBudgets[key] === 0 ? '' : localBudgets[key]}
                onChange={(e) => handleBudgetChange(key, e.target.value)}
                placeholder="0"
                className="w-32 bg-gray-700 text-white text-lg font-semibold rounded-md border-2 border-gray-600 focus:border-teal-500 focus:ring-teal-500 p-2 text-left pr-8"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
        <span className="text-xl font-bold text-gray-300">סך הכל תקציב:</span>
        <span className="text-2xl font-bold text-teal-400">₪{totalBudget.toLocaleString()}</span>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform duration-200 active:scale-95"
      >
        {isSaved ? 'נשמר בהצלחה!' : 'שמור תקציב'}
      </button>
    </div>
  );
};
