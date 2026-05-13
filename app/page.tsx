'use client';

import React, { useState, useEffect } from 'react';
import { ResultCard } from '@/components/ResultCard';
import { Search, Loader2, Sparkles, AlertCircle, CheckCircle2, Copy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interface moved here for zero-dependency simplicity
export interface AnalysisResult {
  brand_first_impression: string;
  trust_score: string;
  conversion_score: string;
  what_feels_premium: string[];
  what_hurts_trust: string[];
  missing_elements: string[];
  reel_ideas: string[];
  ad_hooks: string[];
  cta_improvements: string[];
  brutal_truth: string;
  competitor_comparison?: {
    winner: string;
    gap_analysis: string;
    actionable_takeover_plan: string;
  };
}

const LOADING_STEPS = [
  "Reading your brand psychology...",
  "Analyzing trust signals...",
  "Judging your conversion funnel...",
  "Comparing with competitors...",
  "Generating growth strategies..."
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAnalyze = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || url;
    if (!targetUrl) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to connect.');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setUrl('https://luxury-estate-demo.com');
    handleAnalyze(undefined, 'demo');
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-zinc-900/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
            <Sparkles className="w-3 h-3" />
            <span>AI Real Estate Auditor — Demo Mode</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            Audit Your Brand <br /> In Seconds.
          </h1>

          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <button onClick={() => setIsComparisonMode(false)} className={`px-4 py-2 rounded-lg text-sm ${!isComparisonMode ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Single Audit</button>
              <button onClick={() => setIsComparisonMode(true)} className={`px-4 py-2 rounded-lg text-sm ${isComparisonMode ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Comparison</button>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto mt-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                required
                placeholder={isComparisonMode ? "Your website" : "https://luxury-homes.com"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
              {isComparisonMode && (
                <input
                  type="url"
                  required
                  placeholder="Competitor website"
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                  className="flex-grow bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                />
              )}
              <button type="submit" disabled={isLoading} className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 whitespace-nowrap">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isComparisonMode ? 'Compare' : 'Analyze')}
              </button>
            </div>
          </form>

          <button onClick={handleDemo} className="mt-6 text-zinc-500 hover:text-white text-sm underline underline-offset-4">
            Try with demo data
          </button>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
              <p className="text-zinc-400">{LOADING_STEPS[loadingStep]}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="First Impression" description={result.brand_first_impression} className="md:col-span-2" />
              <div className="grid grid-rows-2 gap-6">
                <ResultCard title="Trust Score" value={result.trust_score} variant="success" />
                <ResultCard title="Conversion" value={result.conversion_score} variant="highlight" />
              </div>
            </div>

            {result.competitor_comparison && (
              <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl">
                <h3 className="text-zinc-500 text-xs font-bold uppercase mb-4">Comparison Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-zinc-500 text-xs mb-1 uppercase">Winner</p>
                    <p className="text-2xl font-bold text-white">{result.competitor_comparison.winner}</p>
                    <p className="mt-4 text-zinc-400">{result.competitor_comparison.gap_analysis}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-white text-sm font-bold uppercase mb-2">Takeover Plan</p>
                    <p className="text-zinc-300 text-sm whitespace-pre-line">{result.competitor_comparison.actionable_takeover_plan}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard title="What Feels Premium" items={result.what_feels_premium} variant="success" />
              <ResultCard title="What Hurts Trust" items={result.what_hurts_trust} variant="warning" />
            </div>

            <div className="p-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black">
              <h3 className="text-zinc-500 text-xs font-bold uppercase mb-4 tracking-widest text-red-500">Brutal Truth</h3>
              <p className="text-2xl font-bold text-white leading-tight">{result.brutal_truth}</p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
