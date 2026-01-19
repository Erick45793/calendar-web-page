import { PiggyBank } from 'lucide-react';

export function SavingsHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <PiggyBank className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Mi Calendario de Ahorros
        </h1>
        <PiggyBank className="w-8 h-8 text-accent" />
      </div>
      <p className="text-muted-foreground text-lg">
        Registra tu ahorro diario y alcanza tu meta financiera
      </p>
    </div>
  );
}
