import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  Send, 
  Edit, 
  Tag, 
  Building, 
  Phone, 
  Globe, 
  X,
  RefreshCw,
  Zap,
  DollarSign
} from 'lucide-react';
import { Lead, Product, EmailCampaign, LeadSource, LeadStatus } from '../types';
import { googleWorkspace } from '../services/googleWorkspace';

interface LeadsViewProps {
  leads: Lead[];
  products: Product[];
  campaigns: EmailCampaign[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onSyncLeads: (leadsToSync: Lead[]) => void;
  onSendEmailToLead: (lead: Lead, subject: string, body: string) => Promise<boolean>;
  isSyncing: boolean;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  products,
  campaigns,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onSyncLeads,
  onSendEmailToLead,
  isSyncing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [syncFilter, setSyncFilter] = useState<string>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [activeLeadDetail, setActiveLeadDetail] = useState<Lead | null>(null);

  // Email Drawer state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Add Lead Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    website: '',
    source: 'web_form' as LeadSource,
    mappedProductId: products[0]?.id || '',
    score: 80,
    behaviorTriggers: ['Web Form Submission', 'Downloaded Product Specs'],
    notes: ''
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSync = syncFilter === 'all' || 
      (syncFilter === 'synced' && lead.driveSyncStatus === 'synced') ||
      (syncFilter === 'pending' && lead.driveSyncStatus === 'pending');

    return matchesSearch && matchesSource && matchesStatus && matchesSync;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkSync = () => {
    const toSync = leads.filter(l => selectedLeadIds.includes(l.id));
    if (toSync.length) {
      onSyncLeads(toSync);
    }
  };

  const handleExportCSV = () => {
    const toExport = selectedLeadIds.length > 0
      ? leads.filter(l => selectedLeadIds.includes(l.id))
      : filteredLeads;
    googleWorkspace.downloadCSV(toExport, `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === newLeadForm.mappedProductId);
    const dealValue = product ? product.price * (product.billing === 'monthly' ? 12 : 1) : 1000;

    onAddLead({
      name: newLeadForm.name,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      company: newLeadForm.company,
      title: newLeadForm.title,
      website: newLeadForm.website,
      source: newLeadForm.source,
      status: 'new',
      score: Number(newLeadForm.score),
      intentCategory: newLeadForm.score >= 85 ? 'Enterprise' : newLeadForm.score >= 70 ? 'Hot' : 'Warm',
      mappedProductId: product?.id,
      mappedProductName: product?.name,
      dealValue,
      behaviorTriggers: newLeadForm.behaviorTriggers,
      notes: newLeadForm.notes,
      driveSyncStatus: 'pending',
      emailSequenceActive: true,
      emailsSentCount: 0
    });

    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
      source: 'web_form',
      mappedProductId: products[0]?.id || '',
      score: 80,
      behaviorTriggers: ['Web Form Submission', 'Downloaded Product Specs'],
      notes: ''
    });
  };

  // Open Email Composer
  const handleOpenEmailComposer = (lead: Lead) => {
    setActiveLeadDetail(lead);
    const product = products.find(p => p.id === lead.mappedProductId) || products[0];
    setEmailSubject(`Quick update regarding ${lead.company} & ${product?.name || 'our platform'}`);
    setEmailBody(
      `Hi ${lead.name.split(' ')[0]},\n\nI noticed your interest in ${product?.name || 'our lead automation tools'}.\n\nWe would love to show you how our system connects directly to your Google Drive and automates your pipeline.\n\nAre you available for a brief 10-minute demo this week?\n\nBest regards,\nGrowth Team`
    );
    setIsEmailModalOpen(true);
  };

  // AI Draft Email via Gemini API
  const handleAIDraftEmail = async () => {
    if (!activeLeadDetail) return;
    setIsDraftingEmail(true);
    try {
      const product = products.find(p => p.id === activeLeadDetail.mappedProductId) || products[0];
      const res = await fetch('/api/ai/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: activeLeadDetail,
          product,
          behaviorTrigger: activeLeadDetail.behaviorTriggers?.join(', ') || 'Recent lead capture',
          emailGoal: 'Book 10-minute discovery demo',
          tone: 'Professional, consultative and value-oriented'
        })
      });
      const data = await res.json();
      if (data.subject) setEmailSubject(data.subject);
      if (data.body) setEmailBody(data.body);
    } catch (err) {
      console.error('Error drafting with AI:', err);
    } finally {
      setIsDraftingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!activeLeadDetail) return;
    setIsSendingEmail(true);
    try {
      const success = await onSendEmailToLead(activeLeadDetail, emailSubject, emailBody);
      if (success) {
        setIsEmailModalOpen(false);
        // update local active lead
        setActiveLeadDetail({
          ...activeLeadDetail,
          emailsSentCount: (activeLeadDetail.emailsSentCount || 0) + 1,
          lastActivity: new Date().toISOString()
        });
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Lead Generation Hub
          </h1>
          <p className="text-xs text-slate-500">
            {leads.length} contacts captured • Mapped to Google Sheets & behavioral follow-up flows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedLeadIds.length > 0 && (
            <button
              id="bulk-sync-sheets-btn"
              onClick={handleBulkSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sync {selectedLeadIds.length} to Sheets</span>
            </button>
          )}

          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            id="add-lead-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="leads-search-input"
            type="text"
            placeholder="Search by name, company, email, notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            id="source-filter"
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Sources</option>
            <option value="google_maps">Google Maps</option>
            <option value="web_form">Web Forms</option>
            <option value="social_scraper">Social Scraper</option>
            <option value="competitor_intel">Competitor Intel</option>
            <option value="manual">Manual Entry</option>
          </select>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="demo_scheduled">Demo Scheduled</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="won">Won Deal</option>
          </select>

          <select
            id="sync-filter"
            value={syncFilter}
            onChange={e => setSyncFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Sync Status</option>
            <option value="synced">Synced to Sheets</option>
            <option value="pending">Pending Sync</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3">Lead & Company</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Mapped Product</th>
                <th className="py-3 px-3">Intent Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Google Drive</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-slate-600">No leads found matching filters</p>
                    <p className="text-xs text-slate-400">Try scraping Google Maps or adding a lead manually.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="py-3.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(lead.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Lead info */}
                      <td className="py-3.5 px-3 cursor-pointer" onClick={() => setActiveLeadDetail(lead)}>
                        <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span className="font-medium text-slate-700">{lead.company}</span>
                          <span>•</span>
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                          lead.source === 'google_maps' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          lead.source === 'web_form' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                          lead.source === 'competitor_intel' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Mapped Product */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800 truncate max-w-[160px]" title={lead.mappedProductName}>
                          {lead.mappedProductName || 'Unassigned'}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-bold">
                          ${lead.dealValue?.toLocaleString()}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 text-center py-0.5 rounded-sm font-extrabold text-[11px] shadow-xs text-white" style={{
                            backgroundColor: lead.score >= 85 ? '#e11d48' : lead.score >= 70 ? '#f59e0b' : '#64748b'
                          }}>
                            {lead.score}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {lead.intentCategory || 'Hot'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLead({ ...lead, status: e.target.value as LeadStatus })}
                          className="text-[11px] px-2 py-1 rounded-md border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="new">New Lead</option>
                          <option value="qualified">Qualified</option>
                          <option value="contacted">Contacted</option>
                          <option value="demo_scheduled">Demo Scheduled</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>

                      {/* Google Drive Sync Status */}
                      <td className="py-3.5 px-3">
                        {lead.driveSyncStatus === 'synced' ? (
                          <button
                            onClick={() => onSyncLeads([lead])}
                            title="Synced to Google Sheets. Click to re-sync."
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Synced</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onSyncLeads([lead])}
                            disabled={isSyncing}
                            title="Click to push lead to Google Sheets now"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors"
                          >
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Sync Now</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEmailComposer(lead)}
                            title="Send behavioral follow-up email"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveLeadDetail(lead)}
                            title="View lead profile & mapping"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            title="Delete lead"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Slide-Over Drawer */}
      {activeLeadDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {activeLeadDetail.source.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      Score: {activeLeadDetail.score}/100
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">{activeLeadDetail.name}</h2>
                  <p className="text-xs text-slate-500">{activeLeadDetail.title || 'Decision Maker'} at <strong className="text-slate-700">{activeLeadDetail.company}</strong></p>
                </div>
                <button
                  onClick={() => setActiveLeadDetail(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Information & Sync status */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-800 select-all">{activeLeadDetail.email}</span>
                </div>
                {activeLeadDetail.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phone:</span>
                    <span className="font-semibold text-slate-800">{activeLeadDetail.phone}</span>
                  </div>
                )}
                {activeLeadDetail.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Website:</span>
                    <a href={activeLeadDetail.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">
                      {activeLeadDetail.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Drive Sync:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeLeadDetail.driveSyncStatus === 'synced' ? 'Synced to Master Sheet' : 'Pending Auto-Sync'}
                  </span>
                </div>
              </div>

              {/* Product Mapping Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Mapped Catalog Product
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Value: ${activeLeadDetail.dealValue?.toLocaleString()}
                  </span>
                </div>

                <select
                  value={activeLeadDetail.mappedProductId || ''}
                  onChange={(e) => {
                    const selProd = products.find(p => p.id === e.target.value);
                    if (selProd) {
                      const updated = {
                        ...activeLeadDetail,
                        mappedProductId: selProd.id,
                        mappedProductName: selProd.name,
                        dealValue: selProd.price * (selProd.billing === 'monthly' ? 12 : 1)
                      };
                      setActiveLeadDetail(updated);
                      onUpdateLead(updated);
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price}/{p.billing === 'monthly' ? 'mo' : 'deal'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Behavioral Trigger Tags */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Observed Behavioral Triggers</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(activeLeadDetail.behaviorTriggers || []).map((trigger, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                      ⚡ {trigger}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Sales Talking Points */}
              {activeLeadDetail.talkingPoints && activeLeadDetail.talkingPoints.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200/80 space-y-2">
                  <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Battlecard & Talking Points
                  </h3>
                  <ul className="text-xs text-indigo-950 space-y-1.5 list-disc list-inside">
                    {activeLeadDetail.talkingPoints.map((tp, idx) => (
                      <li key={idx} className="leading-relaxed">{tp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Internal Notes</label>
                <textarea
                  value={activeLeadDetail.notes || ''}
                  onChange={(e) => {
                    const updated = { ...activeLeadDetail, notes: e.target.value };
                    setActiveLeadDetail(updated);
                    onUpdateLead(updated);
                  }}
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                  placeholder="Add custom notes regarding lead requirements, budget, or timeline..."
                />
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                onClick={() => handleOpenEmailComposer(activeLeadDetail)}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Follow-Up Email
              </button>
              <button
                onClick={() => {
                  onSyncLeads([activeLeadDetail]);
                }}
                disabled={isSyncing}
                className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 inline-flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Push to Sheets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal / Drafter */}
      {isEmailModalOpen && activeLeadDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Automated Behavioral Follow-Up</h3>
                  <p className="text-xs text-slate-300">Sending to <strong className="text-white">{activeLeadDetail.email}</strong></p>
                </div>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-900">
                  <span className="font-semibold">Mapped Product:</span> {activeLeadDetail.mappedProductName || 'General Starter'}
                </div>
                <button
                  type="button"
                  onClick={handleAIDraftEmail}
                  disabled={isDraftingEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isDraftingEmail ? 'animate-spin' : ''}`} />
                  {isDraftingEmail ? 'Drafting with AI...' : 'AI Auto-Draft Copy'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Body</label>
                <textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={8}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  ⚡ Dispatches via connected Gmail API or automated queue
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || !emailSubject || !emailBody}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
                    {isSendingEmail ? 'Sending...' : 'Send Follow-Up Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Capture New Lead</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={newLeadForm.name}
                    onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@acme.com"
                    value={newLeadForm.email}
                    onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={newLeadForm.company}
                    onChange={e => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2834"
                    value={newLeadForm.phone}
                    onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={e => setNewLeadForm({ ...newLeadForm, source: e.target.value as LeadSource })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="web_form">Web Form</option>
                    <option value="google_maps">Google Maps Scraper</option>
                    <option value="social_scraper">Social Media</option>
                    <option value="competitor_intel">Competitor Intel</option>
                    <option value="manual">Manual Entry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Map to Catalog Product</label>
                  <select
                    value={newLeadForm.mappedProductId}
                    onChange={e => setNewLeadForm({ ...newLeadForm, mappedProductId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Intent Score (0 - 100): {newLeadForm.score}</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={newLeadForm.score}
                  onChange={e => setNewLeadForm({ ...newLeadForm, score: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key interests, objections, or timeline..."
                  value={newLeadForm.notes}
                  onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Save & Map Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
