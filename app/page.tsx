'use client';

import { useState, useEffect } from 'react';
import { SavingsSetup } from '@/components/savings-setup';
import { SavingsCalendar } from '@/components/savings-calendar';
import { Moon, Sun } from 'lucide-react';

interface SavingsData {
  targetAmount: number;
  targetDate: string;
  reason: string;
}

export default function Home() {
  const [savingsData, setSavingsData] = useState<SavingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('savingsData');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedData) {
      try {
        setSavingsData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading savings data:', error);
      }
    }

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }

    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleFormSubmit = (data: SavingsData) => {
    setSavingsData(data);
    localStorage.setItem('savingsData', JSON.stringify(data));
  };

  const handleReset = () => {
    setSavingsData(null);
    localStorage.removeItem('savingsData');
    localStorage.removeItem('savingsEntries');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors"
          aria-label="Cambiar tema"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-primary" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      {savingsData ? (
        <SavingsCalendar
          targetAmount={savingsData.targetAmount}
          targetDate={savingsData.targetDate}
          reason={savingsData.reason}
          onReset={handleReset}
        />
      ) : (
        <SavingsSetup onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
