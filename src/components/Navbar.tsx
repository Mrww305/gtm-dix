import React from 'react';
import { 
  Database, 
  Layers, 
  Mail, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  FileSpreadsheet, 
  Search, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  FolderSync
} from 'lucide-react';
import { ActiveTab, GoogleAuthUser, DriveSyncConfig } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authUser: GoogleAuthUser | null;
  driveConfig: DriveSyncConfig;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onSyncAll: () => void;
  onOpenQuickAdd: () => void;
  isSyncing: boolean;
  totalLeadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  authUser,
  driveConfig,
  onConnectGoogle,
  onDisconnectGoogle,
  onSyncAll,
  onOpenQuickAdd,
  isSyncing,
  totalLeadsCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">LeadPulse</span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-blue-200/60">
                  Drive & Maps Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Automated Lead Gen • Sheets Sync • Behavioral Emailer</p>
            </div>
          </div>

          {/* Center quick stats */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">Pipeline:</span>
              <span className="font-bold text-slate-900">{totalLeadsCount} Leads</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600 font-medium">Auto-Sync:</span>
              <span className={`font-semibold ${driveConfig.autoSync ? 'text-emerald-600' : 'text-slate-500'}`}>
                {driveConfig.autoSync ? 'Active (Live)' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Right actions: Google Workspace OAuth & Quick Add */}
          <div className="flex items-center gap-2.5">
            <button
              id="quick-sync-btn"
              onClick={onSyncAll}
              disabled={isSyncing}
              title="Push all pending leads to Google Sheets"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync to Sheets'}</span>
            </button>

            {authUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                    {authUser.picture ? (
                      <img src={authUser.picture} alt={authUser.name} className="w-full h-full object-cover" />
                    ) : (
                      authUser.name?.charAt(0) || 'G'
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">{authUser.name}</p>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Drive Connected
                    </p>
                  </div>
                </div>
                <button
                  id="google-disconnect-btn"
                  onClick={onDisconnectGoogle}
                  title="Disconnect Google Account"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="connect-google-btn"
                onClick={onConnectGoogle}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Connect Google Drive</span>
              </button>
            )}

            <button
              id="quick-add-lead-btn"
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
