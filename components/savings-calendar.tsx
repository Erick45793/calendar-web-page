'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmartAnalytics } from './smart-analytics';
import { MonthlyComparison } from './monthly-comparison';
import { MotivationalAlert, SuccessAlert } from './motivational-alert';
import { SavingsHeader } from './savings-header';
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Target,
  RotateCcw,
  Download,
  Zap,
} from 'lucide-react';

interface DailyEntry {
  date: string;
  amount: number;
}

interface SavingsCalendarProps {
  targetAmount: number;
  targetDate: string;
  reason: string;
  onReset: () => void;
}

export function SavingsCalendar({
  targetAmount,
  targetDate,
  reason,
  onReset,
}: SavingsCalendarProps) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [inputAmount, setInputAmount] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem('savingsEntries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading entries:', e);
      }
    }
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem('savingsEntries', JSON.stringify(entries));
  }, [entries]);

  const addOrUpdateEntry = () => {
    setError('');

    if (!inputAmount || Number(inputAmount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    const existing = entries.findIndex((e) => e.date === selectedDate);
    let newEntries;

    if (existing >= 0 && editingDate === selectedDate) {
      newEntries = [...entries];
      newEntries[existing].amount = Number(inputAmount);
    } else if (existing >= 0) {
      setError('Ya hay un registro para este día. Edítalo o selecciona otro.');
      return;
    } else {
      newEntries = [...entries, { date: selectedDate, amount: Number(inputAmount) }];
    }

    setEntries(newEntries);
    setInputAmount('');
    setEditingDate(null);
  };

  const deleteEntry = (date: string) => {
    setEntries(entries.filter((e) => e.date !== date));
    setEditingDate(null);
    setInputAmount('');
  };

  const selectDateForEdit = (date: string) => {
    const entry = entries.find((e) => e.date === date);
    if (entry) {
      setSelectedDate(date);
      setInputAmount(String(entry.amount));
      setEditingDate(date);
    }
  };

  // Cálculos
  const totalSaved = entries.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(0, targetAmount - totalSaved);
  const percentage = Math.min(100, (totalSaved / targetAmount) * 100);
  const daysUntilTarget = Math.ceil(
    (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyGoal = remaining > 0 && daysUntilTarget > 0 ? remaining / daysUntilTarget : 0;

  // Obtener días del mes
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    // Ajustar para que lunes sea 0: domingo (0) → 6, lunes (1) → 0, ..., sábado (6) → 5
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${month}-${d}`;
  };

  const getAmountForDay = (day: number | null) => {
    if (!day) return null;
    const dateStr = getDateString(day);
    return entries.find((e) => e.date === dateStr)?.amount;
  };

  const days = getDaysInMonth();
  const monthName = currentMonth.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const isTargetDateInMonth = () => {
    const targetDateObj = new Date(targetDate);
    return (
      targetDateObj.getFullYear() === currentMonth.getFullYear() &&
      targetDateObj.getMonth() === currentMonth.getMonth()
    );
  };

  const targetDay = new Date(targetDate).getDate();

  const getMotivationalMessage = () => {
    if (percentage === 100) {
      return '¡Felicidades! Alcanzaste tu meta de ahorro.';
    }
    if (percentage >= 75) {
      return '¡Casi lo logras! Estás muy cerca de tu meta.';
    }
    if (percentage >= 50) {
      return '¡Vas muy bien! Continúa con este ritmo.';
    }
    if (percentage >= 25) {
      return 'Buen comienzo. ¡Sigue adelante!';
    }
    return 'Empieza hoy mismo. Cada peso cuenta.';
  };

  const handleExport = () => {
    const data = {
      reason,
      targetAmount,
      targetDate,
      totalSaved,
      remaining,
      percentage,
      entries,
      exportDate: new Date().toLocaleString('es-ES'),
    };

    const csv = [
      ['Fecha', 'Cantidad'],
      ...entries
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((e) => [e.date, `$${e.amount.toFixed(2)}`]),
      [],
      ['Resumen', ''],
      ['Total Ahorrado', `$${totalSaved.toFixed(2)}`],
      ['Meta', `$${targetAmount.toFixed(2)}`],
      ['Porcentaje', `${percentage.toFixed(1)}%`],
    ];

    const csvContent = csv.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ahorros-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <SavingsHeader />

        {/* Alertas Motivacionales */}
        <div className="mb-6">
          <SuccessAlert entries={entries} />
          <MotivationalAlert entries={entries} />
        </div>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta Meta */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tu Meta</p>
                <h2 className="text-3xl font-bold text-primary">
                  ${targetAmount.toFixed(2)}
                </h2>
                <p className="text-xs text-muted-foreground mt-2">{reason}</p>
              </div>
              <Target className="w-12 h-12 text-primary/30" />
            </div>
            <div className="text-xs text-muted-foreground">
              Objetivo: {new Date(targetDate).toLocaleDateString('es-ES')}
            </div>
          </Card>

          {/* Tarjeta Progreso */}
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ahorrado</p>
                <h2 className="text-3xl font-bold text-accent">
                  ${totalSaved.toFixed(2)}
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  {percentage.toFixed(1)}% de tu meta
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-accent/30" />
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </Card>

          {/* Tarjeta Faltante */}
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Falta por ahorrar</p>
                <h2 className="text-3xl font-bold text-secondary">
                  ${remaining.toFixed(2)}
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  {daysUntilTarget > 0 ? `${daysUntilTarget} días restantes` : 'Fecha alcanzada'}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-secondary/30" />
            </div>
            <div className="text-xs font-medium text-secondary">
              {dailyGoal > 0 ? `Necesitas: $${dailyGoal.toFixed(2)}/día` : 'Meta alcanzada'}
            </div>
          </Card>
        </div>

        {/* Mensaje motivacional */}
        <div className="mb-8 p-4 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-foreground">{getMotivationalMessage()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de entrada de datos */}
          <div>
            <Card className="p-6 h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Registrar Ahorro
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Selecciona fecha
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      const entry = entries.find((en) => en.date === e.target.value);
                      if (entry) {
                        setInputAmount(String(entry.amount));
                        setEditingDate(e.target.value);
                      } else {
                        setInputAmount('');
                        setEditingDate(null);
                      }
                    }}
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Cantidad ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={addOrUpdateEntry}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold"
                >
                  {editingDate === selectedDate ? 'Actualizar' : 'Guardar'}
                </Button>

                {editingDate === selectedDate && (
                  <Button
                    onClick={() => {
                      deleteEntry(selectedDate);
                      setSelectedDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-300/50"
                    variant="outline"
                  >
                    Eliminar registro
                  </Button>
                )}

                {/* Estadísticas rápidas */}
                <div className="pt-4 border-t border-primary/20 space-y-3">
                  <div className="text-xs">
                    <p className="text-muted-foreground">Días con ahorro</p>
                    <p className="text-lg font-bold text-primary">{entries.length}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-muted-foreground">Promedio diario</p>
                    <p className="text-lg font-bold text-accent">
                      ${(entries.length > 0 ? totalSaved / entries.length : 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Calendario */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Controles del mes */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold capitalize text-foreground">{monthName}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                    }
                    className="border-primary/30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                    className="border-primary/30 text-xs"
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                    }
                    className="border-primary/30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-bold text-muted-foreground p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Cuadrícul a de días */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dateStr = getDateString(day);
                  const amount = getAmountForDay(day);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  const isTargetDay = isTargetDateInMonth() && day === targetDay;
                  const isFuture = new Date(dateStr) > new Date();
                  const isPast = new Date(dateStr) < new Date();

                  return (
                    <button
                      key={day}
                      onClick={() => selectDateForEdit(dateStr)}
                      className={`aspect-square rounded-lg p-2 text-center transition-all duration-200 flex flex-col items-center justify-center text-xs font-semibold ${
                        amount
                          ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-105'
                          : isToday
                            ? 'bg-primary/20 border-2 border-primary text-foreground'
                            : isTargetDay
                              ? 'bg-accent/30 border-2 border-accent text-foreground'
                              : isFuture
                                ? 'bg-muted/50 text-muted-foreground'
                                : isPast
                                  ? 'bg-background text-muted-foreground hover:bg-muted/50'
                                  : 'bg-background hover:bg-muted/50'
                      }`}
                    >
                      <span>{day}</span>
                      {amount && <span className="text-xs font-bold mt-1">${amount.toFixed(0)}</span>}
                      {isTargetDay && <span className="text-lg">🎯</span>}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="mt-6 pt-4 border-t border-primary/20 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-accent" />
                  <span className="text-muted-foreground">Dinero ahorrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-primary" />
                  <span className="text-muted-foreground">Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-accent" />
                  <span className="text-muted-foreground">Fecha objetivo</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Análisis Inteligente */}
        {entries.length > 0 && <SmartAnalytics entries={entries} />}

        {/* Comparativa Mensual */}
        {entries.length > 0 && <MonthlyComparison entries={entries} />}

        {/* Botones de acción */}
        <div className="mt-8 flex gap-4 justify-end">
          <Button
            onClick={handleExport}
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar datos
          </Button>
          <Button
            onClick={onReset}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-300/50 font-semibold flex items-center gap-2"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4" />
            Nueva meta
          </Button>
        </div>
      </div>
    </div>
  );
}
