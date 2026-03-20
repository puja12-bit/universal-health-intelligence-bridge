'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle, Stethoscope, Search, Activity } from 'lucide-react';
import { cn } from './SystemBridge';

interface PatientInputProps {
  onDataSubmit: (text: string, file: File | null, patientId: string) => void;
  isLoading?: boolean;
}

export function PatientInput({ onDataSubmit, isLoading = false }: PatientInputProps) {
  const [text, setText] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be under 50MB for analysis');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile && !patientId.trim()) {
      setError('Please provide a description, upload a file, or enter a Patient ID.');
      return;
    }
    onDataSubmit(text, selectedFile, isDoctorMode ? patientId : '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be under 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
      
      {/* Target Audience Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-full transition-all duration-300", isDoctorMode ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rotate-0 scale-100" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 rotate-12 scale-90")}>
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">Doctor Mode</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide mt-0.5">Enable direct EMR lookup via Patient ID</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDoctorMode}
          onClick={() => setIsDoctorMode(!isDoctorMode)}
          disabled={isLoading}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
            isDoctorMode ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
          )}
        >
          <span className="sr-only">Use Doctor Mode</span>
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
              isDoctorMode ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {isDoctorMode && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-500">
          <label htmlFor="patientId" className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Secure EMR Verification
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
            </div>
            <input
              type="text"
              id="patientId"
              className="block w-full pl-12 p-3.5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-inner font-mono font-bold tracking-wider placeholder:font-sans placeholder:tracking-normal placeholder:font-medium placeholder:text-zinc-400"
              placeholder="e.g. PT-1002 or PT-8841"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      <div className={cn("transition-opacity duration-300", isDoctorMode ? "opacity-60 hover:opacity-100 focus-within:opacity-100" : "opacity-100")}>
        <label htmlFor="description" className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 mt-2">
          Clinical Log / Symptoms
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow font-medium"
          placeholder="Detail primary complaints, timeline, and observed symptoms..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div 
        className={cn("relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 outline-none",
          selectedFile ? "border-blue-300 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10" : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 focus-within:ring-2 focus-within:ring-blue-600"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          id="file-upload"
          accept="image/*,video/*,.pdf,.doc,.docx"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center gap-3 outline-none"
        >
          {selectedFile ? (
            <div className="flex items-center gap-4 text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/20">
              <FileIcon className="w-8 h-8 text-blue-600 dark:text-blue-500 shrink-0" />
              <span className="font-bold truncate max-w-[180px]">{selectedFile.name}</span>
              <button
                type="button"
                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-2"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Click to attach medical scans or records
              </span>
              <span className="text-xs font-semibold tracking-wide text-zinc-400 dark:text-zinc-500">
                Images, video, or documents (Max 50MB)
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-3 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (!text.trim() && !selectedFile && !patientId.trim())}
        className="w-full py-4 px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-all dark:focus:ring-offset-zinc-900 flex justify-center items-center gap-3"
      >
        {isLoading ? (
          <>
            <Activity className="w-5 h-5 animate-spin" />
            <span className="animate-pulse">Processing Intelligence...</span>
          </>
        ) : (
          'Run Systems Analysis'
        )}
      </button>
    </form>
  );
}
