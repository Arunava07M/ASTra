export const buildGraph = (parsedFiles) => {
    const nodes = [];
    const edges = [];

    parsedFiles.forEach((file) => {
        nodes.push({
            id: file.id,
            type: 'default',
            data: { 
                label: file.id.split('/').pop(),
                fullPath: file.id,
                size: file.size,
                // 🟢 THE FIX: Pass the parsed props down to the frontend
                jsxDependencies: file.jsxDependencies || [] 
            },
            position: { x: Math.random() * 600, y: Math.random() * 600 } 
        });

        file.imports.forEach(targetId => {
            edges.push({
                id: `edge-${file.id}-${targetId}`,
                source: file.id,
                target: targetId,
                animated: true,
                style: { stroke: '#94a3b8', strokeWidth: 2 }
            });
        });
    });

    return { nodes, edges };
};