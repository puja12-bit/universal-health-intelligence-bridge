import React from 'react';
import { AlertTriangle, Activity, Info, ShieldAlert, HeartPulse, FileWarning, BriefcaseMedical, Users, Server, ExternalLink, MessageSquareText } from 'lucide-react';
import { cn } from './SystemBridge';

export interface UHIBResult {
  severity: string;
  diagnosedCondition: string;
  confidenceScore: number;
  confidence_reason: string;
  data_sources: string[];
  processing_steps: string[];
  patient_summary: string;
  risk_analysis: string[];
  similar_cases: string[];
  procedure_plan: string[];
  video_references: string[];
  requiredResources: string[];
  patientContextUsed?: boolean;
}

export function TriageResult({ result }: { result: UHIBResult }) {
  const sev = result.severity?.toLowerCase() || 'medium';
  const isCritical = sev === 'critical' || sev === 'high';
  const isMedium = sev === 'medium';
  
  const Icon = isCritical ? ShieldAlert : isMedium ? AlertTriangle : Info;

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner */}
      <div className={cn(
        "w-full rounded-2xl overflow-hidden shadow-sm border-2",
        isCritical ? "border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10" : 
        isMedium ? "border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10" : 
        "border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10"
      )}>
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className={cn(
              "p-4 rounded-2xl shrink-0 shadow-inner",
              isCritical ? "bg-red-500 text-white dark:bg-red-600" :
              isMedium ? "bg-orange-500 text-white dark:bg-orange-600" :
              "bg-blue-500 text-white dark:bg-blue-600"
            )}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className={cn(
                "text-3xl font-black uppercase tracking-tight",
                isCritical ? "text-red-700 dark:text-red-400" :
                isMedium ? "text-orange-700 dark:text-orange-400" :
                "text-blue-700 dark:text-blue-400"
              )}>Severity: {result.severity}</h2>
              {result.patientContextUsed && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <Activity className="w-3.5 h-3.5" /> EMR Context Verified
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-white/20 dark:border-zinc-700/30 shadow-sm shrink-0">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">AI Confidence</span>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-zinc-800 dark:text-zinc-100 leading-none">
                {Math.round(result.confidenceScore * 100)}<span className="text-2xl text-zinc-400">%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Summary block spanning both columns */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
           <MessageSquareText className="w-5 h-5 text-indigo-500" />
           <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Patient Summary</h3>
           <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 ml-auto hidden sm:block">
             Confidence Note: {result.confidence_reason}
           </span>
        </div>
        <p className="text-zinc-800 dark:text-zinc-200 text-lg leading-relaxed font-medium">
          {result.patient_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex gap-2.5 items-center mb-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Diagnosed Condition</h3>
            </div>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">{result.diagnosedCondition}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex gap-2.5 items-center mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <BriefcaseMedical className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Required Resources</h3>
            </div>
            <ul className="space-y-3">
              {result.requiredResources?.map((res, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-sm group-hover:scale-125 transition-transform"></span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">{res}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex gap-2.5 items-center mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg">
                <Server className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Engine Telemetry</h3>
            </div>
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2 tracking-widest">DATA SOURCES</span>
                <div className="flex flex-wrap gap-2">
                  {result.data_sources?.map((ds,i) => <span key={i} className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded font-mono font-semibold">{ds}</span>)}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2 tracking-widest">PROCESSING LOG</span>
                <ol className="list-decimal list-inside text-sm text-zinc-600 dark:text-zinc-400 font-medium space-y-1.5 marker:text-zinc-400">
                  {result.processing_steps?.map((ps,i) => <li key={i}>{ps}</li>)}
                </ol>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex gap-2.5 items-center mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
               <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Risk Analysis</h3>
            </div>
            <ul className="space-y-3">
              {result.risk_analysis?.map((risk, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5 shadow-sm group-hover:scale-125 transition-transform"></span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex gap-2.5 items-center mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Similar Cases</h3>
            </div>
            <ul className="space-y-4">
              {result.similar_cases?.map((cs, i) => (
                <li key={i} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 border-l-4 border-teal-500 dark:border-teal-600 pl-4 py-1 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 rounded-r-lg">
                  {cs}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/30 shadow-sm">
            <div className="flex gap-2.5 items-center mb-4">
               <ExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
               <h3 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Video References</h3>
            </div>
            <ul className="space-y-2">
               {result.video_references?.length > 0 ? (
                 result.video_references.map((vid, i) => (
                   <li key={i}>
                     <a href={vid} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline underline-offset-2 break-all">
                       {vid}
                     </a>
                   </li>
                 ))
               ) : (
                  <li className="text-sm text-zinc-500">No video references available for this scenario.</li>
               )}
            </ul>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export function TriageSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="w-full h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="w-full h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    </div>
  );
}
