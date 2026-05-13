import { NextResponse } from 'next/server';

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

const MOCK_DATA: AnalysisResult = {
  brand_first_impression: "The brand feels like a high-end architectural firm, but the user experience on the site is clunky. It screams 'luxury' but whispers 'difficult to work with'.",
  trust_score: "8.5",
  conversion_score: "4.2",
  what_feels_premium: [
    "High-resolution drone cinematography",
    "Sophisticated serif typography",
    "Minimalist whitespace usage"
  ],
  what_hurts_trust: [
    "Hidden contact information",
    "No visible team or founder story",
    "Lack of real-time project updates"
  ],
  missing_elements: [
    "Clear 'Schedule a Visit' CTA",
    "Investor-specific portal",
    "Social proof/Testimonial section"
  ],
  reel_ideas: [
    "Day in the life of a site manager",
    "Why we chose this specific marble (Detail focus)",
    "Golden hour at the penthouse"
  ],
  ad_hooks: [
    "The house you didn't know you needed.",
    "Why 5-star living shouldn't be a vacation.",
    "The last plot in South Delhi's quietest corner."
  ],
  cta_improvements: [
    "Change 'Submit' to 'Get Private Brochure'",
    "Add 'Text our Concierge' button",
    "Use 'Claim your view' instead of 'Contact us'"
  ],
  brutal_truth: "You are selling a dream but your website feels like a legal document. Inject personality or prepare to be ignored by the next generation of wealth.",
  competitor_comparison: {
    winner: "Luxury Estates Demo",
    gap_analysis: "The competitor uses lifestyle-first imagery while you focus too much on blueprints.",
    actionable_takeover_plan: "1. Update hero section to lifestyle video. 2. Simplify the contact form. 3. Add a founder video message."
  }
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Always return mock data for simple demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return NextResponse.json(MOCK_DATA);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
