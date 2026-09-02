import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileSpreadsheet, 
  Mail, 
  MapPin, 
  Target, 
  TrendingUp, 
  BarChart2,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingSyncCount: number;
  activeCampaignsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingSyncCount,
  activeCampaignsCount
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead Hub', icon: Users, badge: pendingSyncCount > 0 ? `${pendingSyncCount} unsynced` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'products', label: 'Products & Pricing', icon: Package },
    { id: 'google_drive', label: 'Google Drive Sync', icon: FileSpreadsheet, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'email_automation', label: 'Behavioral Emailer', icon: Mail, badge: activeCampaignsCount, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'maps_scraper', label: 'Google Maps Scraper', icon: MapPin },
    { id: 'competitor_intel', label: 'Competitor Pricing', icon: Target },
    { id: 'social_trends', label: 'Social Trends', icon: TrendingUp },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2 }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-20 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : (item.badgeColor || 'bg-slate-100 text-slate-700')}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
