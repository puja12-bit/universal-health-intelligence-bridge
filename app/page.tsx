'use client';

import React, { useState } from 'react';
import { PatientInput } from '@/components/PatientInput';
import { TriageResult, TriageSkeleton, UHIBResult } from '@/components/TriageResult';
import { ActionList, ActionListSkeleton } from '@/components/ActionList';
import { SystemBridge } from '@/components/SystemBridge';
import { ShieldPlus, ServerCrash, Database } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UHIBResult | null>(null);
  const [error, setError] = useState('');

  const handleDataSubmit = async (text: string, file: File | null, patientId: string) => {
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const formData = new FormData();
      if (text) formData.append('description', text);
      if (file) formData.append('file', file);
      if (patientId) formData.append('patientId', patientId);

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
      setError(err.message || 'An unexpected error occurred during analysis by UHIB.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-indigo-900/50">
      
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md ring-1 ring-indigo-700/50">
              <ShieldPlus className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                Universal Health Intelligence Bridge
              </h1>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hidden sm:block">
                Secure Data Fusion & Triage Architecture
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-inner">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Mission Control */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all">
            <h2 className="text-xl font-black tracking-tight mb-2 uppercase">Input Telemetry</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
              Establish a secure bridge using direct text symptoms, media records, or authorize Doctor Mode to actively fetch EMR mock records.
            </p>
            <PatientInput onDataSubmit={handleDataSubmit} isLoading={isLoading} />
          </div>

          <div className="mt-auto">
             <SystemBridge />
          </div>
        </div>

        {/* Right Column: AI Structured Results */}
        <div className="lg:col-span-7 relative z-10">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight hidden lg:block uppercase">Intelligence Synthesis</h2>
              {result && (
                <span className="text-xs font-bold px-4 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shadow-inner rounded-full tracking-widest">
                  REPORT GENERATED
                </span>
              )}
            </div>
            
            {!isLoading && !result && !error && (
              <div className="w-full h-[550px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 bg-white/50 dark:bg-zinc-900/30 transition-all hover:bg-white dark:hover:bg-zinc-900/50">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-full shadow-sm mb-5 border border-zinc-100 dark:border-zinc-800">
                  <ShieldPlus className="w-12 h-12 text-indigo-400" />
                </div>
                <p className="text-xl font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">Awaiting Telemetry</p>
                <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-2">Submit patient data to synthesize structured medical insights.</p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <TriageSkeleton />
                <ActionListSkeleton />
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-sm animate-in slide-in-from-top-4">
                <h3 className="text-lg font-black mb-2 flex items-center gap-2 tracking-wide">
                   <ServerCrash className="w-6 h-6" /> Infrastructure Failure
                </h3>
                <p className="text-sm font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in-0 duration-700 ease-out">
                <TriageResult result={result} />
                <ActionList steps={result.procedure || result.recommended_actions || []} />
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
