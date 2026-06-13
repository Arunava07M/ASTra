import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 
import CustomNode from './CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

export default function GraphVisualizer({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onNodeClick, 
  onPaneClick 
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-slate-950"
    >
      <Background color="#334155" gap={20} size={1} />
      <Controls className="bg-slate-900 border-slate-800 fill-slate-300" />
      <MiniMap 
        nodeColor={(n) => {
          if (n.data?.size > 50000) return '#ef4444';
          if (n.data?.size > 10000) return '#f59e0b';
          return '#10b981';
        }}
        maskColor="rgba(15, 23, 42, 0.7)"
        className="bg-slate-900 border border-slate-800"
      />
    </ReactFlow>
  );
}