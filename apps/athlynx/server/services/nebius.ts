/**
 * Nebius Token Factory AI Service
 * 
 * OpenAI-compatible API integration for ATHLYNX AI features
 * Powered by Nebius Token Factory - https://tokenfactory.nebius.com
 * 
 * @author ATHLYNX AI Corporation
 * @date January 7, 2026
 */

import OpenAI from 'openai';

// Nebius Token Factory configuration
const NEBIUS_BASE_URL = 'https://api.tokenfactory.nebius.com/v1/';
const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || '';

// Available models
export const NEBIUS_MODELS = {
  LLAMA_70B: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
  LLAMA_8B: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
} as const;

// Initialize Nebius client (OpenAI-compatible)
const nebiusClient = new OpenAI({
  baseURL: NEBIUS_BASE_URL,
  apiKey: NEBIUS_API_KEY,
});

/**
 * Chat completion with Nebius AI
 */
export async function nebiusChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const { model = NEBIUS_MODELS.LLAMA_70B, temperature = 0.7, maxTokens = 2048 } = options || {};

  try {
    const completion = await nebiusClient.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return {
      success: true,
      content: completion.choices[0]?.message?.content || '',
      usage: completion.usage,
      model: completion.model,
    };
  } catch (error) {
    console.error('[Nebius AI Error]', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * AI Wizard - Athlete Agent Advisor
 */
export async function athleteAgentAdvice(question: string, athleteContext?: string) {
  const systemPrompt = `You are an expert sports agent advisor for ATHLYNX, the premier athlete success platform. 
You help athletes navigate NIL deals, contracts, endorsements, and career decisions.
Be professional, knowledgeable, and always prioritize the athlete's best interests.
${athleteContext ? `Athlete Context: ${athleteContext}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]);
}

/**
 * AI Wizard - Legal Advisor
 */
export async function legalAdvice(question: string, context?: string) {
  const systemPrompt = `You are a legal advisor specializing in sports law, NIL regulations, and athlete contracts for ATHLYNX.
Provide general legal guidance and information. Always recommend consulting with a licensed attorney for specific legal matters.
${context ? `Context: ${context}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]);
}

/**
 * AI Wizard - Financial Advisor
 */
export async function financialAdvice(question: string, context?: string) {
  const systemPrompt = `You are a financial advisor for athletes on ATHLYNX, specializing in NIL income management, taxes, investments, and wealth building.
Help athletes make smart financial decisions. Always recommend consulting with a licensed financial advisor for specific investment advice.
${context ? `Context: ${context}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]);
}

/**
 * AI Wizard - Recruiting Scout
 */
export async function recruitingScout(athleteProfile: string, targetSchools?: string) {
  const systemPrompt = `You are an expert recruiting scout for ATHLYNX, helping athletes find the best college programs.
Analyze athlete profiles and provide recruiting advice, school recommendations, and strategy.
${targetSchools ? `Target Schools: ${targetSchools}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analyze this athlete profile and provide recruiting recommendations:\n\n${athleteProfile}` },
  ]);
}

/**
 * AI Wizard - Transfer Portal Advisor
 */
export async function transferPortalAdvice(situation: string, preferences?: string) {
  const systemPrompt = `You are a transfer portal expert for ATHLYNX, helping athletes navigate the transfer process.
Provide guidance on timing, eligibility, school selection, and maximizing opportunities.
${preferences ? `Athlete Preferences: ${preferences}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: situation },
  ]);
}

/**
 * AI Wizard - Life Coach
 */
export async function lifeCoach(question: string, context?: string) {
  const systemPrompt = `You are a life coach for athletes on ATHLYNX, helping with personal development, mental wellness, and life balance.
Provide supportive, encouraging guidance while respecting boundaries.
${context ? `Context: ${context}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]);
}

/**
 * AI Wizard - Career Advisor
 */
export async function careerAdvice(question: string, background?: string) {
  const systemPrompt = `You are a career advisor for athletes on ATHLYNX, helping with post-athletic career planning, professional development, and opportunities.
Help athletes leverage their skills and experience for success beyond sports.
${background ? `Athlete Background: ${background}` : ''}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]);
}

/**
 * NIL Valuation Calculator AI
 */
export async function calculateNILValuation(athleteData: {
  sport: string;
  position: string;
  school: string;
  followers: number;
  engagement: number;
  achievements: string[];
  marketSize: string;
}) {
  const systemPrompt = `You are an NIL valuation expert for ATHLYNX. Calculate athlete NIL values based on:
- Social media following and engagement
- Sport and position value
- School market size and brand
- Achievements and accolades
- Market demand

Provide a detailed valuation breakdown with a final estimated NIL value range.`;

  const athleteProfile = `
Sport: ${athleteData.sport}
Position: ${athleteData.position}
School: ${athleteData.school}
Social Media Followers: ${athleteData.followers.toLocaleString()}
Engagement Rate: ${athleteData.engagement}%
Achievements: ${athleteData.achievements.join(', ')}
Market Size: ${athleteData.marketSize}
`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Calculate the NIL valuation for this athlete:\n${athleteProfile}` },
  ]);
}

/**
 * Content Generation - Social Media Posts
 */
export async function generateSocialContent(
  topic: string,
  platform: 'twitter' | 'instagram' | 'tiktok' | 'linkedin',
  tone?: string
) {
  const platformGuidelines: Record<string, string> = {
    twitter: 'Keep it under 280 characters. Use hashtags sparingly. Be engaging and conversational.',
    instagram: 'Write a compelling caption. Include relevant hashtags. Encourage engagement.',
    tiktok: 'Write a hook that grabs attention. Keep it trendy and relatable. Include trending hashtags.',
    linkedin: 'Be professional but personable. Share insights and value. Encourage professional discussion.',
  };

  const systemPrompt = `You are a social media content creator for athletes on ATHLYNX.
Platform: ${platform}
Guidelines: ${platformGuidelines[platform]}
${tone ? `Tone: ${tone}` : 'Tone: Professional yet approachable'}`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Create a ${platform} post about: ${topic}` },
  ]);
}

/**
 * Brand Deal Analysis
 */
export async function analyzeBrandDeal(dealDetails: string) {
  const systemPrompt = `You are a brand deal analyst for ATHLYNX. Analyze NIL deals and provide:
- Fair market value assessment
- Red flags to watch for
- Negotiation recommendations
- Contract term analysis
- Overall deal rating (1-10)`;

  return nebiusChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analyze this brand deal:\n\n${dealDetails}` },
  ]);
}

/**
 * Check if Nebius API is configured
 */
export function isNebiusConfigured(): boolean {
  return !!NEBIUS_API_KEY && NEBIUS_API_KEY.length > 0;
}

/**
 * Test Nebius connection
 */
export async function testNebiusConnection() {
  if (!isNebiusConfigured()) {
    return { success: false, error: 'NEBIUS_API_KEY not configured' };
  }

  try {
    const result = await nebiusChat([
      { role: 'user', content: 'Say "ATHLYNX AI is connected!" in exactly those words.' },
    ], { maxTokens: 50 });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed',
    };
  }
}

export default {
  nebiusChat,
  athleteAgentAdvice,
  legalAdvice,
  financialAdvice,
  recruitingScout,
  transferPortalAdvice,
  lifeCoach,
  careerAdvice,
  calculateNILValuation,
  generateSocialContent,
  analyzeBrandDeal,
  isNebiusConfigured,
  testNebiusConnection,
  NEBIUS_MODELS,
};
