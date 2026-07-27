import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Zap, 
  Cpu, 
  Database, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Filter, 
  RefreshCw,
  BarChart2,
  Lock,
  UserCheck
} from 'lucide-react';
import { AdminStats, SystemLog, UserRole } from '../types';

interface AdminDashboardViewProps {
  logs: SystemLog[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ logs }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredLogs = logs.filter((log) =>
    logFilter === 'ALL' ? true : log.level === logFilter
  );

  const mockUsers = [
    { id: 'usr_1', name: 'Samson Leader', email: 'admin@samson.ai', role: 'admin', plan: 'Enterprise Admin', tokens: '142.8K' },
    { id: 'usr_2', name: 'Elena Vance', email: 'elena@quantum.io', role: 'pro', plan: 'Samson Core Pro', tokens: '89.2K' },
    { id: 'usr_3', name: 'Marcus Brody', email: 'marcus@cyber.org', role: 'user', plan: 'Free AI', tokens: '12.4K' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541]/80 to-[#070B19] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Executive Command & System Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Real-time multi-node cluster health, token traffic metrics, and security controls.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Registered Users
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {stats?.totalUsers || 1482}
          </div>
          <span className="text-[10px] font-mono text-emerald-400">+12% this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> API Requests 24h
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {stats?.apiRequests24h.toLocaleString() || '18,420'}
          </div>
          <span className="text-[10px] font-mono text-cyan-400">340ms average latency</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Total Tokens Processed
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            1.48M
          </div>
          <span className="text-[10px] font-mono text-slate-400">Gemini 3.6 Flash</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> Server Uptime
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {stats?.serverUptime || '99.98%'}
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Node: Samson-V100</span>
        </div>
      </div>

      {/* Model Popularity Distribution */}
      {stats?.modelPopularity && (
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            <span>AI Model Distribution & Traffic Share</span>
          </h3>

          <div className="space-y-3">
            {stats.modelPopularity.map((model) => (
              <div key={model.name} className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-200">
                  <span>{model.name}</span>
                  <span style={{ color: model.color }}>{model.percentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${model.percentage}%`, backgroundColor: model.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
        <h3 className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span>User Access & Role Management</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-slate-100">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-amber-300">{u.plan}</td>
                  <td className="p-3 text-slate-300">{u.tokens}</td>
                  <td className="p-3">
                    <button className="text-cyan-400 hover:underline text-[10px]">
                      Edit Limits
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Logs Console */}
      <div className="p-6 rounded-2xl bg-[#070B19] border border-cyan-500/20 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>Live Neural Cluster System Logs</span>
          </h3>

          <div className="flex items-center gap-2">
            {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLogFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  logFilter === lvl
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                    : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-black/60 border border-slate-900 text-xs custom-scrollbar">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  log.level === 'SUCCESS'
                    ? 'bg-emerald-950 text-emerald-400'
                    : log.level === 'WARN'
                    ? 'bg-amber-950 text-amber-400'
                    : log.level === 'ERROR'
                    ? 'bg-rose-950 text-rose-400'
                    : 'bg-cyan-950 text-cyan-400'
                }`}
              >
                {log.level}
              </span>
              <span className="text-cyan-400">[{log.module}]</span>
              <span className="text-slate-300 flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
