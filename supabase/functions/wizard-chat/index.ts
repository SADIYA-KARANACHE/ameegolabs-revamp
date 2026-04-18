import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AmeegoBot, a senior solutions consultant at Ameego Labs running a discovery questionnaire for a prospective client.

Your job: ask ONE concise question at a time to gather requirements for the service the user selected. After 5-7 well-chosen questions covering the most important aspects, mark discovery as complete.

ABOUT AMEEGO LABS SERVICES:
- Custom Software Development (web & mobile apps)
- Product Design / UI-UX
- Cloud Infrastructure & DevOps
- AI / ML Integration
- Technical Consulting & Team Augmentation
- Training & Career Programs
- eSchool (school management platform)
- Chidya Udd (kids edu app)
- Khabar Club (news platform)

QUESTIONING STRATEGY (adapt to chosen service):
1. Project type / scope / vision
2. Target audience & scale
3. Key features / must-haves
4. Platform(s) — web, iOS, Android, etc.
5. Timeline / urgency
6. Budget range (rough)
7. Existing systems / integrations (if relevant)

RULES:
- Always return STRUCTURED JSON via the provided tool. Never reply in free text.
- Each question must come with 3-5 short, mutually exclusive answer options the user can click.
- Always include an option phrased like "Other / Custom" so users can type their own answer.
- Keep questions short (max 15 words), friendly, professional.
- Track what you've asked. Don't repeat. Don't ask more than 7 questions total.
- When you have enough info (or hit 7 questions), set "done": true and write a 1-2 sentence "summary" recapping the gathered requirements.
- When done, the question/options can be empty.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { service, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `The client is interested in: **${service}**.\n\nConversation so far (Q&A pairs):\n${
          history && history.length > 0
            ? history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nA: ${h.answer}`).join("\n\n")
            : "(none yet — ask your first question)"
        }\n\nReturn the next question via the tool, OR mark done if discovery is complete.`,
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "next_step",
              description: "Return the next discovery question or mark discovery complete.",
              parameters: {
                type: "object",
                properties: {
                  done: { type: "boolean", description: "True when enough requirements have been gathered." },
                  question: { type: "string", description: "Next question to ask (empty if done)." },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 short answer options including an 'Other / Custom' option.",
                  },
                  summary: {
                    type: "string",
                    description: "1-2 sentence recap of gathered requirements (only when done=true).",
                  },
                },
                required: ["done", "question", "options"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "next_step" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("wizard-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
