import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  UploadCloud, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  FileCode, 
  FileCheck, 
  Trash2, 
  HelpCircle,
  Loader2,
  Plus,
  CornerDownRight,
  Edit2
} from 'lucide-react';
import { CANONICAL_EXAMPLE_NOTES, STUDENT_CLUB_NOTES, CAPSTONE_PROJECT_NOTES } from '../sampleData';

interface AnalyzeScreenProps {
  onAnalyze: (notes: string, fileName?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: number; // 1, 2, 3, or 4
  error: string | null;
  onClearError: () => void;
  initialNotes?: string;
  existingNotes?: string;
  isAddMoreMode?: boolean;
  onCancelAddMore?: () => void;
  onStartFresh?: () => void;
  onEnterAddMoreMode?: () => void;
}

interface UploadedFileMetadata {
  file: File;
  name: string;
  type: string;
  size: number;
  sizeFormatted: string;
}

export const AnalyzeScreen: React.FC<AnalyzeScreenProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
  error,
  onClearError,
  initialNotes = '',
  existingNotes = '',
  isAddMoreMode = false,
  onCancelAddMore,
  onStartFresh,
  onEnterAddMoreMode,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [notes, setNotes] = useState(initialNotes || '');
  
  // Add More Notes workflow state
  const [isInAddMore, setIsInAddMore] = useState(Boolean(isAddMoreMode));
  const [preservedNotes, setPreservedNotes] = useState(existingNotes || '');
  const [isEditingPreserved, setIsEditingPreserved] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileMetadata | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddMoreMode !== undefined) {
      setIsInAddMore(Boolean(isAddMoreMode));
    }
  }, [isAddMoreMode]);

  useEffect(() => {
    if (existingNotes) {
      setPreservedNotes(existingNotes);
    }
  }, [existingNotes]);

  useEffect(() => {
    if (initialNotes && !isAddMoreMode) {
      setNotes(initialNotes);
      setActiveTab('paste');
    }
  }, [initialNotes, isAddMoreMode]);

  const getCombinedNotes = (existing: string, additional: string): string => {
    const cleanExisting = (existing || '').trim();
    const cleanAdditional = (additional || '').trim();
    if (!cleanExisting) return cleanAdditional;
    if (!cleanAdditional) return cleanExisting;
    return `${cleanExisting}\n\n${cleanAdditional}`;
  };

  const combinedNotes = getCombinedNotes(preservedNotes, additionalNotes);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    if (error) onClearError();

    const ext = getFileExtension(file.name);
    const validExtensions = ['.pdf', '.docx', '.txt'];

    if (!validExtensions.includes(ext)) {
      setUploadError('Unsupported file type. Please upload PDF, DOCX or TXT.');
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      setUploadError('File is too large. Maximum file size is 10 MB.');
      return;
    }

    let displayType = 'TXT';
    if (ext === '.pdf') displayType = 'PDF';
    if (ext === '.docx') displayType = 'DOCX';

    setSelectedFile({
      file,
      name: file.name,
      type: displayType,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzePaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || isLoading) return;
    onAnalyze(notes);
  };

  const handleAnalyzeUpdatedNotes = () => {
    if (!additionalNotes.trim() || isLoading) return;
    onAnalyze(combinedNotes);
  };

  const handleAnalyzeUploadedDocument = async () => {
    if (!selectedFile || isLoading || isExtractingText) return;

    setUploadError(null);
    if (error) onClearError();
    setIsExtractingText(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile.file);

      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'No readable text was found in this document. Please upload a text-based PDF, DOCX or TXT file.'
        );
      }

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No readable text was found in this document. Please upload a text-based PDF, DOCX or TXT file.');
      }

      setIsExtractingText(false);
      // If in add more mode, combine with preserved notes
      if (isInAddMore && preservedNotes.trim()) {
        const combinedDocNotes = getCombinedNotes(preservedNotes, data.text);
        await onAnalyze(combinedDocNotes, selectedFile.name);
      } else {
        await onAnalyze(data.text, selectedFile.name);
      }
    } catch (err: any) {
      setIsExtractingText(false);
      setUploadError(err.message || 'No readable text was found in this document. Please upload a text-based PDF, DOCX or TXT file.');
    }
  };

  const handlePopulateExtractedIntoAdditional = async () => {
    if (!selectedFile || isLoading || isExtractingText) return;

    setUploadError(null);
    if (error) onClearError();
    setIsExtractingText(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile.file);

      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.text || data.text.trim().length === 0) {
        throw new Error(data.error || 'No readable text was found in this document.');
      }

      setIsExtractingText(false);
      setAdditionalNotes((prev) => (prev ? `${prev}\n\n${data.text}` : data.text));
      setActiveTab('paste');
    } catch (err: any) {
      setIsExtractingText(false);
      setUploadError(err.message || 'No readable text was found in this document.');
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setNotes(presetText);
    setActiveTab('paste');
    if (error) onClearError();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isInAddMore ? 'Add More Notes' : 'Analyze Meeting Notes'}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          {isInAddMore 
            ? 'Append additional meeting notes without losing your current analysis or decisions.'
            : 'Paste your rough meeting notes or upload a document to separate confirmed decisions from open questions and action items.'}
        </p>
      </div>

      {/* ADD MORE NOTICES / PROMPT BANNER */}
      {isInAddMore ? (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-900 dark:text-indigo-200 shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Appending Notes to Current Meeting</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-300/90 mt-0.5">
                Existing notes are preserved. Add more lines below and click <strong>"Analyze Updated Notes"</strong> to re-analyze all notes together.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onCancelAddMore && (
              <button
                type="button"
                onClick={onCancelAddMore}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors text-indigo-800 dark:text-indigo-200"
              >
                Cancel & Return
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsInAddMore(false);
                if (onStartFresh) onStartFresh();
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              Start Fresh Instead
            </button>
          </div>
        </div>
      ) : (
        preservedNotes.trim() && (
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>You have an active meeting session with analyzed notes.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsInAddMore(true);
                if (onEnterAddMoreMode) onEnterAddMoreMode();
              }}
              className="px-3 py-1.5 font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors border border-indigo-300 dark:border-indigo-700/60 flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add More Notes to Current Meeting</span>
            </button>
          </div>
        )
      )}

      {/* ERROR STATES */}
      {(error || uploadError) && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 flex items-start justify-between gap-3 text-rose-800 dark:text-rose-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">We couldn’t analyze these notes.</div>
              <div className="text-xs text-rose-700 dark:text-rose-300/90 mt-1">{uploadError || error}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setUploadError(null);
              onClearError();
              if (activeTab === 'paste') {
                if (isInAddMore && additionalNotes.trim()) {
                  onAnalyze(combinedNotes);
                } else if (notes.trim()) {
                  onAnalyze(notes);
                }
              }
              if (activeTab === 'upload' && selectedFile) handleAnalyzeUploadedDocument();
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shrink-0 shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING STATE OVERLAY / CARD */}
      {isLoading || isExtractingText ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#0B0F1C] border border-slate-200 dark:border-indigo-500/30 text-center shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isExtractingText ? 'Reading document text…' : 'Analyzing your meeting notes…'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            Extracting grounded decisions, distinguishing suggestions from commitments, and parsing action owners.
          </p>

          {/* Four subtle processing steps matching specification */}
          <div className="max-w-md mx-auto space-y-3 text-left">
            {/* Step 1: Reading meeting notes… */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              loadingStep >= 1 
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-200 font-medium' 
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  loadingStep > 1 
                    ? 'bg-emerald-500 text-white dark:text-slate-900' 
                    : loadingStep === 1 
                      ? 'bg-indigo-600 text-white animate-spin' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {loadingStep > 1 ? '✓' : '1'}
                </span>
                <span className="text-sm">Reading meeting notes…</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {loadingStep > 1 ? 'Done' : loadingStep === 1 ? 'Processing…' : 'Waiting'}
              </span>
            </div>

            {/* Step 2: Identifying decisions… */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              loadingStep >= 2 
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-200 font-medium' 
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  loadingStep > 2 
                    ? 'bg-emerald-500 text-white dark:text-slate-900' 
                    : loadingStep === 2 
                      ? 'bg-indigo-600 text-white animate-spin' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {loadingStep > 2 ? '✓' : '2'}
                </span>
                <span className="text-sm">Identifying decisions…</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {loadingStep > 2 ? 'Done' : loadingStep === 2 ? 'Processing…' : 'Waiting'}
              </span>
            </div>

            {/* Step 3: Extracting action items… */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              loadingStep >= 3 
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-200 font-medium' 
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  loadingStep > 3 
                    ? 'bg-emerald-500 text-white dark:text-slate-900' 
                    : loadingStep === 3 
                      ? 'bg-indigo-600 text-white animate-spin' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {loadingStep > 3 ? '✓' : '3'}
                </span>
                <span className="text-sm">Extracting action items…</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {loadingStep > 3 ? 'Done' : loadingStep === 3 ? 'Processing…' : 'Waiting'}
              </span>
            </div>

            {/* Step 4: Preparing your meeting summary… */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              loadingStep >= 4 
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-200 font-medium' 
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  loadingStep === 4 
                    ? 'bg-indigo-600 text-white animate-spin' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  4
                </span>
                <span className="text-sm">Preparing your meeting summary…</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {loadingStep >= 4 ? 'Finalizing…' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN INPUT CONTAINER WITH TWO WAYS TO PROVIDE CONTENT */
        <div className="space-y-6">
          {/* INPUT MODE TABS */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors">
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('paste');
                  setUploadError(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'paste'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Meeting Notes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setUploadError(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Meeting Document</span>
              </button>
            </div>

            {/* DEMO MODE: Try Example Presets (clearly separated from real input) */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Demo Mode:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset(CANONICAL_EXAMPLE_NOTES)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-indigo-700 dark:text-indigo-300 font-medium transition-colors border border-slate-200 dark:border-slate-700/50"
              >
                Try Example Notes
              </button>
            </div>
          </div>

          {/* OPTION A: PASTE MEETING NOTES (ADD-MORE WORKFLOW) */}
          {activeTab === 'paste' && isInAddMore && (
            <div className="space-y-6">
              {/* CARD 1: PRESERVED EXISTING MEETING NOTES */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-md space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Preserved Meeting Notes
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      Preserved
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingPreserved(!isEditingPreserved)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingPreserved ? 'Done Editing' : 'Edit Preserved Notes'}</span>
                  </button>
                </div>

                {isEditingPreserved ? (
                  <textarea
                    rows={5}
                    value={preservedNotes}
                    onChange={(e) => setPreservedNotes(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono text-xs md:text-sm leading-relaxed resize-y transition-colors"
                    placeholder="Existing notes..."
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 font-mono text-xs md:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed border-l-4 border-l-indigo-500 shadow-inner">
                    {preservedNotes || '(No previous notes found)'}
                  </div>
                )}
              </div>

              {/* CARD 2: ADDITIONAL NOTES TO APPEND */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-md space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label htmlFor="additional-notes" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Add More Notes
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                      New Addition
                    </span>
                  </div>

                  {additionalNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAdditionalNotes('')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  id="additional-notes"
                  rows={6}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={`Paste or type additional notes to append…

Example:
Sachin: I will handle the backend API.
Satyam: We could add dark mode later.`}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono text-sm leading-relaxed resize-y transition-colors"
                />
              </div>

              {/* CARD 3: COMBINED MEETING NOTES (Requirement 5: Show the combined notes clearly) */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-md space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Combined Meeting Notes
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {combinedNotes.split('\n').filter(Boolean).length} lines total
                    </span>
                  </div>

                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Sent for complete analysis
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-black/70 border border-slate-200 dark:border-slate-800 font-mono text-xs md:text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border-dashed shadow-inner">
                  {combinedNotes}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  The complete transcript combining your preserved and newly added notes will be analyzed together so all decisions and action items stay coherent.
                </p>

                {/* Bottom Row & Analyze Updated Notes Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Never guesses missing owners or deadlines. Preserves exact source traceability.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyzeUpdatedNotes}
                    disabled={!additionalNotes.trim() || isLoading}
                    className={`px-7 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                      additionalNotes.trim() && !isLoading
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Analyze Updated Notes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OPTION A: NORMAL PASTE MEETING NOTES */}
          {activeTab === 'paste' && !isInAddMore && (
            <form onSubmit={handleAnalyzePaste} className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-xl space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Paste Meeting Notes
                  </label>

                  {notes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNotes('')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                    >
                      Clear Notes
                    </button>
                  )}
                </div>

                {/* Textarea */}
                <textarea
                  id="notes"
                  rows={10}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Paste your real meeting notes here…

Example:
Rahul: We agreed to use React for the frontend.
Priya: I will prepare the dataset by Friday.
Aman: We could add dark mode later.
Who will handle deployment?`}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono text-sm leading-relaxed resize-y transition-colors"
                />

                {/* Bottom Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Never guesses missing owners or deadlines. Preserves exact source traceability.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!notes.trim()}
                    className={`px-7 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                      notes.trim()
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>✨ Analyze Notes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* OPTION B: UPLOAD MEETING DOCUMENT */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-xl space-y-6 transition-colors">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>{isInAddMore ? 'Upload Document to Append' : 'Upload Meeting Notes'}</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isInAddMore
                      ? 'Upload a document transcript to append to your preserved meeting notes.'
                      : 'Upload your meeting transcript or minutes. Text is extracted locally and analyzed with AI.'}
                  </p>
                </div>

                {/* Drag and Drop Zone */}
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-black/40 hover:bg-slate-100/70 dark:hover:bg-black/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
                      <UploadCloud className="w-7 h-7" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Drag & drop your meeting document here
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      or <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Browse Files</span>
                    </p>

                    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Supported formats: <strong>PDF, DOCX, TXT</strong></span>
                      <span>·</span>
                      <span>Maximum file size: <strong>10 MB</strong></span>
                    </div>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0 font-bold text-xs uppercase shadow-sm">
                        {selectedFile.type}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-sm">
                          {selectedFile.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                            {selectedFile.type}
                          </span>
                          <span>{selectedFile.sizeFormatted}</span>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready for extraction
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      {isInAddMore && (
                        <button
                          type="button"
                          onClick={handlePopulateExtractedIntoAdditional}
                          disabled={isExtractingText}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/30 transition-all flex items-center gap-1.5"
                        >
                          <span>Insert into Add More Field</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleAnalyzeUploadedDocument}
                        disabled={isExtractingText}
                        className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-[0.98]"
                      >
                        {isExtractingText ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Extracting text…</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isInAddMore ? 'Analyze Updated Notes' : 'Analyze Document'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional Note */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Text is extracted from text-based PDF, DOCX, or TXT documents. Scanned/image-only PDFs are not supported.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
