import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MetricsCard from './components/MetricsCard';
import GraphVisualizer from './features/canvas/GraphVisualizer';
import { useScan } from './hooks/useScan';
import { Map, MousePointerClick, Share2, Sparkles, X } from 'lucide-react';

export default function App() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, isLoading, error, triggerScan, 
    metrics, handleNodeClick, handlePaneClick, activeNode, deadCode, viewMode, toggleViewMode    
  } = useScan();

  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('astra_onboarded') !== 'true';
  });

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('astra_onboarded', 'true');
  };

  useEffect(() => {
    if (nodes.length > 0) dismissWelcome();
  }, [nodes.length]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <Sidebar 
        onScan={triggerScan} 
        isLoading={isLoading} 
        error={error} 
        activeNode={activeNode}
        onReset={handlePaneClick}
        deadCode={deadCode}
        viewMode={viewMode}             
        onToggleViewMode={toggleViewMode} 
      />
      
      <main className="flex-1 relative">
        
        {showWelcome && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative max-w-xl bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-slate-300">
              
              <button 
                onClick={dismissWelcome}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-emerald-400" size={28} />
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to ASTra</h2>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Your local static analysis engine. To get started, follow these three steps:
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 shadow-sm shrink-0">
                    <Map size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">1. Target a Directory</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Paste the absolute path to your React project's <code className="text-emerald-400/70 font-mono bg-emerald-400/10 px-1 rounded">src</code> folder in the sidebar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-red-400 shadow-sm shrink-0">
                    <MousePointerClick size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">2. Trace the Blast Radius</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Click on any file node on the canvas to instantly dim unrelated files and trace its downstream dependencies.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-cyan-400 shadow-sm shrink-0">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">3. Inspect Prop-Drilling</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Switch the sidebar toggle to <strong>Data Flow</strong> mode to reveal the hidden JSX props passing between components.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={dismissWelcome}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
              >
                Got it, let's map some code!
              </button>
            </div>
          </div>
        )}

        {nodes.length === 0 && !showWelcome && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-sm z-10 pointer-events-none">
            Enter a local absolute directory path to generate the AST map.
          </div>
        )}

        <GraphVisualizer 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
        />

        {nodes.length > 0 && (
          <div className="absolute bottom-6 right-6 z-10 pointer-events-none animate-in fade-in slide-in-from-bottom-4">
            <MetricsCard metrics={metrics} />
          </div>
        )}
      </main>
    </div>
  );
}