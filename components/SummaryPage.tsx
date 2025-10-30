import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../hooks/useAppData';
import type { Expense } from '../types';

const StatCard: React.FC<{ title: string; value: number; color: string; currency?: boolean; }> = ({ title, value, color, currency = true }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
    <h2 className="text-lg font-semibold text-gray-400 mb-2">{title}</h2>
    <p className={`text-4xl font-bold ${color}`}>
      {currency && '₪'}{value.toLocaleString()}
    </p>
  </div>
);


export const SummaryPage: React.FC = () => {
  const context = useContext(AppContext);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentMonth = useMemo(() => new Date().toLocaleString('he-IL', { month: 'long', year: 'numeric' }), []);

  if (!context || context.isLoading) return <div className="text-center p-8">טוען נתונים...</div>;

  const { budgets, expenses } = context.data;

  // Fix: Explicitly type accumulator and value in reduce to prevent TypeScript from inferring them as 'unknown'.
  const totalBudget = Object.values(budgets).reduce((sum: number, b: number) => sum + b, 0);
  // Fix: Explicitly type accumulator and value in reduce to correctly access 'e.amount'.
  const totalExpenses = Object.values(expenses)
    .flat()
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);
  const remainingBalance = totalBudget - totalExpenses;

  const handleReset = () => {
    context.resetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="p-4 pt-8 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-400">סיכום חודשי</h1>
        <p className="text-lg text-gray-400">{currentMonth}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="תקציב כולל" value={totalBudget} color="text-green-400" />
        <StatCard title="סה״כ הוצאות" value={totalExpenses} color="text-red-400" />
        <StatCard title="יתרה כוללת" value={remainingBalance} color={remainingBalance >= 0 ? 'text-blue-400' : 'text-orange-500'} />
      </div>

      <div className="pt-4">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform duration-200 active:scale-95"
        >
          איפוס כל הנתונים
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">אישור איפוס נתונים</h3>
            <p className="text-gray-300 mb-6">האם אתה בטוח? פעולה זו תמחק את כל התקציבים וההוצאות שהזנת. לא ניתן לשחזר את הנתונים.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                ביטול
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                אפס נתונים
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
