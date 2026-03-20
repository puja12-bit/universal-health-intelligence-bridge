'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TriageResult, TriageSkeleton } from '@/components/TriageResult';
import { ActionList, ActionListSkeleton } from '@/components/ActionList';
import { ShieldAlert } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ severity: string; summary: string; actionSteps: string[] } | null>(null);
  const [error, setError] = useState('');

  const handleDataSubmit = async (text: string, file?: File | null) => {
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const formData = new FormData();
      if (text) formData.append('description', text);
      if (file) formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze the data. Please ensure the API is configured securely.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-200 dark:selection:bg-blue-900/50">
      
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm ring-1 ring-blue-700/50">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
            CrisisBridge AI
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Report Situation</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Provide a medical or disaster description, and optionally upload a photo for AI-driven triage and actionable insights.
            </p>
          </div>
          <FileUpload onDataSubmit={handleDataSubmit} isLoading={isLoading} />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-6 text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-6 hidden lg:block">AI Analysis Results</h2>
            
            {!isLoading && !result && !error && (
              <div className="w-full h-[400px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 bg-white/50 dark:bg-zinc-900/50 transition-all">
                <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-bold text-zinc-500 dark:text-zinc-400">Awaiting Data Input</p>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Submit details to generate life-saving steps.</p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <TriageSkeleton />
                <ActionListSkeleton />
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm animate-in slide-in-from-top-4">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                   <ShieldAlert className="w-5 h-5" /> Analysis Failed
                </h3>
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <TriageResult severity={result.severity} summary={result.summary} />
                <ActionList steps={result.actionSteps} />
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
