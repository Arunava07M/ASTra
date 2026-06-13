import { useState } from 'react';
import { FolderSearch, AlertCircle, Loader2, Zap, FileX, Network, Share2 } from 'lucide-react';
import ASTraLogo from './ASTraLogo';

export default function Sidebar({ 
  onScan, isLoading, error, activeNode, onReset, deadCode, viewMode, onToggleViewMode 
}) {
  const [path, setPath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (path.trim()) onScan(path.trim());
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full text-slate-200 z-20 shadow-2xl relative">
      <div className="mb-8 shrink-0">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3 tracking-tight">
                <ASTraLogo className="w-8 h-8 shrink-0 drop-shadow-md" />
                ASTra
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-mono ml-11">Codebase Architecture Mapper</p>
       </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 shrink-0 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Target Directory (Absolute Path)
          </label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="C:/projects/my-app"
            className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !path}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 rounded transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Map Architecture'}
        </button>
      </form>

      <div className="flex bg-slate-950 rounded-lg p-1 shrink-0 mb-4 border border-slate-800">
        <button
          onClick={() => onToggleViewMode('architecture')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            viewMode === 'architecture' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Network size={14} /> Architecture
        </button>
        <button
          onClick={() => onToggleViewMode('dataFlow')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            viewMode === 'dataFlow' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Share2 size={14} /> Data Flow
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-950/50 border border-red-900 rounded-md flex items-start gap-3 shrink-0">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400 break-words">{error}</p>
        </div>
      )}

      {deadCode && deadCode.length > 0 && !activeNode && (
        <div className="mt-4 flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-500 font-bold mb-3 uppercase text-xs tracking-wider shrink-0">
            <FileX size={16} />
            Dead Code Graveyard ({deadCode.length})
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 overflow-y-auto flex-1 custom-scrollbar">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
              Files with 0 incoming imports
            </p>
            <ul className="flex flex-col gap-2">
              {deadCode.map(file => (
                <li key={file} className="text-xs font-mono text-slate-400 break-words truncate" title={file}>
                  {file.split('/').pop()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeNode && viewMode === 'architecture' && (
        <div className="mt-auto pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 shrink-0">
          <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
              <Zap size={18} />
              Blast Radius Active
            </div>
            <p className="text-xs text-slate-400 font-mono break-words mb-4">
              Showing files dependent on: <br/>
              <span className="text-slate-300">{activeNode.split('/').pop()}</span>
            </p>
            <button 
              onClick={onReset}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}