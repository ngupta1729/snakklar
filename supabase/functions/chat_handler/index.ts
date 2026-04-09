import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationTurn {
  role: 'user' | 'model';
  content: string;
}

interface RequestBody {
  userMessage: string;
  scenario: string;
  characterName: string;
  conversationHistory: ConversationTurn[];
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 512,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { userMessage, scenario, characterName, conversationHistory } = body;

    if (!userMessage || !scenario) {
      return new Response(JSON.stringify({ error: 'Missing userMessage or scenario' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const historyText = conversationHistory
      .map((t) => `${t.role === 'user' ? 'Student' : characterName}: ${t.content}`)
      .join('\n');

    const feedbackSystem = `You are a strict Norwegian (Bokmål) language teacher. The student is practicing in this scenario: "${scenario}".
Analyze the student's Norwegian input and respond ONLY with valid JSON (no markdown, no code blocks):
{"correction":"<corrected version, or original if perfect>","better_alternative":"<more natural/idiomatic phrasing>","native_version":"<how a native Norwegian would say it>","explanation":"<brief English explanation of issues, or 'Perfect! Natural Norwegian.' if correct>"}`;

    const conversationSystem = `You are roleplaying as ${characterName} in this scenario: "${scenario}".
Speak ONLY in Norwegian (Bokmål). Keep your reply short (1-3 sentences). Always end with a natural follow-up question.${historyText ? `\n\nConversation so far:\n${historyText}` : ''}`;

    // Fire both calls in parallel
    const [feedbackRaw, conversationReply] = await Promise.all([
      callOpenAI(feedbackSystem, `Student input: "${userMessage}"`),
      callOpenAI(conversationSystem, `Student just said: "${userMessage}"\n\nReply as ${characterName}:`),
    ]);

    // Strip any accidental markdown fences
    const cleaned = feedbackRaw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const feedback = JSON.parse(cleaned);

    return new Response(
      JSON.stringify({ feedback, conversation_reply: conversationReply.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('chat_handler error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
