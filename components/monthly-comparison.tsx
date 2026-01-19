'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DailyEntry {
  date: string;
  amount: number;
}

interface MonthlyComparisonProps {
  entries: DailyEntry[];
}

export function MonthlyComparison({ entries }: MonthlyComparisonProps) {
  // Agrupar ahorros por mes
  const monthlyData = entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

      const existing = acc.find((m) => m.monthKey === monthKey);
      if (existing) {
        existing.total += entry.amount;
      } else {
        acc.push({ monthKey, monthName, total: entry.amount });
      }
      return acc;
    },
    [] as Array<{ monthKey: string; monthName: string; total: number }>
  );

  const colors = ['#8B5CF6', '#F97316', '#3B82F6', '#EC4899', '#10B981'];

  const getPercentageChange = () => {
    if (monthlyData.length < 2) return null;
    const latest = monthlyData[monthlyData.length - 1].total;
    const previous = monthlyData[monthlyData.length - 2].total;
    const change = ((latest - previous) / previous) * 100;
    return change;
  };

  const percentageChange = getPercentageChange();
  const bestMonth = monthlyData.reduce((best, current) =>
    current.total > (best?.total || 0) ? current : best,
    monthlyData[0]
  );

  return (
    <Card className="p-6 mt-6 bg-gradient-to-br from-background to-muted/30 border-border">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Comparativa Mensual</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tu ahorro mes a mes
        </p>

        {monthlyData.length >= 2 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Mes Anterior</p>
              <p className="text-lg font-bold text-foreground">
                ${monthlyData[monthlyData.length - 2].total.toFixed(2)}
              </p>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Este Mes</p>
              <p className="text-lg font-bold text-foreground">
                ${monthlyData[monthlyData.length - 1].total.toFixed(2)}
              </p>
              {percentageChange !== null && (
                <p className={`text-xs font-semibold mt-1 ${percentageChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {monthlyData.length > 0 ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="monthName"
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
                formatter={(value) => `$${(value as number).toFixed(2)}`}
              />
              <Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>No hay datos de múltiples meses aún</p>
        </div>
      )}

      {bestMonth && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mejor mes:{' '}
            <span className="font-bold text-foreground">
              {bestMonth.monthName} (${bestMonth.total.toFixed(2)})
            </span>
          </p>
        </div>
      )}
    </Card>
  );
}
