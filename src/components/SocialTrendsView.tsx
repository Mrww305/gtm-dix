import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Sparkles, 
  Flame, 
  MessageSquare, 
  ArrowUpRight, 
  Zap, 
  Share2, 
  Send,
  Plus
} from 'lucide-react';
import { SocialTrend } from '../types';

interface SocialTrendsViewProps {
  trends: SocialTrend[];
  onAddTrend: (trend: SocialTrend) => void;
  onUseTrendInCampaign: (trend: SocialTrend) => void;
}

export const SocialTrendsView: React.FC<SocialTrendsViewProps> = ({
  trends,
  onAddTrend,
  onUseTrendInCampaign
}) => {
  const [industryInput, setIndustryInput] = useState('B2B Lead Generation & Sales Automation');
  const [keywordInput, setKeywordInput] = useState('cold email, google sheets CRM, lead scraper, high intent');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [campaignAngles, setCampaignAngles] = useState<string[]>([
    'Position your product as the ultimate zero-bloat Google Drive CRM for founders tired of $500/mo legacy software.',
    'Run localized Google Maps campaigns targeting local contractors offering instant automated quote follow-ups.'
  ]);

  const handleRunSocialParser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/social-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: industryInput,
          keywords: keywordInput
        })
      });
      const data = await res.json();
      if (data.trendingTopics && Array.isArray(data.trendingTopics)) {
        data.trendingTopics.forEach((t: any) => {
          onAddTrend({
            id: `trend-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            topic: t.topic,
            platform: t.platform || 'LinkedIn / X',
            momentum: t.momentum || '+120%',
            sentiment: t.sentiment || 'Positive',
            buyingIntent: t.buyingIntent || 'High',
            leadHook: t.leadHook || 'Instant automation pitch hook',
            analyzedAt: new Date().toISOString()
          });
        });
      }
      if (data.recommendedCampaignAngles) {
        setCampaignAngles(data.recommendedCampaignAngles);
      }
    } catch (err) {
      console.error('Error analyzing social trends:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Social Media Trends & Buying Signals
          </h1>
          <p className="text-xs text-slate-500">
            Real-time social sentiment scraping from Reddit, LinkedIn, and X to extract high-converting lead hooks
          </p>
        </div>
      </div>

      {/* Parser Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <form onSubmit={handleRunSocialParser} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Niche / Industry *</label>
            <input
              type="text"
              required
              value={industryInput}
              onChange={e => setIndustryInput(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Trigger Keywords & Pain Points</label>
            <input
              type="text"
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-end">
            <button
              id="run-social-trends-btn"
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Scraping Social Signals...' : 'Parse Live Social Trends'}</span>
            </button>
          </div>
        </form>

        {/* Recommended Campaign Angles */}
        {campaignAngles.length > 0 && (
          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-600" />
              Strategic Angle Recommendations
            </span>
            <div className="space-y-1.5">
              {campaignAngles.map((angle, idx) => (
                <div key={idx} className="text-xs text-purple-950 flex items-start gap-2">
                  <span className="font-bold text-purple-600">→</span>
                  <span>{angle}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trends Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Parsed Social Buying Trends & Sales Hooks</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md border border-purple-200">
                    {trend.platform}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend.momentum}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                  {trend.topic}
                </h4>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Sentiment:</span>
                  <span className="font-semibold text-slate-800">{trend.sentiment}</span>
                  <span>•</span>
                  <span className="text-purple-700 font-bold">Intent: {trend.buyingIntent}</span>
                </div>

                {/* Lead Hook Quote Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">High-Converting Pitch Hook:</div>
                  <p className="italic font-medium leading-relaxed">"{trend.leadHook}"</p>
                </div>
              </div>

              <button
                onClick={() => onUseTrendInCampaign(trend)}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Use Hook in Follow-Up Email</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
