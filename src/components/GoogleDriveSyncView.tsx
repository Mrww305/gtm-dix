import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FolderSync, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Settings, 
  Plus, 
  Download, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight,
  Database,
  Check
} from 'lucide-react';
import { Lead, DriveSyncConfig, GoogleAuthUser } from '../types';
import { googleWorkspace } from '../services/googleWorkspace';

interface GoogleDriveSyncViewProps {
  leads: Lead[];
  driveConfig: DriveSyncConfig;
  authUser: GoogleAuthUser | null;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onUpdateDriveConfig: (config: Partial<DriveSyncConfig>) => void;
  onSyncAll: () => void;
  onSyncSingleLead: (lead: Lead) => void;
  isSyncing: boolean;
}

export const GoogleDriveSyncView: React.FC<GoogleDriveSyncViewProps> = ({
  leads,
  driveConfig,
  authUser,
  onConnectGoogle,
  onDisconnectGoogle,
  onUpdateDriveConfig,
  onSyncAll,
  onSyncSingleLead,
  isSyncing
}) => {
  const [isCreatingNewSheet, setIsCreatingNewSheet] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState(`Lead_Pipeline_Master_${new Date().getFullYear()}`);

  const syncedLeads = leads.filter(l => l.driveSyncStatus === 'synced');
  const pendingLeads = leads.filter(l => l.driveSyncStatus === 'pending');

  const handleCreateNewSheet = async () => {
    setIsCreatingNewSheet(true);
    try {
      const token = authUser?.accessToken || 'token_demo';
      const result = await googleWorkspace.createLeadSpreadsheet(token, newSheetTitle, driveConfig.folderId);
      onUpdateDriveConfig({
        sheetName: newSheetTitle,
        spreadsheetId: result.spreadsheetId,
        spreadsheetUrl: result.spreadsheetUrl,
        lastSyncTime: new Date().toISOString()
      });
      // Push all leads to this new sheet
      onSyncAll();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingNewSheet(false);
    }
  };

  const fieldMappings = [
    { column: 'Col A', header: 'Captured Date', sample: '2026-09-02 02:40 PM', desc: 'Timestamp lead was captured' },
    { column: 'Col B', header: 'Lead ID', sample: 'lead-101', desc: 'Unique system identifier' },
    { column: 'Col C', header: 'Full Name', sample: 'Sarah Jenkins', desc: 'Contact primary name' },
    { column: 'Col D', header: 'Email Address', sample: 'sarah@luminarytech.io', desc: 'Verified contact email' },
    { column: 'Col E', header: 'Phone Number', sample: '+1 (415) 890-3321', desc: 'Direct phone number' },
    { column: 'Col F', header: 'Company', sample: 'Luminary Technologies', desc: 'Target business or employer' },
    { column: 'Col G', header: 'Title / Role', sample: 'VP of Growth', desc: 'Decision maker job title' },
    { column: 'Col H', header: 'Lead Source', sample: 'GOOGLE_MAPS', desc: 'Origin channel' },
    { column: 'Col I', header: 'Status', sample: 'QUALIFIED', desc: 'CRM pipeline stage' },
    { column: 'Col J', header: 'Intent Score', sample: '94 / 100', desc: 'AI behavior qualification score' },
    { column: 'Col K', header: 'Mapped Product', sample: 'Scale Pipeline Pro', desc: 'Matched catalog product' },
    { column: 'Col L', header: 'Deal Value ($)', sample: '$2,988', desc: 'Estimated revenue pipeline' },
    { column: 'Col M', header: 'Behavior Triggers', sample: 'Pricing Viewed 3x; Maps Scraped', desc: 'Observed user actions' },
    { column: 'Col N', header: 'Next Action / Notes', sample: 'Send custom demo deck', desc: 'Sales talking points & notes' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Google Drive & Sheets Auto-Sync
          </h1>
          <p className="text-xs text-slate-500">
            Automatically store, organize, and append captured contact information into structured Google Spreadsheets
          </p>
        </div>

        <div className="flex items-center gap-2">
          {driveConfig.spreadsheetUrl && (
            <a
              href={driveConfig.spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <span>Open in Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            id="sync-all-drive-btn"
            onClick={onSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync All Leads Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Drive Account Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace Authorization</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> OAuth 2.0
            </span>
          </div>

          {authUser ? (
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {authUser.picture ? (
                  <img src={authUser.picture} alt={authUser.name} className="w-full h-full object-cover" />
                ) : (
                  authUser.name?.charAt(0) || 'G'
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{authUser.name}</h4>
                <p className="text-[11px] text-slate-500">{authUser.email}</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Scopes: Drive • Sheets • Gmail</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-600">Connect your Google Account to stream leads directly to your Drive.</p>
              <button
                onClick={onConnectGoogle}
                className="w-full py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Sign In With Google
              </button>
            </div>
          )}
        </div>

        {/* Live Master Sheet Config */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Google Drive Folder</span>
            <span className="text-xs font-semibold text-slate-700">{driveConfig.folderName}</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-500">Active Spreadsheet:</div>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              {driveConfig.sheetName}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Last Synced: <strong className="text-slate-800">{driveConfig.lastSyncTime ? new Date(driveConfig.lastSyncTime).toLocaleTimeString() : 'Ready'}</strong>
            </div>
          </div>
        </div>

        {/* Sync Automation Setting */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Instant Streaming</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={driveConfig.autoSync}
                onChange={(e) => onUpdateDriveConfig({ autoSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600">
            {driveConfig.autoSync
              ? '⚡ Active: Leads captured from Google Maps, web forms, and scrapers are appended to Google Sheets in real time.'
              : 'Manual Mode: Leads will queue until you click Sync to Sheets.'}
          </p>

          <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
            {syncedLeads.length} / {leads.length} Records Synced
          </div>
        </div>
      </div>

      {/* Spreadsheet Structure & Field Mapping Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Automated Sheet Schema & Column Mappings
            </h3>
            <p className="text-xs text-slate-500">
              Each captured lead is formatted into the following 14 structured columns in Google Sheets
            </p>
          </div>

          <button
            onClick={() => googleWorkspace.downloadCSV(leads, `${driveConfig.sheetName}.csv`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Backup</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-20">Column</th>
                <th className="py-2.5 px-3">Header Label</th>
                <th className="py-2.5 px-3">Field Data Description</th>
                <th className="py-2.5 px-3">Live Value Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fieldMappings.map((fm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-blue-600">{fm.column}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{fm.header}</td>
                  <td className="py-2.5 px-3 text-slate-500">{fm.desc}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 bg-slate-50/50">{fm.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Ledger & Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Google Sheets Sync Ledger</h3>
            <p className="text-xs text-slate-500">Real-time status of all leads in the storage queue</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {syncedLeads.length} Synced
            </span>
            {pendingLeads.length > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {pendingLeads.length} Pending
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Lead Name</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Mapped Product</th>
                <th className="py-2.5 px-3">Deal Value</th>
                <th className="py-2.5 px-3">Sync Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-bold text-slate-900">{lead.name}</td>
                  <td className="py-3 px-3 text-slate-600">{lead.company}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{lead.mappedProductName || 'Unmapped'}</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">${lead.dealValue?.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    {lead.driveSyncStatus === 'synced' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Push
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSyncSingleLead(lead)}
                      disabled={isSyncing}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                    >
                      Push to Sheet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
