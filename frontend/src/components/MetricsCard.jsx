import { Activity, FileWarning } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl flex gap-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1 uppercase">
          <Activity size={14} /> Total Files
        </div>
        <span className="text-2xl font-mono text-emerald-400 font-bold">{metrics.totalFiles}</span>
      </div>
      
      <div className="w-px bg-slate-700"></div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1 uppercase">
          <FileWarning size={14} className="text-amber-500" /> High Debt
        </div>
        <span className="text-2xl font-mono text-amber-500 font-bold">{metrics.debtFiles}</span>
      </div>
    </div>
  );
}