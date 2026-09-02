import React, { useState } from 'react';
import { 
  Target, 
  Search, 
  Sparkles, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  Layers,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { CompetitorIntel, Product } from '../types';

interface CompetitorScraperViewProps {
  competitorIntelList: CompetitorIntel[];
  myProducts: Product[];
  onAddCompetitorIntel: (intel: CompetitorIntel) => void;
}

export const CompetitorScraperView: React.FC<CompetitorScraperViewProps> = ({
  competitorIntelList,
  myProducts,
  onAddCompetitorIntel
}) => {
  const [competitorInput, setCompetitorInput] = useState('ActiveCampaign CRM & Marketing');
  const [isScraping, setIsScraping] = useState(false);
  const [selectedIntel, setSelectedIntel] = useState<CompetitorIntel | null>(competitorIntelList[0] || null);

  const handleRunCompetitorScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorInput.trim()) return;

    setIsScraping(true);
    try {
      const res = await fetch('/api/ai/scrape-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorUrlOrName: competitorInput,
          myProducts
        })
      });
      const data = await res.json();
      const newIntel: CompetitorIntel = {
        id: `comp-${Date.now()}`,
        competitorName: data.competitorName || competitorInput,
        urlOrDomain: competitorInput.includes('.') ? competitorInput : `${competitorInput.toLowerCase().replace(/\s+/g, '')}.com/pricing`,
        overview: data.overview || 'Market competitor analyzed via pricing parser.',
        pricingTiers: data.pricingTiers || [],
        weaknesses: data.weaknesses || [],
        counterPositioningHooks: data.counterPositioningHooks || [],
        analyzedAt: new Date().toISOString()
      };

      onAddCompetitorIntel(newIntel);
      setSelectedIntel(newIntel);
    } catch (err) {
      console.error('Error scraping competitor:', err);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Target className="w-6 h-6 text-indigo-600" />
            Competitor Pricing Scraping & Battlecards
          </h1>
          <p className="text-xs text-slate-500">
            Parse competitor pricing tiers, hidden fees, and generate lethal counter-pitch talking points
          </p>
        </div>
      </div>

      {/* Scraper Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <form onSubmit={handleRunCompetitorScraper} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="competitor-input"
              type="text"
              required
              value={competitorInput}
              onChange={e => setCompetitorInput(e.target.value)}
              placeholder="Enter competitor domain or name (e.g., hubspot.com/pricing, Apollo.io, Keap, Salesforce)"
              className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <button
            id="scrape-competitor-btn"
            type="submit"
            disabled={isScraping}
            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Parsing Competitor...' : 'Scrape Pricing Model'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Analyze:</span>
          {['HubSpot Sales Hub', 'Apollo.io', 'Clay.com', 'ZoomInfo', 'ActiveCampaign'].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCompetitorInput(c);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Saved Competitors (Left) + Detailed Battlecard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tracked Competitors</h3>
          <div className="space-y-2">
            {competitorIntelList.map(item => {
              const isSelected = selectedIntel?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIntel(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900">{item.competitorName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.analyzedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.overview}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-indigo-700">
                    <span>{item.pricingTiers?.length || 0} Pricing Tiers</span>
                    <span>•</span>
                    <span>{item.counterPositioningHooks?.length || 0} Sales Hooks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Competitor Battlecard */}
        <div className="lg:col-span-2 space-y-4">
          {selectedIntel ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      Pricing Intelligence
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Domain: {selectedIntel.urlOrDomain}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedIntel.competitorName}</h2>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedIntel.overview}</p>
                </div>
              </div>

              {/* Pricing Tiers Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Scraped Pricing Tiers & Limitations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedIntel.pricingTiers?.map((tier, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{tier.name}</div>
                        <div className="text-lg font-extrabold text-slate-900 mt-1">{tier.price}</div>
                        <div className="text-[10px] text-slate-500">{tier.billing}</div>
                        
                        <div className="mt-2 space-y-1">
                          {tier.keyFeatures?.map((f, fIdx) => (
                            <div key={fIdx} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-indigo-600">•</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                        Target: <strong className="text-slate-700">{tier.targetCustomer}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses & Customer Pain Points */}
              <div className="bg-rose-50/70 p-5 rounded-xl border border-rose-200 space-y-2">
                <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Identified Competitor Weaknesses & Pricing Gaps
                </h3>
                <ul className="text-xs text-rose-950 space-y-1.5 list-disc list-inside">
                  {selectedIntel.weaknesses?.map((w, idx) => (
                    <li key={idx} className="leading-relaxed">{w}</li>
                  ))}
                </ul>
              </div>

              {/* Counter-Positioning Sales Pitch Hooks */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-200 space-y-3">
                <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Winning Sales Angles & Counter-Offer Hooks
                </h3>
                <div className="space-y-2">
                  {selectedIntel.counterPositioningHooks?.map((hook, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-100 text-xs text-indigo-950 font-medium flex items-start gap-2 shadow-2xs">
                      <span className="font-bold text-indigo-600">#{idx + 1}</span>
                      <span>{hook}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-600">Select a competitor to view battlecard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
