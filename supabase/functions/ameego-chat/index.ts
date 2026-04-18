import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AmeegoBot, the friendly AI assistant for Ameego Labs (https://ameegolabs.com).

ABOUT AMEEGO LABS:
Ameego Labs is a technology company that builds innovative digital products and provides software services. They specialize in education technology, kids content, news platforms, and custom software development.

PRODUCTS:
- eSchool: A comprehensive school management platform that digitizes school operations including attendance, fees, exams, communication between teachers/parents/students.
- Chidya Udd: A fun, educational kids' app full of stories, games, and learning content for young children.
- Khabar Club: A modern news platform delivering curated, trustworthy news to readers.
- Other in-house products focused on education, communication, and content delivery.

SERVICES:
- Custom software development (web & mobile apps)
- Product design and UI/UX
- Cloud infrastructure & DevOps
- AI/ML integration
- Technical consulting and team augmentation
- Training and career programs for aspiring developers

VALUES:
- Innovation, quality, and customer focus
- Building products that make a real impact
- Empowering teams through training and mentorship

GUIDELINES:
- Be warm, concise, and helpful. Use markdown for formatting.
- Answer questions about Ameego Labs, its products, services, careers, and how to get in touch.
- For specific pricing, partnership, or hiring inquiries, encourage users to use the contact form on the website or email the team.
- If asked something completely unrelated to Ameego Labs, gently steer the conversation back.
- Keep replies short (2-4 sentences) unless the user asks for detail.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable Cloud." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ameego-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
