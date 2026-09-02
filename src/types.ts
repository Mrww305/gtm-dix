export type LeadSource = 'google_maps' | 'web_form' | 'social_scraper' | 'competitor_intel' | 'manual' | 'landing_page';

export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'demo_scheduled' | 'proposal_sent' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  website?: string;
  address?: string;
  rating?: number;
  reviews?: number;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0 - 100
  intentCategory?: 'Cold' | 'Warm' | 'Hot' | 'Enterprise';
  mappedProductId?: string;
  mappedProductName?: string;
  dealValue: number;
  behaviorTriggers: string[];
  notes?: string;
  talkingPoints?: string[];
  recommendedNextStep?: string;
  driveSyncStatus: 'synced' | 'pending' | 'error';
  driveSyncedAt?: string;
  emailSequenceActive?: boolean;
  emailsSentCount?: number;
  lastActivity?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  billing: 'monthly' | 'annually' | 'one-time';
  margin?: number; // e.g., 85%
  description: string;
  targetAudience: string;
  features: string[];
  idealBudgetMin?: number;
  idealCompanySize?: string;
  createdDate: string;
}

export interface EmailStep {
  id: string;
  stepNumber: number;
  delayHours: number; // 0 = immediate, 24 = 1 day, etc.
  subject: string;
  body: string;
  goal: string;
  ctaText?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  triggerType: 'lead_captured' | 'high_intent' | 'pricing_inquiry' | 'maps_imported' | 'product_mapped' | 'dormant_3days';
  triggerDescription: string;
  active: boolean;
  steps: EmailStep[];
  targetProductId?: string; // specific product or all
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  };
  createdAt: string;
}

export interface EmailLog {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  campaignId: string;
  campaignName: string;
  stepNumber: number;
  subject: string;
  bodyPreview: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'failed';
  triggerEvent: string;
}

export interface GoogleAuthUser {
  name: string;
  email: string;
  picture?: string;
  accessToken?: string;
  tokenExpiresAt?: number;
}

export interface DriveSyncConfig {
  enabled: boolean;
  folderName: string;
  folderId?: string;
  sheetName: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  autoSync: boolean;
  lastSyncTime: string | null;
  totalSyncedCount: number;
}

export interface CompetitorPricingTier {
  name: string;
  price: string;
  billing: string;
  keyFeatures: string[];
  targetCustomer: string;
}

export interface CompetitorIntel {
  id: string;
  competitorName: string;
  urlOrDomain: string;
  overview: string;
  pricingTiers: CompetitorPricingTier[];
  weaknesses: string[];
  counterPositioningHooks: string[];
  analyzedAt: string;
}

export interface SocialTrend {
  id: string;
  topic: string;
  platform: string;
  momentum: string;
  sentiment: string;
  buyingIntent: string;
  leadHook: string;
  analyzedAt: string;
}

export interface MapsScrapedBusiness {
  name: string;
  category: string;
  phone: string;
  website: string;
  email: string;
  address: string;
  rating: number;
  reviews: number;
  intentSignal: string;
  estimatedRevenue: string;
  selected?: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'leads'
  | 'products'
  | 'google_drive'
  | 'email_automation'
  | 'maps_scraper'
  | 'competitor_intel'
  | 'social_trends'
  | 'reports';
