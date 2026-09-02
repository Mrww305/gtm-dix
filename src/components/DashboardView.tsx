import React from 'react';
import { 
  Users, 
  DollarSign, 
  FileSpreadsheet, 
  Mail, 
  TrendingUp, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Sparkles,
  Zap,
  Target,
  Plus
} from 'lucide-react';
import { Lead, Product, EmailCampaign, DriveSyncConfig, ActiveTab } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  products: Product[];
  campaigns: EmailCampaign[];
  driveConfig: DriveSyncConfig;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickAdd: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  products,
  campaigns,
  driveConfig,
  setActiveTab,
  onOpenQuickAdd,
  onSyncAll,
  isSyncing
}) => {
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const syncedLeadsCount = leads.filter(l => l.driveSyncStatus === 'synced').length;
  const pendingSyncCount = leads.filter(l => l.driveSyncStatus === 'pending').length;
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.stats.sent, 0);
  const totalEmailsOpened = campaigns.reduce((sum, c) => sum + c.stats.opened, 0);
  const openRate = totalEmailsSent > 0 ? Math.round((totalEmailsOpened / totalEmailsSent) * 100) : 0;
  const highIntentCount = leads.filter(l => l.score >= 80).length;

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-semibold tracking-wide text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Automated Lead Ops Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lead Generation & Drive Pipeline Hub
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Every captured lead is scored, mapped to your <strong className="text-white font-semibold">{products.length} catalog products</strong>, auto-synced to your Google Sheets, and targeted with instant behavioral follow-up emails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-quick-capture-btn"
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Capture Lead Now
            </button>
            <button
              id="dash-maps-btn"
              onClick={() => setActiveTab('maps_scraper')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 border border-white/20 text-white font-semibold text-xs rounded-xl transition-all"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              Scrape Maps Leads
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pipeline Leads</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{leads.length}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{highIntentCount} High-Intent (Score &gt; 80)</span>
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mapped Deal Value</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">${totalPipelineValue.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <span>Mapped to {products.length} active products</span>
            </div>
          </div>
        </div>

        {/* Google Drive Sync Status */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Google Sheets Sync</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              {syncedLeadsCount} <span className="text-xs font-normal text-slate-500">/ {leads.length} Synced</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              {pendingSyncCount > 0 ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {pendingSyncCount} pending push
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Up to Date
                </span>
              )}
              {driveConfig.spreadsheetUrl && (
                <a 
                  href={driveConfig.spreadsheetUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5"
                >
                  Sheet <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Automated Follow-Up Emails */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Automated Email Engine</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{totalEmailsSent} <span className="text-xs font-normal text-slate-500">Sent</span></div>
            <div className="flex items-center gap-2 mt-1 text-xs text-purple-700 font-medium">
              <span>{openRate}% Open Rate</span>
              <span>•</span>
              <span>{campaigns.filter(c => c.active).length} Active Sequences</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Active Leads + Modules Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent High-Intent Leads</h2>
              <p className="text-xs text-slate-500">Auto-scored by behavioral triggers and mapped to catalog</p>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={() => setActiveTab('leads')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              View All ({leads.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Lead & Company</th>
                  <th className="py-2.5 px-3">Mapped Product</th>
                  <th className="py-2.5 px-3">Intent Score</th>
                  <th className="py-2.5 px-3">Drive Sync</th>
                  <th className="py-2.5 px-3">Follow-Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{lead.name}</div>
                      <div className="text-slate-500 text-[11px]">{lead.company} • {lead.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{lead.mappedProductName || 'Unmapped'}</span>
                      <div className="text-[11px] text-emerald-600 font-semibold">${lead.dealValue?.toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.score >= 85 ? 'bg-rose-100 text-rose-800' :
                          lead.score >= 70 ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.score} / 100
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {lead.driveSyncStatus === 'synced' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-amber-500" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        lead.emailSequenceActive ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.emailSequenceActive ? `${lead.emailsSentCount || 1} emails sent` : 'Manual'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Showing top 5 active leads</span>
            <button 
              onClick={onSyncAll}
              disabled={isSyncing}
              className="text-emerald-700 font-semibold hover:underline"
            >
              {isSyncing ? 'Syncing to Drive...' : 'Push Pending to Sheets'}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Control Center & Tools */}
        <div className="space-y-4">
          {/* Google Sheets Sync Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Google Drive & Sheets</h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Master Folder: <strong className="text-slate-800">{driveConfig.folderName}</strong>
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Spreadsheet:</span>
                <span className="font-semibold text-slate-800">{driveConfig.sheetName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Last Sync:</span>
                <span className="font-medium text-slate-700">{driveConfig.lastSyncTime ? new Date(driveConfig.lastSyncTime).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                id="drive-view-tab-btn"
                onClick={() => setActiveTab('google_drive')}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors"
              >
                Sync Settings
              </button>
              {driveConfig.spreadsheetUrl && (
                <a
                  href={driveConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center inline-flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Lead Scrapers & Discovery */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Automated Ingestion Tools
            </h3>

            <div className="space-y-2">
              <button
                id="goto-maps-scraper"
                onClick={() => setActiveTab('maps_scraper')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Google Maps Scraper</div>
                    <div className="text-[11px] text-slate-500">Parse local businesses & 1-click sync</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                id="goto-competitor-scraper"
                onClick={() => setActiveTab('competitor_intel')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Competitor Pricing Tracker</div>
                    <div className="text-[11px] text-slate-500">Scrape tiers & generate pitch hooks</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                id="goto-social-trends"
                onClick={() => setActiveTab('social_trends')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">Social Trends & Intent</div>
                    <div className="text-[11px] text-slate-500">Reddit, X & LinkedIn buying signals</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
