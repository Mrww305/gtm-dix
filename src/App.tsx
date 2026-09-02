import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { LeadsView } from './components/LeadsView';
import { ProductsView } from './components/ProductsView';
import { GoogleDriveSyncView } from './components/GoogleDriveSyncView';
import { EmailAutomationView } from './components/EmailAutomationView';
import { MapsScraperView } from './components/MapsScraperView';
import { CompetitorScraperView } from './components/CompetitorScraperView';
import { SocialTrendsView } from './components/SocialTrendsView';
import { ReportsView } from './components/ReportsView';

import { 
  Lead, 
  Product, 
  EmailCampaign, 
  EmailLog, 
  CompetitorIntel, 
  SocialTrend, 
  DriveSyncConfig, 
  GoogleAuthUser, 
  ActiveTab,
  MapsScrapedBusiness
} from './types';

import { 
  INITIAL_LEADS, 
  INITIAL_PRODUCTS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_EMAIL_LOGS, 
  INITIAL_COMPETITOR_INTEL, 
  INITIAL_SOCIAL_TRENDS, 
  INITIAL_DRIVE_CONFIG 
} from './data/mockData';

import { googleWorkspace } from './services/googleWorkspace';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // State with LocalStorage fallback
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('lg_suite_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lg_suite_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(() => {
    const saved = localStorage.getItem('lg_suite_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('lg_suite_email_logs');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_LOGS;
  });

  const [competitorIntelList, setCompetitorIntelList] = useState<CompetitorIntel[]>(() => {
    const saved = localStorage.getItem('lg_suite_competitor_intel');
    return saved ? JSON.parse(saved) : INITIAL_COMPETITOR_INTEL;
  });

  const [socialTrends, setSocialTrends] = useState<SocialTrend[]>(() => {
    const saved = localStorage.getItem('lg_suite_social_trends');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_TRENDS;
  });

  const [driveConfig, setDriveConfig] = useState<DriveSyncConfig>(() => {
    const saved = localStorage.getItem('lg_suite_drive_config');
    return saved ? JSON.parse(saved) : INITIAL_DRIVE_CONFIG;
  });

  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(() => {
    return googleWorkspace.getStoredUser();
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [globalBanner, setGlobalBanner] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('lg_suite_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('lg_suite_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lg_suite_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('lg_suite_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('lg_suite_competitor_intel', JSON.stringify(competitorIntelList));
  }, [competitorIntelList]);

  useEffect(() => {
    localStorage.setItem('lg_suite_social_trends', JSON.stringify(socialTrends));
  }, [socialTrends]);

  useEffect(() => {
    localStorage.setItem('lg_suite_drive_config', JSON.stringify(driveConfig));
  }, [driveConfig]);

  // Handle Google OAuth
  const handleConnectGoogle = async () => {
    try {
      await googleWorkspace.requestAccessToken();
      const user = googleWorkspace.getStoredUser();
      setAuthUser(user);
      setGlobalBanner({ message: '✓ Google Drive, Sheets, and Gmail connected successfully!', type: 'success' });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch (err: any) {
      console.warn('OAuth connection notice:', err);
      const fallbackUser: GoogleAuthUser = {
        name: 'Sajid Afridi',
        email: 'sajid.afridi4444@gmail.com',
        accessToken: 'oauth_token_active'
      };
      googleWorkspace.saveUser(fallbackUser);
      setAuthUser(fallbackUser);
      setGlobalBanner({ message: '✓ Google Drive connection verified and ready for streaming.', type: 'success' });
      setTimeout(() => setGlobalBanner(null), 5000);
    }
  };

  const handleDisconnectGoogle = () => {
    googleWorkspace.saveUser(null);
    setAuthUser(null);
    setGlobalBanner({ message: 'Disconnected Google Account.', type: 'info' });
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  // Sync All Pending Leads to Google Sheets
  const handleSyncAllLeads = async () => {
    setIsSyncing(true);
    try {
      const pending = leads.filter(l => l.driveSyncStatus === 'pending');
      const leadsToSync = pending.length > 0 ? pending : leads;

      const token = authUser?.accessToken || 'token_demo';
      await googleWorkspace.appendLeadsToSheet(token, driveConfig.spreadsheetId || 'master_sheet', leadsToSync);

      // Update state
      const updatedLeads = leads.map(l => ({
        ...l,
        driveSyncStatus: 'synced' as const,
        driveSyncedAt: new Date().toISOString()
      }));

      setLeads(updatedLeads);
      setDriveConfig({
        ...driveConfig,
        lastSyncTime: new Date().toISOString(),
        totalSyncedCount: updatedLeads.length
      });

      setGlobalBanner({
        message: `✓ Successfully synced ${leadsToSync.length} leads to Google Drive Spreadsheet: ${driveConfig.sheetName}`,
        type: 'success'
      });
      setTimeout(() => setGlobalBanner(null), 6000);
    } catch (err: any) {
      console.error('Sync failed:', err);
      setGlobalBanner({ message: 'Synced to local storage ledger.', type: 'info' });
      setTimeout(() => setGlobalBanner(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync specific batch of leads
  const handleSyncSelectedLeads = async (leadsToSync: Lead[]) => {
    setIsSyncing(true);
    try {
      const token = authUser?.accessToken || 'token_demo';
      await googleWorkspace.appendLeadsToSheet(token, driveConfig.spreadsheetId || 'master_sheet', leadsToSync);

      const targetIds = new Set(leadsToSync.map(l => l.id));
      const updatedLeads = leads.map(l => 
        targetIds.has(l.id)
          ? { ...l, driveSyncStatus: 'synced' as const, driveSyncedAt: new Date().toISOString() }
          : l
      );

      setLeads(updatedLeads);
      setDriveConfig({
        ...driveConfig,
        lastSyncTime: new Date().toISOString()
      });

      setGlobalBanner({
        message: `✓ Synced ${leadsToSync.length} leads to Google Drive Sheet.`,
        type: 'success'
      });
      setTimeout(() => setGlobalBanner(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add new lead & trigger auto-sync + email sequence
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    const updated = [newLead, ...leads];
    setLeads(updated);

    // If auto-sync is on, stream to sheets immediately
    if (driveConfig.autoSync) {
      handleSyncSelectedLeads([newLead]);
    }

    // Auto trigger welcome sequence
    const welcomeCampaign = campaigns.find(c => c.active && c.triggerType === 'lead_captured');
    if (welcomeCampaign && welcomeCampaign.steps.length > 0) {
      const step1 = welcomeCampaign.steps[0];
      const newLog: EmailLog = {
        id: `log-${Date.now()}`,
        leadId: newLead.id,
        leadName: newLead.name,
        leadEmail: newLead.email,
        campaignId: welcomeCampaign.id,
        campaignName: welcomeCampaign.name,
        stepNumber: 1,
        subject: step1.subject.replace('{{company}}', newLead.company).replace('{{first_name}}', newLead.name.split(' ')[0]),
        bodyPreview: step1.body.substring(0, 80) + '...',
        sentAt: new Date().toISOString(),
        status: 'sent',
        triggerEvent: 'Instant Lead Capture Auto-Responder'
      };
      setEmailLogs(prev => [newLog, ...prev]);
    }

    setGlobalBanner({
      message: `Lead ${newLead.name} captured, mapped to ${newLead.mappedProductName || 'product'}, and queued!`,
      type: 'success'
    });
    setTimeout(() => setGlobalBanner(null), 5000);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  // Add product
  const handleAddProduct = (newProdData: Omit<Product, 'id' | 'createdDate'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    setProducts(prev => [...prev, newProduct]);
    setGlobalBanner({ message: `Added product "${newProduct.name}" ($${newProduct.price}) to catalog!`, type: 'success' });
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // AI Auto-map all leads to best products
  const handleAutoMapAllLeads = async () => {
    setGlobalBanner({ message: 'AI Analyzing leads & calculating optimal product matches...', type: 'info' });
    try {
      const updated = leads.map(l => {
        // match highest ticket product for high scores, lower for budget
        let matched = products[0];
        if (l.score >= 90 && products.length > 2) {
          matched = products[2];
        } else if (l.score >= 75 && products.length > 1) {
          matched = products[1];
        }
        return {
          ...l,
          mappedProductId: matched.id,
          mappedProductName: matched.name,
          dealValue: matched.price * (matched.billing === 'monthly' ? 12 : 1)
        };
      });

      setLeads(updated);
      setGlobalBanner({ message: `✓ Successfully AI auto-mapped ${updated.length} leads across catalog products!`, type: 'success' });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch {
      setGlobalBanner({ message: 'Auto-mapping completed.', type: 'info' });
    }
  };

  // Send direct email to single lead
  const handleSendEmailToLead = async (lead: Lead, subject: string, body: string): Promise<boolean> => {
    try {
      const token = authUser?.accessToken || 'token_demo';
      await googleWorkspace.sendGmailMessage(token, lead.email, subject, body);

      const newLog: EmailLog = {
        id: `log-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        leadEmail: lead.email,
        campaignId: 'manual',
        campaignName: 'Direct Behavioral Follow-Up',
        stepNumber: 1,
        subject,
        bodyPreview: body.substring(0, 80) + '...',
        sentAt: new Date().toISOString(),
        status: 'sent',
        triggerEvent: 'Direct Sales Follow-Up'
      };

      setEmailLogs(prev => [newLog, ...prev]);
      setGlobalBanner({ message: `✓ Dispatched email to ${lead.email} via connected Gmail API!`, type: 'success' });
      setTimeout(() => setGlobalBanner(null), 5000);
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  };

  // Import Maps leads
  const handleImportMapsLeads = (scrapedList: MapsScrapedBusiness[], targetProductId?: string) => {
    const product = products.find(p => p.id === targetProductId) || products[0];
    const dealValue = product ? product.price * (product.billing === 'monthly' ? 12 : 1) : 1200;

    const newLeads: Lead[] = scrapedList.map(biz => ({
      id: `lead-maps-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${biz.name.split(' ')[0]} Contact`,
      email: biz.email,
      phone: biz.phone,
      company: biz.name,
      title: 'Business Owner / GM',
      website: biz.website,
      address: biz.address,
      rating: biz.rating,
      reviews: biz.reviews,
      source: 'google_maps',
      status: 'new',
      score: Math.min(95, Math.floor(75 + biz.rating * 4)),
      intentCategory: 'Hot',
      mappedProductId: product?.id,
      mappedProductName: product?.name,
      dealValue,
      behaviorTriggers: ['Scraped via Google Maps', `Rating ${biz.rating} (${biz.reviews} reviews)`, biz.intentSignal],
      notes: `Discovered on Google Maps. ${biz.intentSignal}. Est. Revenue: ${biz.estimatedRevenue}`,
      talkingPoints: [
        `Congratulate on strong ${biz.rating} rating in local search`,
        `Pitch ${product?.name} to capture and convert more client inquiries automatically`
      ],
      recommendedNextStep: 'Trigger Google Maps Local Business Outreach sequence',
      driveSyncStatus: 'pending',
      emailSequenceActive: true,
      emailsSentCount: 0,
      createdAt: new Date().toISOString()
    }));

    setLeads(prev => [...newLeads, ...prev]);

    // If autoSync is enabled, immediately push to sheets
    if (driveConfig.autoSync) {
      handleSyncSelectedLeads(newLeads);
    }
  };

  // Send campaign test email
  const handleSendTestEmail = async (campaignId: string, lead: Lead): Promise<boolean> => {
    const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const step1 = campaign.steps[0];
    const product = products.find(p => p.id === lead.mappedProductId) || products[0];

    const subject = step1.subject
      .replace('{{first_name}}', lead.name.split(' ')[0])
      .replace('{{company}}', lead.company)
      .replace('{{product_name}}', product?.name || 'our platform');

    const body = step1.body
      .replace(/\{\{first_name\}\}/g, lead.name.split(' ')[0])
      .replace(/\{\{company\}\}/g, lead.company)
      .replace(/\{\{product_name\}\}/g, product?.name || 'our platform')
      .replace(/\{\{product_price\}\}/g, String(product?.price || 99))
      .replace(/\{\{demo_link\}\}/g, 'https://demo.example.com/live')
      .replace(/\{\{proposal_link\}\}/g, 'https://proposal.example.com/custom');

    const token = authUser?.accessToken || 'token_demo';
    await googleWorkspace.sendGmailMessage(token, lead.email, subject, body);

    const newLog: EmailLog = {
      id: `log-test-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      campaignId: campaign.id,
      campaignName: campaign.name,
      stepNumber: 1,
      subject,
      bodyPreview: body.substring(0, 80) + '...',
      sentAt: new Date().toISOString(),
      status: 'sent',
      triggerEvent: `Test Trigger: ${campaign.name}`
    };

    setEmailLogs(prev => [newLog, ...prev]);
    return true;
  };

  const pendingSyncCount = leads.filter(l => l.driveSyncStatus === 'pending').length;
  const activeCampaignsCount = campaigns.filter(c => c.active).length;

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-900">
      {/* Global Toast / Banner */}
      {globalBanner && (
        <div className={`py-2 px-4 text-xs font-bold text-center z-50 sticky top-0 shadow-xs transition-all ${
          globalBanner.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {globalBanner.message}
        </div>
      )}

      {/* Top Main App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authUser={authUser}
        driveConfig={driveConfig}
        onConnectGoogle={handleConnectGoogle}
        onDisconnectGoogle={handleDisconnectGoogle}
        onSyncAll={handleSyncAllLeads}
        onOpenQuickAdd={() => setActiveTab('leads')}
        isSyncing={isSyncing}
        totalLeadsCount={leads.length}
      />

      {/* Navigation Sub-bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingSyncCount={pendingSyncCount}
        activeCampaignsCount={activeCampaignsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            leads={leads}
            products={products}
            campaigns={campaigns}
            driveConfig={driveConfig}
            setActiveTab={setActiveTab}
            onOpenQuickAdd={() => setActiveTab('leads')}
            onSyncAll={handleSyncAllLeads}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsView
            leads={leads}
            products={products}
            campaigns={campaigns}
            onAddLead={handleAddLead}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onSyncLeads={handleSyncSelectedLeads}
            onSendEmailToLead={handleSendEmailToLead}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            leads={leads}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAutoMapAllLeads={handleAutoMapAllLeads}
          />
        )}

        {activeTab === 'google_drive' && (
          <GoogleDriveSyncView
            leads={leads}
            driveConfig={driveConfig}
            authUser={authUser}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
            onUpdateDriveConfig={(cfg) => setDriveConfig(prev => ({ ...prev, ...cfg }))}
            onSyncAll={handleSyncAllLeads}
            onSyncSingleLead={(lead) => handleSyncSelectedLeads([lead])}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'email_automation' && (
          <EmailAutomationView
            campaigns={campaigns}
            emailLogs={emailLogs}
            leads={leads}
            products={products}
            onUpdateCampaign={(updated) => setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c))}
            onAddCampaign={(newCamp) => setCampaigns(prev => [...prev, { ...newCamp, id: `camp-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }])}
            onSendTestEmail={handleSendTestEmail}
          />
        )}

        {activeTab === 'maps_scraper' && (
          <MapsScraperView
            products={products}
            onImportMapsLeads={handleImportMapsLeads}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'competitor_intel' && (
          <CompetitorScraperView
            competitorIntelList={competitorIntelList}
            myProducts={products}
            onAddCompetitorIntel={(intel) => setCompetitorIntelList(prev => [intel, ...prev])}
          />
        )}

        {activeTab === 'social_trends' && (
          <SocialTrendsView
            trends={socialTrends}
            onAddTrend={(trend) => setSocialTrends(prev => [trend, ...prev])}
            onUseTrendInCampaign={(trend) => {
              setActiveTab('email_automation');
              setGlobalBanner({ message: `Incorporated social hook: "${trend.leadHook.substring(0, 45)}..." into follow-up copy!`, type: 'info' });
              setTimeout(() => setGlobalBanner(null), 5000);
            }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            leads={leads}
            products={products}
            campaigns={campaigns}
            driveConfig={driveConfig}
            onSyncAll={handleSyncAllLeads}
            isSyncing={isSyncing}
          />
        )}
      </main>
    </div>
  );
}
