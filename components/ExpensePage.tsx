
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../hooks/useAppData';
import type { Expense, ExpenseCategory } from '../types';

interface ExpensePageProps {
  category: ExpenseCategory;
  title: string;
}

const ExpenseForm: React.FC<{ category: ExpenseCategory }> = ({ category }) => {
  const context = useContext(AppContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && Number(amount) > 0) {
      context?.addExpense(category, { description, amount: Number(amount) });
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-200">הוספת הוצאה חדשה</h2>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">פירוט ההוצאה</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="למשל: קניות בסופר"
          className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:border-teal-500 focus:ring-teal-500 p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">סכום</label>
        <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
            <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:border-teal-500 focus:ring-teal-500 p-2 text-left pr-8"
            required
            />
        </div>
      </div>
      <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 active:scale-95">
        הוסף הוצאה
      </button>
    </form>
  );
};

const ExpenseList: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">לא נרשמו הוצאות עדיין.</p>
        <p className="text-gray-500 text-sm">התחילו על ידי הוספת הוצאה חדשה.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-700">
                <tr>
                    <th className="p-3 text-sm font-semibold text-gray-300">תאריך</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">פירוט</th>
                    <th className="p-3 text-sm font-semibold text-gray-300 text-left">סכום</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {expenses.map(expense => (
                    <tr key={expense.id}>
                    <td className="p-3 text-sm text-gray-400 whitespace-nowrap">
                        {new Date(expense.timestamp).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                        <br/>
                        {new Date(expense.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-gray-200">{expense.description}</td>
                    <td className="p-3 text-lg font-mono text-left text-red-400">₪{expense.amount.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export const ExpensePage: React.FC<ExpensePageProps> = ({ category, title }) => {
  const context = useContext(AppContext);

  if (!context || context.isLoading) return <div className="text-center p-8">טוען נתונים...</div>;

  const budget = context.data.budgets[category];
  const expenses = context.data.expenses[category];
  
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const balance = budget - totalExpenses;

  return (
    <div className="p-4 pt-8 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-teal-400">{title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-sm text-gray-400">תקציב</p>
          <p className="text-2xl font-bold text-green-400">₪{budget.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-sm text-gray-400">סה"כ הוצאות</p>
          <p className="text-2xl font-bold text-red-400">₪{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-sm text-gray-400">יתרה</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-orange-500'}`}>₪{balance.toLocaleString()}</p>
        </div>
      </div>
      
      <ExpenseForm category={category} />
      <ExpenseList expenses={expenses} />
    </div>
  );
};
