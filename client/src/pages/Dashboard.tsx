import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { leadService } from "../services/lead.service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Users, CheckCircle, Clock, XCircle, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Lead } from "../types/lead";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0
  });

  useEffect(() => {
    const fetchStatsAndRecent = async () => {
      try {
        setLoading(true);
        const response = await leadService.getLeads({ limit: 1000 });
        const leads = response.leads;
        
        setStats({
          total: leads.length,
          new: leads.filter(l => l.status.toLowerCase() === "new").length,
          contacted: leads.filter(l => l.status.toLowerCase() === "contacted").length,
          qualified: leads.filter(l => l.status.toLowerCase() === "qualified").length,
          lost: leads.filter(l => l.status.toLowerCase() === "lost").length,
        });

        // Top 5 recent leads
        const sorted = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentLeads(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatsAndRecent();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "new": return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "contacted": return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "qualified": return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "lost": return "bg-rose-50 text-rose-700 border-rose-200/50";
      default: return "bg-slate-50 text-slate-700 border-slate-200/50";
    }
  };

  const statCards = [
    { 
      title: "Total Leads", 
      value: stats.total, 
      description: "All time leads generated",
      icon: Users, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50/50 border-indigo-100/50",
      progressColor: "bg-indigo-600"
    },
    { 
      title: "New Leads", 
      value: stats.new, 
      description: "Awaiting initial contact",
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-50/50 border-amber-100/50",
      progressColor: "bg-amber-600"
    },
    { 
      title: "Qualified Leads", 
      value: stats.qualified, 
      description: "Ready for sales funnel",
      icon: CheckCircle, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50/50 border-emerald-100/50",
      progressColor: "bg-emerald-600"
    },
    { 
      title: "Lost Leads", 
      value: stats.lost, 
      description: "Unconverted prospects",
      icon: XCircle, 
      color: "text-rose-600", 
      bg: "bg-rose-50/50 border-rose-100/50",
      progressColor: "bg-rose-600"
    },
  ];

  // Calculate percentages for the visual breakdown bar
  const qualPercent = stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0;
  const newPercent = stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0;
  const contPercent = stats.total > 0 ? Math.round((stats.contacted / stats.total) * 100) : 0;
  const lostPercent = stats.total > 0 ? Math.round((stats.lost / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Hero Greeting Section with Gradients */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Smart Leads System</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-300 max-w-xl text-sm sm:text-base font-light">
              You are signed in as <span className="font-semibold text-indigo-300 capitalize">{user?.role}</span>. Here's a live overview of your lead operations and performance metrics.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/leads">
              <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30">
                View Leads Database <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl border ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {loading ? "..." : stat.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">active</span>
              </div>
              <p className="text-xs text-slate-400 font-light">{stat.description}</p>
              
              {/* Subtle dynamic micro bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.progressColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${stats.total > 0 ? (stat.value / stats.total) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Analytics & Recent Activity Double Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status Distribution Visual breakdown */}
        <Card className="border border-slate-100 shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold text-slate-900">Funnel Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Visual breakdown of lead conversion status ratios. Focus on moving leads from New to Contacted and Qualified.
              </p>

              {/* Stacked Percentage Bar Chart */}
              <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner border border-slate-100">
                {stats.total === 0 ? (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    No active data
                  </div>
                ) : (
                  <>
                    {newPercent > 0 && (
                      <div 
                        title={`New: ${newPercent}%`} 
                        className="h-full bg-blue-500 hover:opacity-90 transition-opacity" 
                        style={{ width: `${newPercent}%` }} 
                      />
                    )}
                    {contPercent > 0 && (
                      <div 
                        title={`Contacted: ${contPercent}%`} 
                        className="h-full bg-amber-500 hover:opacity-90 transition-opacity" 
                        style={{ width: `${contPercent}%` }} 
                      />
                    )}
                    {qualPercent > 0 && (
                      <div 
                        title={`Qualified: ${qualPercent}%`} 
                        className="h-full bg-emerald-500 hover:opacity-90 transition-opacity" 
                        style={{ width: `${qualPercent}%` }} 
                      />
                    )}
                    {lostPercent > 0 && (
                      <div 
                        title={`Lost: ${lostPercent}%`} 
                        className="h-full bg-rose-500 hover:opacity-90 transition-opacity" 
                        style={{ width: `${lostPercent}%` }} 
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Legend with Metrics */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">New Leads</span>
                </div>
                <span className="font-bold text-slate-800">{newPercent}% ({stats.new})</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Contacted</span>
                </div>
                <span className="font-bold text-slate-800">{contPercent}% ({stats.contacted})</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Qualified</span>
                </div>
                <span className="font-bold text-slate-800 text-emerald-600">{qualPercent}% ({stats.qualified})</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Lost</span>
                </div>
                <span className="font-bold text-slate-800 text-rose-500">{lostPercent}% ({stats.lost})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Leads Activity</CardTitle>
            <Link to="/leads" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline inline-flex items-center">
              View all leads
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Loading recent activity...
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                No recent leads created.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-500">Contact</TableHead>
                      <TableHead className="font-semibold text-slate-500">Source</TableHead>
                      <TableHead className="font-semibold text-slate-500">Status</TableHead>
                      <TableHead className="font-semibold text-slate-500 text-right">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => (
                      <TableRow key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-800 text-sm">{lead.name}</div>
                            <div className="text-xs text-slate-400 font-light">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-600">
                          {lead.source}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-light text-slate-400 text-right">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
