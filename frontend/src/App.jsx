import Sidebar from './components/Sidebar';
import MetricsCard from './components/MetricsCard';
import GraphVisualizer from './features/canvas/GraphVisualizer';
import { useScan } from './hooks/useScan';
import { Map, MousePointerClick, Share2, Sparkles } from 'lucide-react'; // 🟢 NEW ICONS

export default function App() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, isLoading, error, triggerScan, 
    metrics, handleNodeClick, handlePaneClick, activeNode, deadCode, viewMode, toggleViewMode    
  } = useScan();

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
        {nodes.length === 0 && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-6">
            <div className="max-w-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-slate-300 animate-in fade-in zoom-in duration-500">
              
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-emerald-400" size={28} />
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to ASTra</h2>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Your local static analysis engine. To get started, follow these three steps:
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 shadow-sm shrink-0">
                    <Map size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">1. Target a Directory</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Paste the absolute path to your React project's <code className="text-emerald-400/70 font-mono bg-emerald-400/10 px-1 rounded">src</code> folder in the sidebar to generate the map.</p>
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
                    <p className="text-xs text-slate-500 leading-relaxed">Switch the sidebar toggle to <strong>Data Flow</strong> mode to reveal the hidden JSX props passing between your components.</p>
                  </div>
                </div>
              </div>

            </div>
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