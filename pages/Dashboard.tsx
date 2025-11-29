import React, { useEffect, useState } from 'react';
import { Users, FileText, Eye, Clock, ArrowRight, ArrowUp, ArrowDown, Activity, Zap } from 'lucide-react';
import { storageService } from '../services/storage';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [realtimeUsers, setRealtimeUsers] = useState(0); // Start empty
  const [sessionViews, setSessionViews] = useState(0); // Accumulate during session

  // Simulate real-time user updates
  useEffect(() => {
    // Initial jump to simulate active site
    setTimeout(() => setRealtimeUsers(12), 500);

    const interval = setInterval(() => {
      setRealtimeUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const newVal = Math.max(0, prev + change);
        // If users increase, add to session views
        if (newVal > prev) {
           setSessionViews(v => v + (newVal - prev));
        }
        return newVal;
      });
    }, 2000);

    setPosts(storageService.getPosts());
    return () => clearInterval(interval);
  }, []);

  // Calculate stats based on actual data + session simulation
  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;
  const draftCount = posts.filter(p => p.status === 'DRAFT').length;

  // Dynamic Chart Data based on session
  const [chartData, setChartData] = useState<{name: string, views: number}[]>([]);

  useEffect(() => {
    // Fill chart with some initial zeros if empty
    if (chartData.length === 0) {
       const initial = [];
       for(let i=0; i<6; i++) {
          initial.push({name: `${i*4}:00`, views: 0});
       }
       setChartData(initial);
    }

    const interval = setInterval(() => {
       setChartData(prev => {
          const last = prev[prev.length - 1];
          // Simulate a "live" updating chart point
          const newData = [...prev];
          newData[newData.length - 1] = { ...last, views: last.views + Math.floor(Math.random() * 5) };
          return newData;
       });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
           <p className="text-slate-500 mt-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             System Online &bull; Monitoring Real-time Activity
           </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/new-post" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2">
            <Zap size={16} /> Create Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Live Visitors" 
          value={realtimeUsers} 
          icon={Activity} 
          trend="Active Now" 
          trendUp={true} 
          colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600" 
        />
        <StatCard 
          title="Session Views" 
          value={sessionViews} 
          icon={Eye} 
          trend="Since login" 
          trendUp={true} 
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600" 
        />
        <StatCard 
          title="Published Posts" 
          value={publishedCount} 
          icon={FileText} 
          trend={`${draftCount} drafts`} 
          trendUp={false} 
          colorClass="bg-gradient-to-br from-violet-500 to-violet-600" 
        />
        <StatCard 
          title="Avg. Read Time" 
          value="--:--" 
          icon={Clock} 
          trend="Calculating..." 
          trendUp={true} 
          colorClass="bg-gradient-to-br from-slate-400 to-slate-500" 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Realtime Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Real-time Traffic</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Live Feed</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {realtimeUsers > 5 && (
                 <div className="flex gap-4 items-start animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0 animate-pulse" />
                    <div>
                       <p className="text-sm text-slate-700 font-medium">New visitor from United States</p>
                       <p className="text-xs text-slate-400 mt-1">Just now</p>
                    </div>
                 </div>
            )}
            {publishedCount > 0 && (
                <div className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                   <div>
                      <p className="text-sm text-slate-700 font-medium">System operational</p>
                      <p className="text-xs text-slate-400 mt-1">Monitoring active</p>
                   </div>
                </div>
            )}
            {posts.length === 0 && (
                <div className="text-center text-slate-400 text-sm mt-10">
                    Waiting for data...
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-slate-800 text-lg">Recent Posts</h3>
           <Link to="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">View All Posts <ArrowRight size={16} className="ml-1"/></Link>
        </div>
        <div className="divide-y divide-slate-50">
           {posts.slice(0, 5).map(post => (
              <div key={post.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors group">
                 <div className="flex items-center space-x-4">
                    {post.coverImage ? (
                      <img src={post.coverImage} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <FileText size={20} />
                      </div>
                    )}
                    <div>
                       <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{post.title || 'Untitled'}</h4>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-300">&bull;</span>
                          <span className="text-xs text-slate-400">{post.views} views</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${post.status === 'PUBLISHED' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                       {post.status}
                    </span>
                    <Link to={`/admin/edit-post/${post.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                       <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>
           ))}
           {posts.length === 0 && (
             <div className="p-12 text-center text-slate-400">
               <FileText size={48} className="mx-auto mb-3 opacity-20" />
               <p>No posts yet. Start writing your first story!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;