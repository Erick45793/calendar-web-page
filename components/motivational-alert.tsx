'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface MotivationalAlertProps {
  entries: Array<{ date: string; amount: number }>;
}

export function MotivationalAlert({ entries }: MotivationalAlertProps) {
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find((e) => e.date === today);
    setHasEntryToday(!!todayEntry);
    setShowAlert(!todayEntry);
  }, [entries]);

  if (!showAlert) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/30 rounded-lg p-4 mb-4 flex items-start gap-3 animate-pulse">
      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-foreground text-sm">
          No has registrado tu ahorro hoy
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Cada día que ahorras suma para alcanzar tu meta. ¡Vamos, agrega tu ahorro de hoy!
        </p>
      </div>
    </div>
  );
}

export function SuccessAlert({ entries }: MotivationalAlertProps) {
  const [todayAmount, setTodayAmount] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find((e) => e.date === today);
    setTodayAmount(todayEntry?.amount || null);
  }, [entries]);

  if (!todayAmount) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-lg p-4 mb-4 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-foreground text-sm">
          Excelente, ahorraste hoy
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Has agregado ${todayAmount.toFixed(2)} hoy. Sigue así, ¡lo estás logrando!
        </p>
      </div>
    </div>
  );
}
