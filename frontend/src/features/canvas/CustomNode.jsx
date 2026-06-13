import { Handle, Position } from '@xyflow/react';
import { FileCode2 } from 'lucide-react';

const getTechDebtColor = (size) => {
  if (size > 50000) return 'border-red-500 bg-red-950/30 text-red-400';
  if (size > 10000) return 'border-amber-500 bg-amber-950/30 text-amber-400';
  return 'border-emerald-500 bg-emerald-950/30 text-emerald-400';
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
};

export default function CustomNode({ data }) {
  const styleClass = getTechDebtColor(data.size);

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${styleClass} backdrop-blur-sm min-w-[150px]`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
      
      <div className="flex items-center gap-3">
        <FileCode2 size={20} />
        <div>
          <div className="font-mono text-sm font-bold text-slate-100">{data.label}</div>
          <div className="font-mono text-xs mt-1">{formatSize(data.size)}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
    </div>
  );
}