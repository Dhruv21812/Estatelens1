'use client';

import React, { useState, useEffect } from 'react';
import { ResultCard } from '@/components/ResultCard';
import { AnalysisResult } from '@/lib/openai';
import { Search, Loader2, Sparkles, AlertCircle, CheckCircle2, Copy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Reading your brand psychology...",
  "Analyzing trust signals...",
  "Judging your conversion funnel...",
  "Auditing visual hierarchy...",
  "Comparing with competitors...",
  "Calculating premium index...",
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
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAnalyze = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    
    const targetUrl = customUrl || url;
    if (!targetUrl) return;

    // Basic client-side validation
    if (targetUrl !== 'demo' && !targetUrl.includes('.')) {
      setError('Please enter a valid website URL or Instagram link.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: targetUrl,
          competitorUrl: isComparisonMode ? competitorUrl : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Check your internet connection or API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setUrl('https://luxury-estate-demo.com');
    if (isComparisonMode) setCompetitorUrl('https://competitor-demo.com');
    handleAnalyze(null as any, 'demo');
  };

  const copyToClipboard = (text: string, label: string = 'Copied!') => {
    navigator.clipboard.writeText(text);
    alert(label);
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-zinc-900/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-zinc-900/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-4"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Real Estate Audit</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
          >
            Your Real Estate Brand <br /> Has Blind Spots.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Paste your website or Instagram page and get an instant <br className="hidden md:block" />
            growth + trust audit from an AI luxury branding consultant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center mt-8"
          >
            <div className="inline-flex p-1 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <button
                onClick={() => setIsComparisonMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isComparisonMode ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Single Audit
              </button>
              <button
                onClick={() => setIsComparisonMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isComparisonMode ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Competitor Comparison
              </button>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleAnalyze}
            className="max-w-3xl mx-auto mt-8 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="url"
                  required
                  placeholder={isComparisonMode ? "Your website URL" : "https://luxury-homes.com"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                />
              </div>
              
              {isComparisonMode && (
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="Competitor website URL"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>{isComparisonMode ? 'Compare Brands' : 'Analyze Brand'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-4"
          >
            <span className="text-zinc-600 text-sm">No website yet?</span>
            <button
              onClick={handleDemo}
              className="text-zinc-400 hover:text-white text-sm font-medium underline underline-offset-4 decoration-zinc-800 hover:decoration-white transition-all"
            >
              Try with demo data
            </button>
          </motion.div>

          {/* Feature Cards Preview */}
          {!result && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
            >
              {[
                { title: 'Trust Analysis', desc: 'Identify signals that build or break developer credibility.' },
                { title: 'Conversion Audit', desc: 'Pinpoint exactly where you are losing potential homebuyers.' },
                { title: 'Marketing Edge', desc: 'Get viral-ready reel ideas and high-converting ad hooks.' }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 text-left">
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-2 border-zinc-800 rounded-full" />
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-white rounded-full animate-spin" />
              </div>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-medium text-zinc-300"
              >
                {LOADING_STEPS[loadingStep]}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-900/10 border border-red-900/20 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Action Bar */}
            <div className="flex justify-end gap-3 no-print">
              <button
                onClick={() => copyToClipboard(window.location.href, 'Link copied to clipboard!')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white transition-all text-sm"
              >
                <Copy className="w-4 h-4" />
                Share Report
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white transition-all text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard
                title="First Impression"
                description={result.brand_first_impression}
                className="md:col-span-2"
              />
              <div className="grid grid-rows-2 gap-6">
                <ResultCard
                  title="Trust Score"
                  value={result.trust_score}
                  variant="success"
                />
                <ResultCard
                  title="Conversion Score"
                  value={result.conversion_score}
                  variant="highlight"
                />
              </div>
            </div>

            {result.competitor_comparison && (
              <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Comparison Result
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-zinc-500 text-sm font-medium uppercase mb-2">Market Winner</h3>
                      <p className="text-3xl font-bold text-white">{result.competitor_comparison.winner}</p>
                    </div>
                    <div>
                      <h3 className="text-zinc-500 text-sm font-medium uppercase mb-2">The Gap</h3>
                      <p className="text-zinc-300 leading-relaxed">{result.competitor_comparison.gap_analysis}</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-white text-sm font-bold uppercase mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Takeover Plan
                    </h3>
                    <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                      {result.competitor_comparison.actionable_takeover_plan}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard
                title="What Feels Premium"
                items={result.what_feels_premium}
                variant="success"
              />
              <ResultCard
                title="What Hurts Trust"
                items={result.what_hurts_trust}
                variant="warning"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard
                title="Reel Ideas"
                items={result.reel_ideas}
              />
              <ResultCard
                title="Ad Hooks"
                items={result.ad_hooks}
              />
              <ResultCard
                title="CTA Improvements"
                items={result.cta_improvements}
              />
            </div>

            <div className="p-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 rounded-full border border-red-900/30 bg-red-900/10 text-xs font-bold text-red-500 uppercase tracking-widest">
                  Brutal Truth
                </span>
              </div>
              <h3 className="text-zinc-500 text-sm font-medium uppercase mb-4">Growth Strategy</h3>
              <p className="text-2xl md:text-3xl font-bold leading-tight text-white max-w-4xl">
                {result.brutal_truth}
              </p>
              <button 
                onClick={() => copyToClipboard(result.brutal_truth)}
                className="mt-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy Strategy
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="relative z-10 py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-sm">
          EstateLens AI — Built for elite real estate developers.
        </p>
      </footer>
    </main>
  );
}
