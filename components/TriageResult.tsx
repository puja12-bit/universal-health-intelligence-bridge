import React from 'react';
import { AlertTriangle, Activity, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TriageResultProps {
  severity: 'High' | 'Medium' | 'Low' | string;
  summary: string;
}

export function TriageResult({ severity, summary }: TriageResultProps) {
  const isHigh = severity.toLowerCase() === 'high';
  const isMedium = severity.toLowerCase() === 'medium';
  
  const Icon = isHigh ? AlertTriangle : isMedium ? Activity : Info;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className={cn(
        "px-6 py-4 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800",
        isHigh && "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-b-red-200 dark:border-b-red-900/30",
        isMedium && "bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 border-b-orange-200 dark:border-b-orange-900/30",
        !isHigh && !isMedium && "bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-b-blue-200 dark:border-b-blue-900/30"
      )}>
        <Icon className="w-6 h-6" aria-hidden="true" />
        <h2 className="text-lg font-bold">Severity: {severity}</h2>
      </div>
      <div className="p-6">
        <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Situation Summary</h3>
        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-base" aria-live="polite">
          {summary}
        </p>
      </div>
    </div>
  );
}

export function TriageSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-pulse" aria-hidden="true">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50">
        <div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
      </div>
      <div className="p-6 space-y-3">
        <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>
    </div>
  );
}
