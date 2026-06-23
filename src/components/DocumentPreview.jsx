import React, { useRef, useEffect, useState } from 'react';
import { 
  Printer, 
  FileDown, 
  Eye, 
  FileSpreadsheet,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { exportToDoc } from '../utils/docxExporter';

/**
 * Simulates a professional A4 sheet with contentEditable rich text editing
 * and a standard formatting toolbar, enabling full document editing in-browser.
 */
export default function DocumentPreview({ 
  htmlContent, 
  onContentChange, 
  docType, 
  toneMode, 
  draftingLanguage,
  onVerify,
  isVerifying,
  verificationReport,
  setVerificationReport
}) {
  const editorRef = useRef(null);
  const [zoom, setZoom] = useState(1.0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Sync external changes (e.g. initial LLM generation or chat refinement)
  // but avoid updating innerHTML while the user is actively typing.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [htmlContent]);

  const handleInput = (e) => {
    const newHtml = e.currentTarget.innerHTML;
    onContentChange(newHtml);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWordExport = () => {
    if (!htmlContent) return;
    
    const cleanDocType = docType.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const cleanTone = toneMode.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = `official_${cleanDocType}_${cleanTone}.doc`;
    
    exportToDoc(htmlContent, fileName, draftingLanguage);
  };

  // Run native document command for editing formatting
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };
  return (
    <div className="flex flex-col h-full bg-[#040406]">
      {/* Top Toolbar */}
      <div className="flex flex-col border-b border-white/5 bg-[#0a0a0e]/90 shrink-0 print:hidden">
        
        {/* Title & Action Buttons */}
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold font-space tracking-wider text-cyan-400 uppercase">Interactive Document Editor & Preview</span>
          </div>
          
          {htmlContent && (
            <div className="flex items-center gap-3">
              {/* Page Magnifier (Zoom Controls) */}
              <div className="flex items-center gap-1.5 bg-[#08080a] border border-white/10 rounded-lg p-0.5 px-1.5 select-none">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-zinc-300 font-space min-w-[36px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 2.0}
                  className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={onVerify}
                disabled={isVerifying}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-900/40 border border-indigo-500/25 hover:border-indigo-400 hover:bg-indigo-950/60 text-indigo-300 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-450" />
                )}
                {isVerifying ? 'Verifying...' : 'Verify Draft'}
              </button>

              <button
                onClick={handleWordExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cyber-button-secondary rounded-lg transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                Word Export
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cyber-button-primary rounded-lg transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          )}
        </div>

        {/* Rich Text Editor Toolbar */}
        {htmlContent && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#08080a] border-t border-white/5 px-3">
            <button
              onClick={() => execCmd('bold')}
              title="Bold"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('italic')}
              title="Italic"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('underline')}
              title="Underline"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('strikeThrough')}
              title="Strikethrough"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-zinc-800 mx-1" />

            <button
              onClick={() => execCmd('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyRight')}
              title="Align Right"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyFull')}
              title="Justify"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-zinc-800 mx-1" />

            <button
              onClick={() => execCmd('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto bg-[#040406] hologram-grid p-4 flex flex-col h-[calc(100vh-150px)] scrollbar-thin box-border">
        {htmlContent ? (
          /* A4 Sheet Simulation container */
          <div
            id="document-preview-container"
            className="a4-page animate-fade-in text-black flex flex-col box-border"
            style={{ zoom }}
          >
            {/* The editable canvas area */}
            <div 
              ref={editorRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleInput}
              className={`a4-content leading-relaxed text-justify w-full focus:outline-none w-full cursor-text ${
                draftingLanguage === 'Telugu' ? 'font-telugu' : 'font-english'
              }`}
              title="Click anywhere to edit this official document draft directly."
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto self-center space-y-3 py-20">
            <div className="p-4 rounded-full bg-zinc-900 border border-white/5 text-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <FileSpreadsheet className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-space tracking-wider text-cyan-400 uppercase">No Document Drafted Yet</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Upload a style reference, enter the required metadata, describe your situation, and click "Generate" to see the preview.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verification Report Modal */}
      {verificationReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-[#0b0b0f] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glow-card">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#08080a]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold font-space tracking-wider text-indigo-400 uppercase">Legal & Format Audit Verification</h3>
              </div>
              <button
                onClick={() => setVerificationReport('')}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-[#040406] leading-relaxed">
              <div 
                className="a4-page-content font-serif text-justify bg-white text-black p-8 rounded-xl shadow-lg border border-zinc-200"
                dangerouslySetInnerHTML={{ __html: verificationReport }}
              />
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-[#08080a] flex justify-end">
              <button
                onClick={() => setVerificationReport('')}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 border border-white/5 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
