import React from 'react';

interface ActionListProps {
  steps: string[];
}

export function ActionList({ steps }: ActionListProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        Recommended Actions
      </h3>
      <ol className="space-y-4" aria-label="Life-saving action steps">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-4 items-start group">
            <div className="flex-shrink-0 mt-0.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm shadow-sm select-none">
                {idx + 1}
              </span>
            </div>
            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed pt-0.5 text-base font-medium">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ActionListSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mt-6 animate-pulse" aria-hidden="true">
      <div className="h-6 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-6"></div>
      <ul className="space-y-5">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-zinc-300 dark:bg-zinc-700 flex-shrink-0"></div>
            <div className="w-full space-y-2 mt-1">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              {i !== 3 && <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded"></div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
