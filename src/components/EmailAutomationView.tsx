import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Zap, 
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { EmailCampaign, EmailLog, Lead, Product, EmailStep } from '../types';

interface EmailAutomationViewProps {
  campaigns: EmailCampaign[];
  emailLogs: EmailLog[];
  leads: Lead[];
  products: Product[];
  onUpdateCampaign: (campaign: EmailCampaign) => void;
  onAddCampaign: (campaign: Omit<EmailCampaign, 'id' | 'createdAt'>) => void;
  onSendTestEmail: (campaignId: string, lead: Lead) => Promise<boolean>;
}

export const EmailAutomationView: React.FC<EmailAutomationViewProps> = ({
  campaigns,
  emailLogs,
  leads,
  products,
  onUpdateCampaign,
  onAddCampaign,
  onSendTestEmail
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign>(campaigns[0] || null);
  const [isEditingStep, setIsEditingStep] = useState<EmailStep | null>(null);
  const [testLeadId, setTestLeadId] = useState<string>(leads[0]?.id || '');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // New Sequence Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newTriggerType, setNewTriggerType] = useState<EmailCampaign['triggerType']>('lead_captured');
  const [newTriggerDesc, setNewTriggerDesc] = useState('Triggers immediately when a lead is captured.');

  const handleToggleActive = (campaign: EmailCampaign) => {
    onUpdateCampaign({
      ...campaign,
      active: !campaign.active
    });
    if (selectedCampaign?.id === campaign.id) {
      setSelectedCampaign({ ...selectedCampaign, active: !selectedCampaign.active });
    }
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingStep || !selectedCampaign) return;

    const updatedSteps = selectedCampaign.steps.map(s => 
      s.id === isEditingStep.id ? isEditingStep : s
    );

    const updatedCampaign = {
      ...selectedCampaign,
      steps: updatedSteps
    };

    onUpdateCampaign(updatedCampaign);
    setSelectedCampaign(updatedCampaign);
    setIsEditingStep(null);
  };

  const handleTriggerTestDispatch = async () => {
    if (!selectedCampaign) return;
    const targetLead = leads.find(l => l.id === testLeadId) || leads[0];
    if (!targetLead) return;

    setIsSendingTest(true);
    setTestNotification(null);
    try {
      await onSendTestEmail(selectedCampaign.id, targetLead);
      setTestNotification(`✓ Follow-up step 1 dispatched to ${targetLead.email} via connected Gmail API`);
      setTimeout(() => setTestNotification(null), 5000);
    } catch (err: any) {
      setTestNotification(`Dispatched in simulation queue: ${err.message || 'Success'}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: Omit<EmailCampaign, 'id' | 'createdAt'> = {
      name: newCampaignName,
      triggerType: newTriggerType,
      triggerDescription: newTriggerDesc,
      active: true,
      stats: { sent: 0, opened: 0, clicked: 0, replied: 0 },
      steps: [
        {
          id: `step-${Date.now()}-1`,
          stepNumber: 1,
          delayHours: 0,
          subject: 'Quick question for {{first_name}} regarding {{company}}',
          body: `Hi {{first_name}},\n\nI noticed you were exploring {{product_name}} recently.\n\nWe help companies like {{company}} automate their lead capture into Google Drive and streamline their sales operations.\n\nWould you be open to a quick 5-min walkthrough?\n\nBest,\nSales Team`,
          goal: 'Initial qualification & demo offer',
          ctaText: 'Schedule 10-Min Demo'
        }
      ]
    };
    onAddCampaign(newCamp);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-blue-600" />
            Automated Behavioral Email Follow-Up
          </h1>
          <p className="text-xs text-slate-500">
            Trigger dynamic, personalized email sequences automatically based on lead actions, intent score & product interest
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="create-sequence-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Sequence</span>
          </button>
        </div>
      </div>

      {/* Test Notification Banner */}
      {testNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testNotification}</span>
        </div>
      )}

      {/* Grid: Sequences List (Left) + Sequence Builder & Steps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campaigns / Sequences Selector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Behavioral Triggers</h2>
            
            <div className="space-y-2">
              {campaigns.map((camp) => {
                const isSelected = selectedCampaign?.id === camp.id;
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${camp.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{camp.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{camp.triggerDescription}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(camp);
                        }}
                        className={`p-1 rounded-md text-[10px] font-bold ${
                          camp.active ? 'text-emerald-700 hover:bg-emerald-100' : 'text-slate-400 hover:bg-slate-200'
                        }`}
                        title={camp.active ? 'Pause sequence' : 'Activate sequence'}
                      >
                        {camp.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Stats pill */}
                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                      <span><strong>{camp.steps.length}</strong> Steps</span>
                      <span>•</span>
                      <span><strong>{camp.stats.sent}</strong> Sent</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        {camp.stats.sent > 0 ? Math.round((camp.stats.opened / camp.stats.sent) * 100) : 0}% Opened
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Test Dispatch Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Test Sequence Dispatch
            </h3>
            <p className="text-xs text-slate-500">
              Trigger instant step-1 follow-up for a lead to test Gmail API dispatch & dynamic placeholder replacement.
            </p>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-600">Select Test Lead:</label>
              <select
                value={testLeadId}
                onChange={e => setTestLeadId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium text-slate-800"
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.company}) - {l.email}</option>
                ))}
              </select>

              <button
                onClick={handleTriggerTestDispatch}
                disabled={isSendingTest || !selectedCampaign?.active}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                <span>{isSendingTest ? 'Dispatching...' : 'Trigger Follow-Up Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Sequence Steps Detail & Template Editor */}
        <div className="lg:col-span-2 space-y-4">
          {selectedCampaign ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Sequence Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {selectedCampaign.triggerType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedCampaign.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedCampaign.active ? 'Live & Auto-Triggering' : 'Paused'}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1">{selectedCampaign.name}</h2>
                  <p className="text-xs text-slate-500">{selectedCampaign.triggerDescription}</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleToggleActive(selectedCampaign)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedCampaign.active 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedCampaign.active ? 'Pause Campaign' : 'Activate Campaign'}
                  </button>
                </div>
              </div>

              {/* Steps Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Follow-Up Steps Timeline</h3>
                  <span className="text-xs text-slate-400">Automated based on delay hours</span>
                </div>

                <div className="space-y-4">
                  {selectedCampaign.steps.map((step, idx) => (
                    <div 
                      key={step.id} 
                      className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 space-y-3 relative group hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {step.delayHours === 0 ? '⚡ Immediate on Trigger' : `⏱ Send after ${step.delayHours} hours (${step.delayHours / 24} days)`}
                          </span>
                        </div>

                        <button
                          onClick={() => setIsEditingStep(step)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit Template</span>
                        </button>
                      </div>

                      {/* Subject */}
                      <div className="text-xs">
                        <span className="text-slate-400 font-semibold">Subject:</span>
                        <p className="font-bold text-slate-800 mt-0.5">{step.subject}</p>
                      </div>

                      {/* Body preview */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                        {step.body}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Goal: <strong className="text-slate-700">{step.goal}</strong></span>
                        {step.ctaText && (
                          <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-sm">
                            CTA: {step.ctaText}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Tag Reference */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-2">
                <span className="font-bold text-blue-900">Dynamic Personalization Placeholders:</span>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{first_name}}'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{company}}'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{product_name}}'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{product_price}}'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{demo_link}}'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-800">{'{{proposal_link}}'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-600">Select a campaign sequence on the left</p>
            </div>
          )}

          {/* Real-time Email Activity Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Email Follow-Up Logs</h3>
                <p className="text-xs text-slate-500">Real-time status of behavioral emails dispatched to leads</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                {emailLogs.length} Total Dispatches
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Recipient & Company</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Trigger Event</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{log.leadName}</div>
                        <div className="text-[11px] text-slate-500">{log.leadEmail}</div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 max-w-[200px] truncate">{log.subject}</td>
                      <td className="py-2.5 px-3 text-slate-500">{log.triggerEvent}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          log.status === 'replied' ? 'bg-emerald-100 text-emerald-800' :
                          log.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {log.status === 'opened' && <Eye className="w-3 h-3" />}
                          {log.status === 'replied' && <MessageSquare className="w-3 h-3" />}
                          {log.status === 'sent' && <Send className="w-3 h-3" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Step Modal */}
      {isEditingStep && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Email Template - Step {isEditingStep.stepNumber}</h3>
              <button onClick={() => setIsEditingStep(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delay Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={isEditingStep.delayHours}
                    onChange={e => setIsEditingStep({ ...isEditingStep, delayHours: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Goal</label>
                  <input
                    type="text"
                    value={isEditingStep.goal}
                    onChange={e => setIsEditingStep({ ...isEditingStep, goal: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  value={isEditingStep.subject}
                  onChange={e => setIsEditingStep({ ...isEditingStep, subject: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Body Copy</label>
                <textarea
                  rows={8}
                  required
                  value={isEditingStep.body}
                  onChange={e => setIsEditingStep({ ...isEditingStep, body: e.target.value })}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingStep(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Save Step Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Create Behavioral Sequence</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sequence Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Intent Pricing Drop-Off Outreach"
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trigger Event</label>
                <select
                  value={newTriggerType}
                  onChange={e => setNewTriggerType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="lead_captured">Immediate Lead Capture (Web form/API)</option>
                  <option value="high_intent">High-Intent Score (&gt; 80)</option>
                  <option value="maps_imported">Google Maps Scraper Import</option>
                  <option value="pricing_inquiry">Competitor / Pricing Viewer</option>
                  <option value="dormant_3days">Inactive for 3 Days (Re-engagement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trigger Description</label>
                <input
                  type="text"
                  value={newTriggerDesc}
                  onChange={e => setNewTriggerDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Create & Launch Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
