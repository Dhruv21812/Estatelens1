import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: apiKey || '',
});

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

export async function analyzeWebsite(url: string, content: string, competitorUrl?: string, competitorContent?: string): Promise<AnalysisResult> {
  const systemPrompt = competitorUrl 
    ? `You are an elite real estate branding consultant specializing in competitor takeovers. 
Analyze these two real estate developer/project websites. 
Provide a brutally honest comparison. 
Return JSON in this exact structure: 
{ 
  "brand_first_impression": "Comparison of the two brands' initial impact", 
  "trust_score": "Score out of 10 for the primary site", 
  "conversion_score": "Score out of 10 for the primary site", 
  "what_feels_premium": ["Strengths of the primary site compared to competitor"], 
  "what_hurts_trust": ["Weaknesses where the competitor is winning"], 
  "missing_elements": ["What the competitor has that the primary site lacks"], 
  "reel_ideas": [""], 
  "ad_hooks": [""], 
  "cta_improvements": [""], 
  "brutal_truth": "The ultimate verdict on who wins the market share",
  "competitor_comparison": {
    "winner": "Name of the winning brand",
    "gap_analysis": "Specific technical/design gap between the two",
    "actionable_takeover_plan": "3 steps to beat the competitor"
  }
}`
    : `You are an elite real estate branding consultant. 
Analyze this developer/project website content. 
Give a brutally honest but useful breakdown. 
Return JSON in this exact structure: 
{ 
  "brand_first_impression": "", 
  "trust_score": "", 
  "conversion_score": "", 
  "what_feels_premium": [""], 
  "what_hurts_trust": [""], 
  "missing_elements": [""], 
  "reel_ideas": [""], 
  "ad_hooks": [""], 
  "cta_improvements": [""], 
  "brutal_truth": "" 
} 
The tone should sound like: 
smart, experienced, practical, direct, startup consultant energy. 
Avoid generic advice. Be highly specific.`;

  const userContent = competitorUrl 
    ? `Primary Website URL: ${url}\nPrimary Content: ${content}\n\nCompetitor Website URL: ${competitorUrl}\nCompetitor Content: ${competitorContent}`
    : `Website URL: ${url}\n\nWebsite Content:\n${content}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userContent
      }
    ],
    response_format: { type: 'json_object' }
  });

  const result = response.choices[0].message.content;
  if (!result) throw new Error('Failed to get analysis from OpenAI');
  
  return JSON.parse(result) as AnalysisResult;
}
