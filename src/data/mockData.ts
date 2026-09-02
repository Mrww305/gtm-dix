import { Product, Lead, EmailCampaign, EmailLog, CompetitorIntel, SocialTrend, DriveSyncConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Growth Lead Automation Starter',
    sku: 'GLA-STARTER',
    category: 'Software / Automation',
    price: 99,
    billing: 'monthly',
    margin: 90,
    description: 'Automated lead scraper, 1-click Google Drive sync, and 500 automated follow-up emails per month.',
    targetAudience: 'Solo entrepreneurs, consultants, boutique agencies',
    features: [
      '500 monthly email dispatches',
      'Google Sheets real-time sync',
      'Google Maps 100 business scraper / mo',
      'Lead scoring & product auto-tagging'
    ],
    idealBudgetMin: 500,
    idealCompanySize: '1-10 employees',
    createdDate: '2026-08-15'
  },
  {
    id: 'prod-2',
    name: 'Scale Pipeline & Competitor Intel Pro',
    sku: 'SPI-PRO',
    category: 'Software / CRM',
    price: 249,
    billing: 'monthly',
    margin: 88,
    description: 'Unlimited Google Sheets sync, deep competitor pricing tracker, behavioral email sequences, and multi-channel lead enrichment.',
    targetAudience: 'Fast-growing B2B sales teams, mid-market agencies (10-50 employees)',
    features: [
      'Unlimited Google Drive sync & backups',
      'Behavior-triggered dynamic email sequences',
      'Competitor pricing parser & talking point generator',
      'Social media buying trend alerts',
      'Dedicated Google Maps local lead finder'
    ],
    idealBudgetMin: 2000,
    idealCompanySize: '10-50 employees',
    createdDate: '2026-08-10'
  },
  {
    id: 'prod-3',
    name: 'Enterprise Revenue Engine & Custom Scrapers',
    sku: 'ERE-ENTERPRISE',
    category: 'Enterprise Suite',
    price: 799,
    billing: 'monthly',
    margin: 82,
    description: 'High-volume lead generation pipeline, custom API webhooks, automated CRM routing, and AI personalization agent.',
    targetAudience: 'Enterprise sales organizations, high-ticket service providers',
    features: [
      'Custom headless web scrapers & parsers',
      'Sub-second Google Sheets real-time bi-directional sync',
      'AI email auto-responder with dynamic tone adjustment',
      'Multi-seat team permissions & role management',
      'Dedicated IP warming & 99.8% inbox deliverability'
    ],
    idealBudgetMin: 10000,
    idealCompanySize: '50+ employees',
    createdDate: '2026-08-01'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@luminarytech.io',
    phone: '+1 (415) 890-3321',
    company: 'Luminary Technologies',
    title: 'VP of Growth',
    website: 'https://luminarytech.io',
    address: '500 Howard St, San Francisco, CA',
    source: 'google_maps',
    status: 'demo_scheduled',
    score: 94,
    intentCategory: 'Enterprise',
    mappedProductId: 'prod-2',
    mappedProductName: 'Scale Pipeline & Competitor Intel Pro',
    dealValue: 2988,
    behaviorTriggers: ['Viewed Pricing 3x', 'Downloaded SaaS Case Study', 'Scraped via Maps'],
    notes: 'Looking to replace Zapier + manual spreadsheets for 12 sales reps.',
    talkingPoints: [
      'Highlight native Google Drive zero-latency sync',
      'Emphasize automated behavior email sequences'
    ],
    recommendedNextStep: 'Send custom demo deck with product-to-lead spreadsheet preview',
    driveSyncStatus: 'synced',
    driveSyncedAt: '2026-09-01T18:24:00Z',
    emailSequenceActive: true,
    emailsSentCount: 2,
    lastActivity: '2026-09-02T02:15:00Z',
    createdAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'lead-102',
    name: 'Marcus Vance',
    email: 'm.vance@apexroofingtx.com',
    phone: '+1 (512) 678-9900',
    company: 'Apex Roofing & Solar',
    title: 'Owner & Managing Director',
    website: 'https://apexroofingtx.com',
    address: '890 Commerce Blvd, Austin, TX',
    rating: 4.9,
    reviews: 184,
    source: 'google_maps',
    status: 'qualified',
    score: 87,
    intentCategory: 'Hot',
    mappedProductId: 'prod-1',
    mappedProductName: 'Growth Lead Automation Starter',
    dealValue: 1188,
    behaviorTriggers: ['Maps Scraped High Intent', 'Opened Initial Pitch Email'],
    notes: 'Needs local commercial leads in Central Texas to expand roofing contracts.',
    talkingPoints: [
      'Show how Google Maps scraper finds commercial property owners',
      'Point out 1-click export to Google Sheets'
    ],
    recommendedNextStep: 'Offer free 50-lead trial export to their Google Drive',
    driveSyncStatus: 'synced',
    driveSyncedAt: '2026-09-01T21:10:00Z',
    emailSequenceActive: true,
    emailsSentCount: 1,
    lastActivity: '2026-09-01T21:15:00Z',
    createdAt: '2026-08-30T10:15:00Z'
  },
  {
    id: 'lead-103',
    name: 'Elena Rostova',
    email: 'elena@novacrestmarketing.com',
    phone: '+1 (312) 554-8821',
    company: 'NovaCrest Digital Agency',
    title: 'Head of Client Acquisition',
    website: 'https://novacrestmarketing.com',
    source: 'web_form',
    status: 'proposal_sent',
    score: 91,
    intentCategory: 'Enterprise',
    mappedProductId: 'prod-3',
    mappedProductName: 'Enterprise Revenue Engine & Custom Scrapers',
    dealValue: 9588,
    behaviorTriggers: ['Filled Custom Quote Form', 'Submitted 25+ Seat Request'],
    notes: 'Agency managing 30 client lead accounts. Needs multi-sheet Drive segregation.',
    talkingPoints: [
      'Explain multi-folder Google Drive organization per client',
      'Demonstrate custom competitor pricing scraper'
    ],
    recommendedNextStep: 'Follow up on MSA contract & enterprise terms',
    driveSyncStatus: 'synced',
    driveSyncedAt: '2026-09-02T00:10:00Z',
    emailSequenceActive: true,
    emailsSentCount: 3,
    lastActivity: '2026-09-02T01:45:00Z',
    createdAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'lead-104',
    name: 'David Chen',
    email: 'david@zenithlogistics.com',
    phone: '+1 (206) 431-7788',
    company: 'Zenith Logistics Group',
    title: 'Operations Director',
    website: 'https://zenithlogistics.com',
    source: 'competitor_intel',
    status: 'contacted',
    score: 79,
    intentCategory: 'Warm',
    mappedProductId: 'prod-2',
    mappedProductName: 'Scale Pipeline & Competitor Intel Pro',
    dealValue: 2988,
    behaviorTriggers: ['Visited Competitor Comparison Page', 'Read Pricing Tear-Down'],
    notes: 'Currently using costly legacy CRM, looking for lean sheets + automated email setup.',
    talkingPoints: [
      'Break down savings compared to competitor $299/mo tier',
      'Show how automated follow-up sequences cut response time to 2 mins'
    ],
    recommendedNextStep: 'Send competitor comparison breakdown email',
    driveSyncStatus: 'pending',
    emailSequenceActive: true,
    emailsSentCount: 1,
    lastActivity: '2026-09-01T15:00:00Z',
    createdAt: '2026-09-01T11:20:00Z'
  },
  {
    id: 'lead-105',
    name: 'Amara Okafor',
    email: 'amara.o@cloudpulsehealth.com',
    company: 'CloudPulse Health AI',
    title: 'Founder & CEO',
    website: 'https://cloudpulsehealth.com',
    source: 'social_scraper',
    status: 'new',
    score: 83,
    intentCategory: 'Hot',
    mappedProductId: 'prod-2',
    mappedProductName: 'Scale Pipeline & Competitor Intel Pro',
    dealValue: 2988,
    behaviorTriggers: ['Liked LinkedIn thread on Lead Scrapers', 'Engaged with Drive CRM post'],
    notes: 'Early-stage healthtech startup ramping outbound lead generation.',
    talkingPoints: [
      'Demonstrate fast setup within 3 minutes',
      'Show instant lead-to-product mapping'
    ],
    recommendedNextStep: 'Trigger automated Welcome & Founder Introduction Email',
    driveSyncStatus: 'pending',
    emailSequenceActive: false,
    emailsSentCount: 0,
    lastActivity: '2026-09-02T03:00:00Z',
    createdAt: '2026-09-02T03:00:00Z'
  }
];

export const INITIAL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'camp-1',
    name: 'Instant Lead Capture & Welcome Sequence',
    triggerType: 'lead_captured',
    triggerDescription: 'Triggers immediately when a new lead enters the system or fills a form.',
    active: true,
    stats: { sent: 148, opened: 112, clicked: 64, replied: 38 },
    createdAt: '2026-08-15',
    steps: [
      {
        id: 'step-1-1',
        stepNumber: 1,
        delayHours: 0,
        subject: 'Quick question regarding {{company}} & your lead pipeline',
        body: `Hi {{first_name}},\n\nThanks for connecting! I saw your recent interest in {{product_name}}.\n\nWe help companies like {{company}} automate their lead capture directly into organized Google Drive spreadsheets, map high-intent products, and trigger instant behavioral follow-ups.\n\nWould you like a quick 5-minute walkthrough of our setup?\n\nBest,\nLead Gen Team`,
        goal: 'Instant introduction & qualification',
        ctaText: 'Schedule Quick 10-Min Demo'
      },
      {
        id: 'step-1-2',
        stepNumber: 2,
        delayHours: 24,
        subject: 'How {{company}} can save 15+ hours/week on lead management',
        body: `Hi {{first_name}},\n\nFollowing up on my note yesterday—most sales leaders we speak with struggle with scattered spreadsheets and missed follow-ups.\n\nWith {{product_name}} ($${'{{product_price}}'}), your captured contacts are auto-synced to Google Sheets with lead scoring in under 2 seconds.\n\nHere is a 2-minute video overview: {{demo_link}}\n\nLet me know what you think!\n\nBest,\nLead Gen Team`,
        goal: 'Value demonstration & case study',
        ctaText: 'Watch 2-Minute Demo'
      },
      {
        id: 'step-1-3',
        stepNumber: 3,
        delayHours: 72,
        subject: 'Should I close your file regarding {{product_name}}?',
        body: `Hi {{first_name}},\n\nI haven't heard back, so I assume scaling lead generation isn't a top priority right now for {{company}}—no worries at all!\n\nIf your priorities change or you want to test our Google Maps lead scraper and automated Drive sync, feel free to reply anytime.\n\nCheers,\nLead Gen Team`,
        goal: 'Break-up / high-urgency re-engagement',
        ctaText: 'Reply to Reconnect'
      }
    ]
  },
  {
    id: 'camp-2',
    name: 'High-Intent Pricing & Competitor Switcher',
    triggerType: 'high_intent',
    triggerDescription: 'Triggers when a lead has intent score > 80 or views competitor comparison.',
    active: true,
    stats: { sent: 82, opened: 69, clicked: 48, replied: 29 },
    createdAt: '2026-08-20',
    steps: [
      {
        id: 'step-2-1',
        stepNumber: 1,
        delayHours: 0,
        subject: 'Tailored pricing breakdown & ROI model for {{company}}',
        body: `Hi {{first_name}},\n\nNoticed you were reviewing our pricing tiers and competitor comparisons.\n\nFor a team of your size, our {{product_name}} ($${'{{product_price}}'}/mo) delivers full Google Drive sync, scraper tools, and automated follow-ups without the bloated seat fees charged by legacy platforms.\n\nI've prepared a custom breakdown for {{company}} here: {{proposal_link}}\n\nAre you available for a 10-minute check-in tomorrow?\n\nBest,\nSenior Solutions Architect`,
        goal: 'Direct closing & pricing objection handling',
        ctaText: 'View Custom Proposal'
      }
    ]
  },
  {
    id: 'camp-3',
    name: 'Google Maps Local Outreach Follow-Up',
    triggerType: 'maps_imported',
    triggerDescription: 'Triggers when local businesses are scraped and imported via Google Maps.',
    active: true,
    stats: { sent: 94, opened: 68, clicked: 35, replied: 21 },
    createdAt: '2026-08-25',
    steps: [
      {
        id: 'step-3-1',
        stepNumber: 1,
        delayHours: 1,
        subject: 'Noticed {{company}} on Google Maps—quick idea for more local clients',
        body: `Hi {{first_name}} and the {{company}} team,\n\nI came across your business listing while researching top-rated providers in your area (congrats on the strong reputation!).\n\nWe built a dedicated tool that maps local client inquiries straight into your Google Drive and follows up via email in under 60 seconds, converting up to 3x more local inquiries into paid clients.\n\nWould you be open to seeing how this could bring 10-15 new inquiries to {{company}} this month?\n\nBest regards,\nLocal Growth Specialist`,
        goal: 'Local business acquisition',
        ctaText: 'See Local Growth Blueprint'
      }
    ]
  }
];

export const INITIAL_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'log-1',
    leadId: 'lead-101',
    leadName: 'Sarah Jenkins',
    leadEmail: 'sarah.jenkins@luminarytech.io',
    campaignId: 'camp-1',
    campaignName: 'Instant Lead Capture & Welcome Sequence',
    stepNumber: 1,
    subject: 'Quick question regarding Luminary Technologies & your lead pipeline',
    bodyPreview: 'Thanks for connecting! I saw your recent interest in Scale Pipeline & Competitor Intel Pro...',
    sentAt: '2026-09-01T14:35:00Z',
    status: 'opened',
    triggerEvent: 'Lead Captured via Google Maps'
  },
  {
    id: 'log-2',
    leadId: 'lead-103',
    leadName: 'Elena Rostova',
    leadEmail: 'elena@novacrestmarketing.com',
    campaignId: 'camp-2',
    campaignName: 'High-Intent Pricing & Competitor Switcher',
    stepNumber: 1,
    subject: 'Tailored pricing breakdown & ROI model for NovaCrest Digital Agency',
    bodyPreview: 'Noticed you were reviewing our pricing tiers and competitor comparisons...',
    sentAt: '2026-09-01T19:00:00Z',
    status: 'replied',
    triggerEvent: 'High-Intent Score 91+ Form Submission'
  },
  {
    id: 'log-3',
    leadId: 'lead-102',
    leadName: 'Marcus Vance',
    leadEmail: 'm.vance@apexroofingtx.com',
    campaignId: 'camp-3',
    campaignName: 'Google Maps Local Outreach Follow-Up',
    stepNumber: 1,
    subject: 'Noticed Apex Roofing & Solar on Google Maps—quick idea for more local clients',
    bodyPreview: 'I came across your business listing while researching top-rated providers in your area...',
    sentAt: '2026-09-01T21:12:00Z',
    status: 'opened',
    triggerEvent: 'Maps Scraped & Synced to Sheets'
  }
];

export const INITIAL_COMPETITOR_INTEL: CompetitorIntel[] = [
  {
    id: 'comp-1',
    competitorName: 'HubSpot Sales Hub',
    urlOrDomain: 'hubspot.com/pricing',
    overview: 'Prominent marketing & sales CRM suite with heavy tiered enterprise pricing and per-contact fees.',
    pricingTiers: [
      { name: 'Starter', price: '$20/seat/mo', billing: 'billed annually', keyFeatures: ['Simple CRM', 'Basic email templates', 'Up to 1,000 contacts'], targetCustomer: 'Early-stage startups' },
      { name: 'Professional', price: '$500/mo (5 seats)', billing: 'billed annually + mandatory $1,500 onboarding', keyFeatures: ['Custom reporting', 'Automated workflows', 'Lead scoring'], targetCustomer: 'Mid-sized teams' },
      { name: 'Enterprise', price: '$1,500/mo', billing: 'annual contract', keyFeatures: ['Predictive lead scoring', 'Custom objects', 'Multi-currency'], targetCustomer: 'Large corporations' }
    ],
    weaknesses: [
      'Extreme price cliff jumping from Starter ($20) to Pro ($500/mo) with mandatory $1,500 setup fee',
      'No native Google Drive spreadsheet sync without complex third-party Zapier triggers',
      'Lacks built-in Google Maps commercial scraper and social trend parser'
    ],
    counterPositioningHooks: [
      'Zero onboarding penalty fees with instant 3-minute Google Drive sync setup',
      'Transparent flat pricing regardless of contact volume expansion',
      'All-in-one lead discovery (Maps scraper + email follow-up + competitor parser) in one dashboard'
    ],
    analyzedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'comp-2',
    competitorName: 'Apollo.io',
    urlOrDomain: 'apollo.io/pricing',
    overview: 'B2B database and email engagement tool with credit-based usage tiers.',
    pricingTiers: [
      { name: 'Free', price: '$0', billing: 'monthly', keyFeatures: ['10 export credits', 'Basic filters', 'Gmail extension'], targetCustomer: 'Individuals' },
      { name: 'Basic', price: '$49/user/mo', billing: 'billed annually', keyFeatures: ['Uncapped email credits', 'Buying intent filters', '2 sequence limit'], targetCustomer: 'Small sales teams' },
      { name: 'Professional', price: '$79/user/mo', billing: 'billed annually', keyFeatures: ['Dialer integration', 'A/B testing', 'Unlimited sequences'], targetCustomer: 'Active SDR teams' }
    ],
    weaknesses: [
      'Credit throttling on mobile numbers and export limits',
      'Data accuracy on local businesses and service contractors outside tech is often outdated',
      'Requires separate tools for automated spreadsheet archiving and catalog product mapping'
    ],
    counterPositioningHooks: [
      'Direct real-time Google Maps local scraper that extracts live active businesses with high accuracy',
      'Seamless lead-to-product mapping that calculates expected revenue pipeline automatically',
      'Native Google Sheets auto-append with zero export credit limits'
    ],
    analyzedAt: '2026-09-01T16:30:00Z'
  }
];

export const INITIAL_SOCIAL_TRENDS: SocialTrend[] = [
  {
    id: 'trend-1',
    topic: 'Google Sheets as a High-Speed Zero-Cost CRM',
    platform: 'Reddit (r/entrepreneur & r/sales)',
    momentum: '+154% weekly',
    sentiment: 'High Pragmatic Enthusiasm',
    buyingIntent: 'Very High',
    leadHook: 'Why pay $500/mo for bloated CRMs when you can auto-sync leads into structured Google Drive Sheets with instant follow-ups?',
    analyzedAt: '2026-09-02T01:30:00Z'
  },
  {
    id: 'trend-2',
    topic: 'Instant Behavioral Trigger Emails vs. Generic Cold Blasts',
    platform: 'LinkedIn / Sales Tech Debate',
    momentum: '+118% weekly',
    sentiment: 'Urgent Shift in Strategy',
    buyingIntent: 'High',
    leadHook: 'Leads followed up within 2 minutes of intent action convert 391% higher. Here is how to automate it seamlessly.',
    analyzedAt: '2026-09-02T02:00:00Z'
  },
  {
    id: 'trend-3',
    topic: 'Local B2B Google Maps Scraping for Service Contractors',
    platform: 'X / Growth Twitter',
    momentum: '+92% weekly',
    sentiment: 'Strong Demand',
    buyingIntent: 'High',
    leadHook: 'Targeting local clinics, roofers, and agencies with verified Maps ratings and personalized pricing hooks.',
    analyzedAt: '2026-09-01T23:45:00Z'
  }
];

export const INITIAL_DRIVE_CONFIG: DriveSyncConfig = {
  enabled: true,
  folderName: 'Lead Generation Hub (Master Drive)',
  folderId: 'folder_drive_leadgen_hub_2026',
  sheetName: 'Captured_Leads_Master_2026',
  spreadsheetId: 'sheet_lead_master_sync_2026',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  autoSync: true,
  lastSyncTime: '2026-09-02T02:40:00Z',
  totalSyncedCount: 4
};
