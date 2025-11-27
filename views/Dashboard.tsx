import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertOctagon, Activity, Globe } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
    setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const stats = [
    { title: 'Global Threat Level', value: 'ELEVATED', color: 'text-yellow-400', icon: AlertOctagon },
    { title: 'System Status', value: 'SECURE', color: 'text-cyber-neon', icon: Shield },
    { title: 'Active Scanners', value: '5', color: 'text-cyber-blue', icon: Activity },
    { title: 'Network Traffic', value: 'NORMAL', color: 'text-gray-300', icon: Globe },
  ];

  const data = [
    { name: 'Phishing', threats: 65 },
    { name: 'Malware', threats: 45 },
    { name: 'DDoS', threats: 30 },
    { name: 'SQL Inj', threats: 55 },
    { name: 'XSS', threats: 40 },
    { name: 'Brute Force', threats: 25 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
        <div>
            <h1 className="text-4xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-gray-400">Real-time security monitoring and threat intelligence.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-gray-900 border border-cyber-neon/30 rounded text-cyber-neon font-mono text-sm shadow-[0_0_10px_rgba(0,255,65,0.1)]">
            LIVE_FEED_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-cyber-dark p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="text-gray-600" size={24} />
              <div className={`h-2 w-2 rounded-full ${stat.value === 'SECURE' ? 'bg-cyber-neon' : 'bg-yellow-400'}`}></div>
            </div>
            <div className="text-sm text-gray-500 font-mono mb-1">{stat.title.toUpperCase()}</div>
            <div className={`text-2xl font-bold ${stat.color} tracking-tight`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-cyber-dark p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="mr-2 text-cyber-blue" size={20}/>
                Global Threat Trends
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#00ccff' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="threats" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00ccff' : '#0099cc'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-cyber-dark p-6 rounded-xl border border-gray-800 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4 flex-1">
                <button onClick={() => setView(AppView.URL_SCANNER)} className="w-full text-left p-4 rounded bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-all group">
                    <div className="text-cyber-neon font-mono text-sm mb-1 group-hover:text-white">SCAN_URL</div>
                    <div className="text-xs text-gray-500">Check link reputation and malware.</div>
                </button>
                <button onClick={() => setView(AppView.PASSWORD_CHECKER)} className="w-full text-left p-4 rounded bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-all group">
                    <div className="text-cyber-neon font-mono text-sm mb-1 group-hover:text-white">AUDIT_PASSWORD</div>
                    <div className="text-xs text-gray-500">Test credential strength entropy.</div>
                </button>
                <button onClick={() => setView(AppView.EDUCATION)} className="w-full text-left p-4 rounded bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-all group">
                    <div className="text-cyber-neon font-mono text-sm mb-1 group-hover:text-white">ACCESS_KNOWLEDGE_BASE</div>
                    <div className="text-xs text-gray-500">Latest articles and best practices.</div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};