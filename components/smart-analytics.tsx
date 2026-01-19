'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Flame, Calendar } from 'lucide-react';

interface DailyEntry {
  date: string;
  amount: number;
}

interface SmartAnalyticsProps {
  entries: DailyEntry[];
}

export function SmartAnalytics({ entries }: SmartAnalyticsProps) {
  // Calcular mejor día
  const bestDay = entries.reduce((best, current) => 
    current.amount > (best?.amount || 0) ? current : best, 
    null as DailyEntry | null
  );

  // Calcular promedio semanal
  const getWeeklyStats = () => {
    const weeks: { [key: number]: number } = {};
    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.getTime();
      weeks[weekKey] = (weeks[weekKey] || 0) + entry.amount;
    });
    
    const weeklyAmounts = Object.values(weeks);
    return weeklyAmounts.length > 0 
      ? (weeklyAmounts.reduce((a, b) => a + b) / weeklyAmounts.length).toFixed(2)
      : '0.00';
  };

  // Calcular racha de días consecutivos
  const getConsecutiveStreak = () => {
    if (entries.length === 0) return 0;
    
    const sortedDates = entries
      .map((e) => new Date(e.date).getTime())
      .sort((a, b) => b - a);
    
    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diff = (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24);
      if (Math.abs(diff - 1) < 0.1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Mejor día de la semana
  const getBestDayOfWeek = () => {
    const dayStats: { [key: string]: number } = {
      Lunes: 0,
      Martes: 0,
      Miércoles: 0,
      Jueves: 0,
      Viernes: 0,
      Sábado: 0,
      Domingo: 0,
    };

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const dayName = dayNames[date.getDay()];
      dayStats[dayName] = (dayStats[dayName] || 0) + entry.amount;
    });

    const bestDay = Object.entries(dayStats).reduce((best, current) =>
      current[1] > best[1] ? current : best
    );

    return bestDay[0];
  };

  const bestDayOfWeek = getBestDayOfWeek();
  const weeklyAvg = getWeeklyStats();
  const streak = getConsecutiveStreak();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Mejor Día</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {bestDay ? `$${bestDay.amount.toFixed(2)}` : '$0.00'}
            </p>
            {bestDay && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(bestDay.date).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
          <TrendingUp className="w-10 h-10 text-primary opacity-50" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Racha Actual</p>
            <p className="text-2xl font-bold text-accent mt-2">{streak} días</p>
            <p className="text-xs text-muted-foreground mt-1">días consecutivos</p>
          </div>
          <Flame className="w-10 h-10 text-accent opacity-50" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Mejor Día Semanal</p>
            <p className="text-2xl font-bold text-secondary mt-2">{bestDayOfWeek}</p>
            <p className="text-xs text-muted-foreground mt-1">prom. ${weeklyAvg}</p>
          </div>
          <Calendar className="w-10 h-10 text-secondary opacity-50" />
        </div>
      </Card>
    </div>
  );
}
