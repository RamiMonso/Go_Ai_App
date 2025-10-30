
export interface Expense {
  id: string;
  description: string;
  amount: number;
  timestamp: string;
}

export type ExpenseCategory = 'week1' | 'week2' | 'week3' | 'week4' | 'week5' | 'misc';

export interface Budgets {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  misc: number;
}

export interface AppData {
  budgets: Budgets;
  expenses: Record<ExpenseCategory, Expense[]>;
}

export type Page = 'budget' | ExpenseCategory | 'summary';

export interface AppContextType {
  data: AppData;
  addExpense: (category: ExpenseCategory, expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  setBudgets: (newBudgets: Budgets) => void;
  resetData: () => void;
  isLoading: boolean;
  showSaved: boolean;
}