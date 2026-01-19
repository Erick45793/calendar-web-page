'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Target, Calendar, Zap } from 'lucide-react';

interface GoalCalendarProps {
  purpose: string;
  goal: string;
  targetDate: string;
  onReset: () => void;
}

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isPast: boolean;
  isTarget: boolean;
  isToday: boolean;
}

export function GoalCalendar({ purpose, goal, targetDate, onReset }: GoalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<string[]>([]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const lastDayOfPrevMonth = prevLastDay.getDate();

    const days: Day[] = [];
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isPast: date < today,
        isTarget: false,
        isToday: false
      });
    }

    // Current month days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split('T')[0];

      days.push({
        date,
        isCurrentMonth: true,
        isPast: date < today,
        isTarget: date.getTime() === targetDateObj.getTime(),
        isToday: date.getTime() === today.getTime()
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isPast: date < today,
        isTarget: false,
        isToday: false
      });
    }

    return days;
  }, [currentDate, targetDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day: Day) => {
    if (!day.isCurrentMonth || day.isPast) return;

    const dateString = day.date.toISOString().split('T')[0];
    setMarkedDates(prev =>
      prev.includes(dateString)
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString]
    );
  };

  const progressPercentage = useMemo(() => {
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today >= targetDateObj) return 100;

    const startDate = new Date(targetDateObj);
    startDate.setFullYear(startDate.getFullYear() - 1); // Approximately 1 year back

    const totalDays = Math.max(1, Math.ceil((targetDateObj.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  }, [targetDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {purpose}
              </h1>
              <p className="text-muted-foreground text-lg">{goal}</p>
            </div>
            <Button
              onClick={onReset}
              variant="outline"
              className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              Cambiar Meta
            </Button>
          </div>

          {/* Target Date Info */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Fecha objetivo: {new Date(targetDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Tu progreso</span>
                <span className="text-primary font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-xl">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={handlePrevMonth}
                  variant="outline"
                  size="icon"
                  className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <h2 className="text-2xl font-bold text-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <Button
                  onClick={handleNextMonth}
                  variant="outline"
                  size="icon"
                  className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dateString = day.date.toISOString().split('T')[0];
                  const isMarked = markedDates.includes(dateString);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(day)}
                      disabled={!day.isCurrentMonth || day.isPast}
                      className={`
                        aspect-square rounded-lg font-semibold text-sm transition-all duration-200
                        flex items-center justify-center relative overflow-hidden
                        ${!day.isCurrentMonth ? 'opacity-30 cursor-default' : ''}
                        ${day.isPast && day.isCurrentMonth ? 'bg-muted text-muted-foreground cursor-default' : ''}
                        ${day.isToday ? 'ring-2 ring-primary' : ''}
                        ${day.isTarget ? 'bg-gradient-to-br from-accent to-primary text-accent-foreground font-bold scale-105' : ''}
                        ${!day.isPast && day.isCurrentMonth && !day.isTarget ? 'bg-secondary/20 text-foreground hover:bg-primary/20 cursor-pointer' : ''}
                        ${isMarked && !day.isTarget ? 'bg-primary/30 text-primary font-bold' : ''}
                      `}
                      title={day.isTarget ? 'Fecha objetivo' : day.isToday ? 'Hoy' : ''}
                    >
                      <span>{day.date.getDate()}</span>
                      {day.isTarget && <Target className="w-3 h-3 absolute bottom-1 right-1" />}
                      {isMarked && <Zap className="w-3 h-3 absolute bottom-1 right-1" />}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Stats Card 1 */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">Días marcados</div>
                <div className="text-3xl font-bold text-primary">{markedDates.length}</div>
                <p className="text-xs text-muted-foreground mt-2">Mantén el ritmo</p>
              </Card>

              {/* Stats Card 2 */}
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
                <div className="text-sm text-muted-foreground mb-1">Días restantes</div>
                <div className="text-3xl font-bold text-accent">
                  {Math.max(0, Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Para tu objetivo</p>
              </Card>

              {/* Stats Card 3 */}
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                <div className="text-sm text-muted-foreground mb-1">Proporción</div>
                <div className="text-3xl font-bold text-secondary">
                  {markedDates.length > 0 ? (
                    <>
                      {((markedDates.length / Math.max(1, Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))) * 100).toFixed(1)}%
                    </>
                  ) : (
                    '0%'
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">De dedicación</p>
              </Card>

              {/* Motivational Message */}
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-border">
                <p className="text-sm font-semibold text-foreground mb-2">💪 Mensaje del día</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {markedDates.length > 0
                    ? `¡Vas muy bien! Continúa marcando tus días y pronto lograrás tu meta.`
                    : `Empieza hoy. Cada día marcado te acerca más a tu objetivo.`}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
