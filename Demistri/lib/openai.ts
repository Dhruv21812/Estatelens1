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

// Simplified for Vercel deployment without API keys
export async function analyzeWebsite(url: string, content: string, competitorUrl?: string, competitorContent?: string): Promise<AnalysisResult> {
  // This is now a stub as the logic has moved to a mock-first approach in the API route
  throw new Error("Local analysis disabled for deployment simplicity. Use the mock API route.");
}
