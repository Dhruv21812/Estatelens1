import { NextResponse } from 'next/server';
import { analyzeWebsite, type AnalysisResult } from '@/lib/openai';

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

async function scrapeContent(url: string) {
  try {
    // Ensure URL has protocol
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Add a timeout to the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/i);
    
    const cleanText = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '')
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000);

    return `
      Title: ${titleMatch ? titleMatch[1] : 'Unknown'}
      Description: ${metaDescMatch ? metaDescMatch[1] : 'No description'}
      Text content: ${cleanText}
    `;
  } catch (fetchError) {
    console.error(`Scraping error for ${url}:`, fetchError);
    return `Could not fetch content from ${url}. Proceeding with analysis based on common patterns for this URL.`;
  }
}

export async function POST(request: Request) {
  try {
    const { url, competitorUrl } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Demo mode
    if (url === 'demo' || !process.env.OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return NextResponse.json(MOCK_DATA);
    }

    const content = await scrapeContent(url);
    let competitorContent = '';
    
    if (competitorUrl) {
      competitorContent = await scrapeContent(competitorUrl);
    }

    const analysis = await analyzeWebsite(url, content, competitorUrl, competitorContent);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze brand' },
      { status: 500 }
    );
  }
}
