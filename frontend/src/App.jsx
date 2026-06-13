import Sidebar from './components/Sidebar';
import MetricsCard from './components/MetricsCard';
import GraphVisualizer from './features/canvas/GraphVisualizer';
import { useScan } from './hooks/useScan';

export default function App() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    isLoading, 
    error, 
    triggerScan, 
    metrics,
    handleNodeClick, 
    handlePaneClick, 
    activeNode,
    deadCode,
    viewMode,         
    toggleViewMode    
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
          <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
            <MetricsCard metrics={metrics} />
          </div>
        )}
      </main>
    </div>
  );
}