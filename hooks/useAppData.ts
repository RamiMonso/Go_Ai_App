
import { useState, useEffect, createContext, useRef } from 'react';
import type { AppData, AppContextType, Budgets, Expense, ExpenseCategory } from '../types';

const LOCAL_STORAGE_KEY = 'expense-tracker-data';

const initialData: AppData = {
  budgets: {
    week1: 0,
    week2: 0,
    week3: 0,
    week4: 0,
    week5: 0,
    misc: 0,
  },
  expenses: {
    week1: [],
    week2: [],
    week3: [],
    week4: [],
    week5: [],
    misc: [],
  },
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppData = () => {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(initialData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [data, isLoading]);

  const triggerSaveIndicator = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowSaved(true);
    timeoutRef.current = window.setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  };

  const addExpense = (category: ExpenseCategory, expense: Omit<Expense, 'id' | 'timestamp'>) => {
    const newExpense: Expense = {
      ...expense,
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toISOString(),
    };
    setData(prevData => ({
      ...prevData,
      expenses: {
        ...prevData.expenses,
        [category]: [newExpense, ...prevData.expenses[category]],
      },
    }));
    triggerSaveIndicator();
  };

  const setBudgets = (newBudgets: Budgets) => {
    setData(prevData => ({
      ...prevData,
      budgets: newBudgets,
    }));
    triggerSaveIndicator();
  };

  const resetData = () => {
    setData(initialData);
  };

  return { data, addExpense, setBudgets, resetData, isLoading, showSaved };
};