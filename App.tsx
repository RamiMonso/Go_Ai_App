
import React, { useState, useContext } from 'react';
import { useAppData, AppContext } from './hooks/useAppData';
import type { Page } from './types';
import { BottomNav } from './components/BottomNav';
import { BudgetPage } from './components/BudgetPage';
import { ExpensePage } from './components/ExpensePage';
import { SummaryPage } from './components/SummaryPage';

const SaveIndicator: React.FC = () => {
  const context = useContext(AppContext);

  if (!context?.showSaved) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-24 left-1/2 bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center z-50 animate-save-indicator"
      role="status"
      aria-live="polite"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      הנתונים נשמרו אוטומטית
    </div>
  );
};

const pageTitles: { [key in Page]: string } = {
    budget: 'הגדרת תקציב',
    week1: 'הוצאות שבוע 1',
    week2: 'הוצאות שבוע 2',
    week3: 'הוצאות שבוע 3',
    week4: 'הוצאות שבוע 4',
    week5: 'הוצאות שבוע 5',
    misc: 'הוצאות שונות',
    summary: 'סיכום והגדרות'
};

const App: React.FC = () => {
  const appData = useAppData();
  const [currentPage, setCurrentPage] = useState<Page>('summary');

  const renderPage = () => {
    switch (currentPage) {
      case 'budget':
        return <BudgetPage />;
      case 'summary':
        return <SummaryPage />;
      case 'week1':
      case 'week2':
      case 'week3':
      case 'week4':
      case 'week5':
      case 'misc':
        return <ExpensePage category={currentPage} title={pageTitles[currentPage]} />;
      default:
        return <SummaryPage />;
    }
  };

  return (
    <AppContext.Provider value={appData}>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <main className="pb-24">
          {renderPage()}
        </main>
        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <SaveIndicator />
      </div>
    </AppContext.Provider>
  );
};

export default App;