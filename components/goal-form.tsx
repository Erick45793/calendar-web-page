'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface GoalFormProps {
  onSubmit: (data: { purpose: string; goal: string; targetDate: string }) => void;
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [purpose, setPurpose] = useState('');
  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purpose.trim() && goal.trim() && targetDate) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit({ purpose, goal, targetDate });
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl border-primary/20">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Mis Metas
            </h1>
            <p className="text-muted-foreground text-lg">
              Transforma tus sueños en realidad
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Purpose Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                ¿Cuál es tu propósito?
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ej: Mejorar mi salud, aprender programación..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Goal Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                ¿Cuál es tu meta específica?
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe detalladamente qué quieres lograr..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                ¿Cuándo deseas lograrlo?
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Configurando...
                </div>
              ) : (
                'Comenzar Mi Viaje'
              )}
            </Button>
          </form>

          {/* Decorative Bottom */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground">
              Tu progreso será seguido en un hermoso calendario
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
