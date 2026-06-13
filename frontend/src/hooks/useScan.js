import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 220;
  const nodeHeight = 80;

  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { layoutedNodes, layoutedEdges: edges };
};

export const useScan = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({ totalFiles: 0, debtFiles: 0 });
  const [activeNode, setActiveNode] = useState(null);
  const [deadCode, setDeadCode] = useState([]); 

  const [viewMode, setViewMode] = useState('architecture'); 
  const [archEdges, setArchEdges] = useState([]);
  const [propEdges, setPropEdges] = useState([]);

  const triggerScan = useCallback(async (targetPath) => {
    setIsLoading(true);
    setError(null);
    setActiveNode(null);
    setViewMode('architecture'); 

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan directory');
      }

      const data = await response.json();
      let debtCount = 0;
      
      const customNodes = data.nodes.map(node => {
        if (node.data.size > 10000) debtCount++;
        return { 
            ...node, 
            type: 'customNode',
            style: { opacity: 1, transition: 'opacity 0.3s ease' }
        };
      });

      const importedNodeIds = new Set(data.edges.map(e => e.target));
      const safeEntryFiles = ['main.jsx', 'main.tsx', 'index.js', 'index.tsx', 'App.jsx', 'App.tsx'];
      const orphans = customNodes
        .filter(n => !importedNodeIds.has(n.id) && !safeEntryFiles.some(safe => n.id.endsWith(safe)))
        .map(n => n.id);
      setDeadCode(orphans);

      // 🟢 THE FIX: Generate "Data Flow" Edges using node.data.jsxDependencies
      const generatedPropEdges = [];
      customNodes.forEach(sourceNode => {
        // Look inside the data object where graphBuilder packed it
        const dependencies = sourceNode.data?.jsxDependencies || sourceNode.jsxDependencies;
        
        if (dependencies) {
          dependencies.forEach(dep => {
            const targetNode = customNodes.find(n => 
              n.id.endsWith(`/${dep.component}.jsx`) || 
              n.id.endsWith(`/${dep.component}.tsx`) || 
              n.id === `${dep.component}.jsx`
            );

            if (targetNode) {
              generatedPropEdges.push({
                id: `prop-${sourceNode.id}-${targetNode.id}`,
                source: sourceNode.id,
                target: targetNode.id,
                label: dep.props.length > 0 ? dep.props.join(', ') : 'no props', 
                animated: true,
                style: { stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '5,5' }, 
                labelStyle: { fill: '#cbd5e1', fontSize: 10, fontWeight: 700 },
                labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8, rx: 4, ry: 4 },
                labelBgPadding: [4, 4]
              });
            }
          });
        }
      });

      const { layoutedNodes, layoutedEdges } = getLayoutedElements(customNodes, data.edges);

      setNodes(layoutedNodes);
      setArchEdges(layoutedEdges);
      setPropEdges(generatedPropEdges);
      setEdges(layoutedEdges); 
      setMetrics({ totalFiles: customNodes.length, debtFiles: debtCount });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  const toggleViewMode = useCallback((mode) => {
    setViewMode(mode);
    setEdges(mode === 'architecture' ? archEdges : propEdges);
    setActiveNode(null); 
    setNodes((nds) => nds.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
  }, [archEdges, propEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback((event, clickedNode) => {
    if (viewMode !== 'architecture') return; 

    setActiveNode(clickedNode.id);
    const affectedNodeIds = new Set([clickedNode.id]);
    const queue = [clickedNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift();
      edges.forEach(edge => {
        if (edge.target === currentId && !affectedNodeIds.has(edge.source)) {
          affectedNodeIds.add(edge.source);
          queue.push(edge.source);
        }
      });
    }

    setNodes((nds) => nds.map(n => ({
      ...n,
      style: { ...n.style, opacity: affectedNodeIds.has(n.id) ? 1 : 0.2 }
    })));

    setEdges((eds) => eds.map(e => {
      const isAffected = affectedNodeIds.has(e.source) && affectedNodeIds.has(e.target);
      return {
        ...e,
        animated: isAffected,
        style: {
          ...e.style,
          opacity: isAffected ? 1 : 0.1,
          stroke: isAffected ? '#ef4444' : '#94a3b8',
          strokeWidth: isAffected ? 3 : 2,
          transition: 'all 0.3s ease'
        }
      };
    }));
  }, [edges, viewMode, setNodes, setEdges]);

  const handlePaneClick = useCallback(() => {
    setActiveNode(null);
    setNodes((nds) => nds.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
    setEdges(viewMode === 'architecture' ? archEdges : propEdges);
  }, [viewMode, archEdges, propEdges, setNodes, setEdges]);

  return { 
    nodes, edges, onNodesChange, onEdgesChange, isLoading, error, triggerScan, metrics,
    handleNodeClick, handlePaneClick, activeNode, deadCode,
    viewMode, toggleViewMode 
  };
};