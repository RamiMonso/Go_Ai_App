
import React from 'react';
import type { Page } from '../types';
import { BudgetIcon, WeekIcon, MiscIcon, SummaryIcon } from './icons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavButton: React.FC<{
  label: string;
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ label, page, currentPage, setCurrentPage, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex-1 flex flex-col items-center justify-center p-2 transition-colors duration-200 ${isActive ? 'text-teal-400' : 'text-gray-400 hover:text-teal-300'}`}
    >
      {children}
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const WeekButtons: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const weeks: ('week1' | 'week2' | 'week3' | 'week4' | 'week5')[] = ['week1', 'week2', 'week3', 'week4', 'week5'];
  
  const isAnyWeekActive = weeks.includes(currentPage as any);

  return (
    <div className="flex-1 flex flex-col items-center justify-center group relative">
        <div className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 ${isAnyWeekActive ? 'text-teal-400' : 'text-gray-400'}`}>
            <WeekIcon className="h-6 w-6" />
            <span className={`text-xs font-medium ${isAnyWeekActive ? 'font-bold' : ''}`}>שבועות</span>
        </div>
        <div className="absolute bottom-full mb-2 w-max grid grid-cols-5 gap-1 bg-gray-700 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            {weeks.map((week, index) => (
                <button
                    key={week}
                    onClick={() => setCurrentPage(week)}
                    className={`px-3 py-2 text-sm rounded-md ${currentPage === week ? 'bg-teal-500 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                >
                    {`שבוע ${index + 1}`}
                </button>
            ))}
        </div>
    </div>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg flex justify-around">
      <NavButton label="סיכום" page="summary" currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <SummaryIcon className="h-6 w-6" />
      </NavButton>
      <NavButton label="שונות" page="misc" currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <MiscIcon className="h-6 w-6" />
      </NavButton>
      <WeekButtons currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <NavButton label="תקציב" page="budget" currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <BudgetIcon className="h-6 w-6" />
      </NavButton>
    </nav>
  );
};
