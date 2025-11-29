import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, ArrowUp, ArrowDown, Activity, Globe, Users, Clock, MousePointer } from 'lucide-react';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [realtimeVisitors, setRealtimeVisitors] = useState(124);
  const [bounceRate, setBounceRate] = useState(42.5);
  
  // Simulate realtime fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeVisitors(prev => Math.max(80, prev + Math.floor(Math.random() * 10) - 5));
      setBounceRate(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const trafficData = [
    { name: 'Mon', views: 400 + Math.floor(Math.random() * 50), visitors: 240 },
    { name: 'Tue', views: 300 + Math.floor(Math.random() * 50), visitors: 139 },
    { name: 'Wed', views: 600 + Math.floor(Math.random() * 50), visitors: 480 },
    { name: 'Thu', views: 800 + Math.floor(Math.random() * 50), visitors: 590 },
    { name: 'Fri', views: 500 + Math.floor(Math.random() * 50), visitors: 300 },
    { name: 'Sat', views: 900 + Math.floor(Math.random() * 50), visitors: 650 },
    { name: 'Sun', views: 700 + Math.floor(Math.random() * 50), visitors: 480 },
  ];

  const sourceData = [
    { name: 'Organic Search', value: 45 },
    { name: 'Social Media', value: 25 },
    { name: 'Direct', value: 20 },
    { name: 'Referral', value: 10 },
  ];

  const referringDomains = [
    { domain: 'google.com', visits: 1250, change: '+12%' },
    { domain: 'twitter.com', visits: 854, change: '+5%' },
    { domain: 'facebook.com', visits: 620, change: '-2%' },
    { domain: 'linkedin.com', visits: 412, change: '+8%' },
    { domain: 'medium.com', visits: 180, change: '+15%' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  const StatCard = ({ title, value, icon: Icon, change, isGood }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
       <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
             <Icon size={20} />
          </div>
          {change && (
             <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isGood ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {isGood ? <ArrowUp size={12}/> : <ArrowDown size={12}/>} {change}
             </span>
          )}
       </div>
       <div>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
          <p className="text-sm text-slate-500 mt-1">{title}</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
           <p className="text-slate-500">Real-time data and historical performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <Calendar size={16} className="text-slate-400 ml-2"/>
           <select 
             className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer py-1.5 pl-2 pr-8"
             value={dateRange}
             onChange={(e) => setDateRange(e.target.value)}
           >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
           </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg shadow-blue-200">
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4 opacity-80">
                  <Activity size={20} className="animate-pulse"/>
                  <span className="text-sm font-medium uppercase tracking-wider">Active Users</span>
               </div>
               <h3 className="text-4xl font-bold">{realtimeVisitors}</h3>
               <p className="text-sm opacity-70 mt-1">Right now</p>
            </div>
            {/* Background Decoration */}
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
               <Activity size={120} />
            </div>
         </div>

         <StatCard 
            title="Avg. Bounce Rate" 
            value={`${bounceRate}%`} 
            icon={MousePointer} 
            change="2.1%" 
            isGood={false} // Bounce rate going up is usually bad
         />
         <StatCard 
            title="Avg. Session Duration" 
            value="4m 32s" 
            icon={Clock} 
            change="12%" 
            isGood={true} 
         />
         <StatCard 
            title="Total Unique Visitors" 
            value="12,543" 
            icon={Users} 
            change="8.4%" 
            isGood={true} 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Traffic Overview</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Globe size={18} className="text-green-500"/> Traffic Sources</h3>
          <ResponsiveContainer width="100%" height="60%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {sourceData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-slate-600">{entry.name}</span>
                 </div>
                 <span className="font-bold text-slate-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referrers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Top Referring Domains</h3>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
               <tr>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Visits</th>
                  <th className="px-6 py-3">Trend</th>
                  <th className="px-6 py-3 text-right">Bounce Rate</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {referringDomains.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                     <td className="px-6 py-4 font-medium text-slate-700">{item.domain}</td>
                     <td className="px-6 py-4 text-slate-600">{item.visits}</td>
                     <td className={`px-6 py-4 font-bold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{item.change}</td>
                     <td className="px-6 py-4 text-right text-slate-600">{(30 + Math.random() * 20).toFixed(1)}%</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Analytics;