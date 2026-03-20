import React from 'react';
import { Server, Activity, Database, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BridgeNodeProps {
  label: string;
  status: 'connected' | 'syncing' | 'error';
  icon: React.ElementType;
}

const BridgeNode = ({ label, status, icon: Icon }: BridgeNodeProps) => {
  const isConnected = status === 'connected';
  const isSyncing = status === 'syncing';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 transition-all">
      <div className={cn(
        "p-2 rounded-md shrink-0 transition-colors duration-500",
        isConnected && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        isSyncing && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        status === 'error' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      )}>
        <Icon className={cn("w-5 h-5", isSyncing && "animate-pulse")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize tracking-wider font-semibold">
          {status}
        </p>
      </div>
      <div className="shrink-0 flex items-center justify-center">
        <span className="relative flex h-3 w-3">
          {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
          <span className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            isConnected ? "bg-emerald-500" : isSyncing ? "bg-blue-500" : "bg-red-500"
          )}></span>
        </span>
      </div>
    </div>
  );
};

export function SystemBridge() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">Active System Bridges</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BridgeNode label="Hospital EMR DB" status="connected" icon={Database} />
        <BridgeNode label="Emergency Dispatch" status="connected" icon={Activity} />
        <BridgeNode label="Health Lexicon" status="syncing" icon={Server} />
      </div>
    </div>
  );
}
