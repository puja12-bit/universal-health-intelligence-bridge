'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onDataSubmit: (text: string, file?: File | null) => void;
  isLoading?: boolean;
}

export function FileUpload({ onDataSubmit, isLoading = false }: FileUploadProps) {
  const [text, setText] = useState('');
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
    if (!text.trim() && !selectedFile) {
      setError('Please provide a description or upload a file.');
      return;
    }
    onDataSubmit(text, selectedFile);
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
    <form onSubmit={handleSubmit} className="w-full space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          Describe the Situation
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
          placeholder="E.g., Patient is showing severe signs of dehydration, high fever, and lethargy..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Describe the situation for AI analysis"
          disabled={isLoading}
        />
      </div>

      <div 
        className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors focus-within:ring-2 focus-within:ring-blue-600 outline-none"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          id="file-upload"
          aria-label="Upload an image or document describing the situation"
          accept="image/*,video/*,.pdf,.doc,.docx"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center gap-2 outline-none"
        >
          {selectedFile ? (
            <div className="flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
              <FileIcon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              <span className="font-semibold truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</span>
              <button
                type="button"
                className="text-zinc-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isLoading}
                aria-label="Remove uploaded file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-zinc-400 dark:text-zinc-500 mb-1" />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Click to upload or drag and drop a file
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Image, video, or document (Max 50MB)
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg" role="alert">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (!text.trim() && !selectedFile)}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all dark:focus:ring-offset-zinc-900 flex justify-center items-center"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="animate-pulse">Analyzing with Gemini AI...</span>
        ) : (
          'Analyze with CrisisBridge AI'
        )}
      </button>
    </form>
  );
}
