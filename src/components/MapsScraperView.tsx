import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  Building, 
  Phone, 
  Globe, 
  Mail, 
  Star, 
  CheckCircle2, 
  FileSpreadsheet, 
  Download, 
  ArrowRight,
  Filter,
  Layers,
  Zap
} from 'lucide-react';
import { MapsScrapedBusiness, Lead, Product } from '../types';

interface MapsScraperViewProps {
  products: Product[];
  onImportMapsLeads: (scrapedLeads: MapsScrapedBusiness[], targetProductId?: string) => void;
  isSyncing: boolean;
}

export const MapsScraperView: React.FC<MapsScraperViewProps> = ({
  products,
  onImportMapsLeads,
  isSyncing
}) => {
  const [query, setQuery] = useState('HVAC & Roofing Contractors');
  const [location, setLocation] = useState('Austin, TX');
  const [industry, setIndustry] = useState('Home Services & Construction');
  const [isScraping, setIsScraping] = useState(false);
  const [marketSummary, setMarketSummary] = useState<string | null>(null);
  const [scrapedResults, setScrapedResults] = useState<MapsScrapedBusiness[]>([
    {
      name: 'Lonestar Commercial HVAC & Roofing',
      category: 'HVAC & Roofing',
      phone: '+1 (512) 890-4411',
      website: 'https://lonestarhvac-austin.example.com',
      email: 'service@lonestarhvac-austin.example.com',
      address: '1400 E 4th St, Austin, TX 78702',
      rating: 4.8,
      reviews: 215,
      intentSignal: 'Running heavy Google Local Services Ads, expanding commercial fleet',
      estimatedRevenue: '$2.5M - $5M',
      selected: true
    },
    {
      name: 'Austin Premier Dental Group',
      category: 'Healthcare & Dental',
      phone: '+1 (512) 330-9090',
      website: 'https://austinpremierdental.example.com',
      email: 'office@austinpremierdental.example.com',
      address: '2210 S 1st St, Austin, TX 78704',
      rating: 4.9,
      reviews: 340,
      intentSignal: 'Opened second clinic location, upgrading client intake workflows',
      estimatedRevenue: '$1.8M - $3.2M',
      selected: true
    },
    {
      name: 'Capital City Logistics & Warehousing',
      category: 'Supply Chain / Freight',
      phone: '+1 (512) 774-2100',
      website: 'https://capitalcitylogistics.example.com',
      email: 'dispatch@capitalcitylogistics.example.com',
      address: '8800 Burleson Rd, Austin, TX 78744',
      rating: 4.6,
      reviews: 78,
      intentSignal: 'Searching for automated customer routing and CRM spreadsheet sync',
      estimatedRevenue: '$4M - $8M',
      selected: true
    },
    {
      name: 'Silicon Hills Web & Marketing Labs',
      category: 'Digital Agency / Tech',
      phone: '+1 (512) 450-1288',
      website: 'https://siliconhillsmarketing.example.com',
      email: 'growth@siliconhillsmarketing.example.com',
      address: '500 W 2nd St #1900, Austin, TX 78701',
      rating: 4.7,
      reviews: 92,
      intentSignal: 'High outbound hiring for sales reps, looking to automate lead enrichment',
      estimatedRevenue: '$1.2M - $2.8M',
      selected: true
    }
  ]);

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const handleRunScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScraping(true);
    setMarketSummary(null);
    try {
      const res = await fetch('/api/ai/scrape-maps-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          location,
          targetIndustry: industry,
          count: 6
        })
      });
      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        const enriched = data.leads.map((l: any) => ({ ...l, selected: true }));
        setScrapedResults(enriched);
        if (data.marketSummary) setMarketSummary(data.marketSummary);
      }
    } catch (err) {
      console.error('Maps scraping error:', err);
    } finally {
      setIsScraping(false);
    }
  };

  const toggleSelectBusiness = (index: number) => {
    setScrapedResults(prev => 
      prev.map((item, idx) => idx === index ? { ...item, selected: !item.selected } : item)
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setScrapedResults(prev => prev.map(item => ({ ...item, selected: select })));
  };

  const selectedCount = scrapedResults.filter(r => r.selected).length;

  const handleImportSelected = () => {
    const toImport = scrapedResults.filter(r => r.selected);
    if (!toImport.length) return;

    onImportMapsLeads(toImport, selectedProductId);
    setImportNotification(`Successfully imported ${toImport.length} verified businesses into Lead Hub and triggered auto-sync to Google Drive Sheets!`);
    setTimeout(() => setImportNotification(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-amber-500" />
            Google Maps B2B Lead Generator & Scraper
          </h1>
          <p className="text-xs text-slate-500">
            Discover verified local commercial businesses with website, contact email, phone, ratings, and instant 1-click Google Drive sync
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {importNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{importNotification}</span>
        </div>
      )}

      {/* Scraper Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Google Maps Scraping & Parsing Engine</h3>
        </div>

        <form onSubmit={handleRunScraper} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword / Niche *</label>
            <input
              type="text"
              required
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Dental clinics, HVAC, Marketing"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Location / City *</label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Austin, TX or London"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Industry Vertical</label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Home Services & Construction">Home Services & Construction</option>
              <option value="Healthcare & Medical Clinics">Healthcare & Medical Clinics</option>
              <option value="Legal & Financial Services">Legal & Financial Services</option>
              <option value="Software & Digital Agencies">Software & Digital Agencies</option>
              <option value="Logistics & Warehousing">Logistics & Warehousing</option>
              <option value="Real Estate & Property">Real Estate & Property</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              id="run-maps-scraper-btn"
              type="submit"
              disabled={isScraping}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'Scraping Google Maps...' : 'Run Live Maps Parser'}</span>
            </button>
          </div>
        </form>

        {marketSummary && (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{marketSummary}</span>
          </div>
        )}
      </div>

      {/* Scraped Results & Import Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Scraped Verified Businesses ({scrapedResults.length})
            </h3>
            <p className="text-xs text-slate-500">
              Select businesses to import into your lead pipeline & map to a product tier
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Auto-Map to Product:</span>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-300 font-medium bg-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </select>
            </div>

            <button
              id="import-maps-leads-btn"
              onClick={handleImportSelected}
              disabled={selectedCount === 0 || isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import {selectedCount} to Leads & Drive</span>
            </button>
          </div>
        </div>

        {/* Bulk select toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSelectAll(true)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={() => toggleSelectAll(false)}
              className="text-slate-600 font-semibold hover:underline"
            >
              Deselect All
            </button>
          </div>
          <span>{selectedCount} of {scrapedResults.length} selected</span>
        </div>

        {/* Results Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scrapedResults.map((biz, idx) => (
            <div
              key={idx}
              onClick={() => toggleSelectBusiness(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                biz.selected
                  ? 'border-blue-500 bg-blue-50/30 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={biz.selected}
                      onChange={() => toggleSelectBusiness(idx)}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{biz.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {biz.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{biz.rating}</span>
                          <span className="text-slate-400 text-[10px]">({biz.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {biz.estimatedRevenue}
                  </span>
                </div>

                {/* Contact metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{biz.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{biz.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate select-all text-blue-600 font-medium">{biz.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={biz.website} target="_blank" rel="noreferrer" className="truncate text-slate-600 hover:underline">
                      {biz.website.replace('https://', '')}
                    </a>
                  </div>
                </div>

                {/* Intent Signal */}
                <div className="text-xs text-indigo-950 bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900">⚡ Observed Intent Signal: </span>
                  <span>{biz.intentSignal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
