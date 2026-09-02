import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Filter, 
  DollarSign, 
  Users, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Lead, Product, EmailCampaign, DriveSyncConfig } from '../types';
import { googleWorkspace } from '../services/googleWorkspace';

interface ReportsViewProps {
  leads: Lead[];
  products: Product[];
  campaigns: EmailCampaign[];
  driveConfig: DriveSyncConfig;
  onSyncAll: () => void;
  isSyncing: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  leads,
  products,
  campaigns,
  driveConfig,
  onSyncAll,
  isSyncing
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [reportPushSuccess, setReportPushSuccess] = useState<string | null>(null);

  // Calculations
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const avgDealSize = leads.length > 0 ? Math.round(totalPipelineValue / leads.length) : 0;
  const wonDealsCount = leads.filter(l => l.status === 'won').length;
  const wonRevenue = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.dealValue, 0);
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.stats.sent, 0);
  const totalEmailsOpened = campaigns.reduce((sum, c) => sum + c.stats.opened, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.stats.replied, 0);

  // Source breakdown calculation
  const sourceStats = [
    { label: 'Google Maps Scraper', count: leads.filter(l => l.source === 'google_maps').length, color: 'bg-amber-500' },
    { label: 'Web Forms & Landing Pages', count: leads.filter(l => l.source === 'web_form' || l.source === 'landing_page').length, color: 'bg-blue-500' },
    { label: 'Competitor Switcher', count: leads.filter(l => l.source === 'competitor_intel').length, color: 'bg-indigo-500' },
    { label: 'Social Media Signals', count: leads.filter(l => l.source === 'social_scraper').length, color: 'bg-purple-500' },
    { label: 'Manual & Direct', count: leads.filter(l => l.source === 'manual').length, color: 'bg-slate-400' }
  ];

  const handleExportCustomReport = () => {
    googleWorkspace.downloadCSV(leads, `lead_pipeline_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handlePushReportToDrive = () => {
    onSyncAll();
    setReportPushSuccess('Real-time campaign analytics & lead roster synced to Google Drive Spreadsheet!');
    setTimeout(() => setReportPushSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Campaign Analytics & Custom Reporting
          </h1>
          <p className="text-xs text-slate-500">
            Real-time conversion metrics, deal valuation, email performance, and multi-channel attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="push-report-drive-btn"
            onClick={handlePushReportToDrive}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Push Report to Google Drive</span>
          </button>

          <button
            id="download-report-csv-btn"
            onClick={handleExportCustomReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {reportPushSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reportPushSuccess}</span>
        </div>
      )}

      {/* Campaign Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={e => setSelectedCampaignId(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-300 font-medium bg-white text-slate-800"
          >
            <option value="all">All Active Sequences & Lead Sources</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Date Range:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-300 font-medium bg-white text-slate-800"
          >
            <option value="all_time">All Time (Q3 2026)</option>
            <option value="last_30">Last 30 Days</option>
            <option value="last_7">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pipeline</span>
          <div className="text-2xl font-black text-slate-900 mt-2">${totalPipelineValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Avg Deal: <strong className="text-slate-800">${avgDealSize}</strong></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Captured Leads</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{leads.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {leads.filter(l => l.score >= 80).length} High-Intent Qualified
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Follow-Up Email Opens</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalEmailsSent > 0 ? Math.round((totalEmailsOpened / totalEmailsSent) * 100) : 0}%
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">
            {totalEmailsOpened} opens of {totalEmailsSent} sent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Reply / Meeting Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalEmailsSent > 0 ? Math.round((totalReplies / totalEmailsSent) * 100) : 0}%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            {totalReplies} direct buyer responses
          </div>
        </div>
      </div>

      {/* Funnel & Product Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">End-to-End Pipeline Funnel</h3>
          <div className="space-y-3">
            {[
              { stage: '1. Captured Contacts (Maps & Forms)', count: leads.length, pct: 100, color: 'bg-blue-600' },
              { stage: '2. Mapped to Catalog Product', count: leads.filter(l => l.mappedProductId).length, pct: Math.round((leads.filter(l => l.mappedProductId).length / (leads.length || 1)) * 100), color: 'bg-indigo-600' },
              { stage: '3. Synced to Google Drive Sheet', count: leads.filter(l => l.driveSyncStatus === 'synced').length, pct: Math.round((leads.filter(l => l.driveSyncStatus === 'synced').length / (leads.length || 1)) * 100), color: 'bg-emerald-600' },
              { stage: '4. Behavioral Follow-Up Dispatched', count: leads.filter(l => l.emailSequenceActive).length, pct: Math.round((leads.filter(l => l.emailSequenceActive).length / (leads.length || 1)) * 100), color: 'bg-purple-600' },
              { stage: '5. Demo Scheduled / Proposal Sent', count: leads.filter(l => l.status === 'demo_scheduled' || l.status === 'proposal_sent' || l.status === 'won').length, pct: Math.round((leads.filter(l => l.status === 'demo_scheduled' || l.status === 'proposal_sent' || l.status === 'won').length / (leads.length || 1)) * 100), color: 'bg-rose-500' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{step.stage}</span>
                  <span className="font-bold text-slate-900">{step.count} leads ({step.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Lead Volume by Acquisition Channel</h3>
          <div className="space-y-3">
            {sourceStats.map((src, idx) => {
              const pct = leads.length > 0 ? Math.round((src.count / leads.length) * 100) : 0;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${src.color}`}></span>
                      {src.label}
                    </span>
                    <span className="font-bold text-slate-900">{src.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${src.color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Catalog Revenue Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Product Catalog Revenue Contribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => {
            const mappedLeads = leads.filter(l => l.mappedProductId === p.id);
            const value = mappedLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
            return (
              <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-xs text-slate-900">{p.name}</div>
                <div className="text-xl font-extrabold text-emerald-700">${value.toLocaleString()}</div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Mapped Contacts: <strong className="text-slate-800">{mappedLeads.length}</strong></span>
                  <span>${p.price}/{p.billing === 'monthly' ? 'mo' : 'deal'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
