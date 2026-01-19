'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PiggyBank, Target, TrendingUp } from 'lucide-react';

interface SavingsSetupProps {
  onSubmit: (data: { targetAmount: number; targetDate: string; reason: string }) => void;
}

export function SavingsSetup({ onSubmit }: SavingsSetupProps) {
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!targetAmount || !targetDate || !reason) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (Number(targetAmount) <= 0) {
      setError('La meta debe ser mayor a 0');
      return;
    }

    const selectedDate = new Date(targetDate);
    if (selectedDate <= new Date()) {
      setError('La fecha debe ser en el futuro');
      return;
    }

    onSubmit({
      targetAmount: Number(targetAmount),
      targetDate,
      reason,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header animado */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-full mb-4 animate-bounce">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Calendario de Ahorros
          </h1>
          <p className="text-muted-foreground">Crea tu meta de ahorro y comienza hoy</p>
        </div>

        {/* Tarjeta del formulario */}
        <Card className="p-8 shadow-2xl backdrop-blur-sm border-primary/20 bg-card/80 dark:bg-card/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo: Razón del ahorro */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                ¿Para qué quieres ahorrar?
              </label>
              <Input
                placeholder="Ej: Viaje, Laptop, Emergencia..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-primary/30 focus:border-primary focus:ring-primary/30"
              />
            </div>

            {/* Campo: Meta de ahorro */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Meta de ahorro ($)
              </label>
              <Input
                type="number"
                placeholder="Ej: 1000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                step="0.01"
                min="0"
                className="border-primary/30 focus:border-primary focus:ring-primary/30"
              />
            </div>

            {/* Campo: Fecha objetivo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                Fecha objetivo
              </label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="border-primary/30 focus:border-primary focus:ring-primary/30"
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Comenzar a Ahorrar
            </Button>
          </form>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-primary/20">
            <p className="text-xs text-muted-foreground font-semibold mb-3">Consejos para ahorrar:</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>✓ Sé consistente, aunque sea poco cada día</li>
              <li>✓ Registra cada cantidad ahorrada</li>
              <li>✓ Celebra tus hitos y avances</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4m8-4v4M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M3 10h18" />
    </svg>
  );
}
