import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Palette,
  Cloud,
  Brain,
  Users,
  GraduationCap,
  Sparkles,
  Loader2,
  FileDown,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CursorFollower } from "@/components/CursorFollower";
import { generateCRDPdf, type QAPair } from "@/lib/generateCRD";

const SERVICES = [
  { name: "Custom Software Development", desc: "Web & mobile apps built to spec", icon: Code2 },
  { name: "Product Design / UI-UX", desc: "Beautiful, usable interfaces", icon: Palette },
  { name: "Cloud Infrastructure & DevOps", desc: "Scalable, reliable, secure", icon: Cloud },
  { name: "AI / ML Integration", desc: "Smart features powered by AI", icon: Brain },
  { name: "Technical Consulting", desc: "Team augmentation & advice", icon: Users },
  { name: "Training & Career Programs", desc: "Upskill your team or yourself", icon: GraduationCap },
];

type Step = "service" | "questions" | "decision" | "email" | "done";

const WIZARD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wizard-chat`;

const Wizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<string>("");
  const [qa, setQa] = useState<QAPair[]>([]);
  const [currentQ, setCurrentQ] = useState<{ question: string; options: string[] } | null>(null);
  const [customAnswer, setCustomAnswer] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchNext = async (chosenService: string, history: QAPair[]) => {
    setLoading(true);
    setShowCustom(false);
    setCustomAnswer("");
    try {
      const resp = await fetch(WIZARD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ service: chosenService, history }),
      });
      if (resp.status === 429) {
        toast({ title: "Slow down", description: "Too many requests, try again shortly.", variant: "destructive" });
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Credits required", description: "AI credits exhausted.", variant: "destructive" });
        return;
      }
      if (!resp.ok) throw new Error("Request failed");
      const data = await resp.json();
      if (data.done) {
        setSummary(data.summary || "");
        setStep("decision");
      } else {
        setCurrentQ({ question: data.question, options: data.options || [] });
        setStep("questions");
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Could not fetch next question.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const pickService = async (s: string) => {
    setService(s);
    setQa([]);
    await fetchNext(s, []);
  };

  const answerQuestion = async (answer: string) => {
    if (!currentQ || !answer.trim()) return;
    const next = [...qa, { question: currentQ.question, answer: answer.trim() }];
    setQa(next);
    await fetchNext(service, next);
  };

  const handleGenerateCRD = () => {
    setStep("email");
  };

  const submitEmail = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    try {
      generateCRDPdf({ service, qa, summary, email: email.trim(), name: name.trim() || undefined });
      toast({ title: "CRD generated", description: "Your document has been downloaded." });
      setStep("done");
    } catch (e) {
      console.error(e);
      toast({ title: "Generation failed", description: "Could not create the PDF.", variant: "destructive" });
    }
  };

  const restart = () => {
    setStep("service");
    setService("");
    setQa([]);
    setCurrentQ(null);
    setSummary("");
    setEmail("");
    setName("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <CursorFollower />

      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Service Wizard
          </div>
        </div>
      </header>

      {/* Progress dots */}
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-2 mb-2">
          {(["service", "questions", "decision", "email", "done"] as Step[]).map((s, i) => {
            const order: Step[] = ["service", "questions", "decision", "email", "done"];
            const currentIdx = order.indexOf(step);
            const active = i <= currentIdx;
            return (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  active ? "bg-primary" : "bg-muted"
                }`}
              />
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Step {["service", "questions", "decision", "email", "done"].indexOf(step) + 1} of 5
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 min-h-[60vh]">
        <AnimatePresence mode="wait">
          {/* SERVICE PICK */}
          {step === "service" && (
            <motion.div
              key="service"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Which service interests you?
              </h1>
              <p className="text-muted-foreground mb-10 text-lg">
                Pick one and we'll ask a few quick questions to understand what you need.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {SERVICES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.name}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pickService(s.name)}
                      className="text-left p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] transition-all group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="font-semibold mb-1">{s.name}</div>
                      <div className="text-sm text-muted-foreground">{s.desc}</div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* QUESTIONS */}
          {step === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                {service}
              </div>
              <div className="text-xs text-muted-foreground mb-6">
                Question {qa.length + 1}
              </div>

              {loading || !currentQ ? (
                <div className="flex items-center gap-3 text-muted-foreground py-12">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Thinking of the next question...
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                    {currentQ.question}
                  </h2>
                  <div className="space-y-3">
                    {currentQ.options.map((opt, i) => (
                      <motion.button
                        key={`${opt}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          if (/other|custom/i.test(opt)) {
                            setShowCustom(true);
                          } else {
                            answerQuestion(opt);
                          }
                        }}
                        className="w-full text-left p-4 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                      >
                        <span className="font-medium">{opt}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>

                  {showCustom && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 flex gap-2"
                    >
                      <Input
                        value={customAnswer}
                        onChange={(e) => setCustomAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && answerQuestion(customAnswer)}
                        placeholder="Type your answer..."
                        autoFocus
                      />
                      <Button onClick={() => answerQuestion(customAnswer)} disabled={!customAnswer.trim()}>
                        Send
                      </Button>
                    </motion.div>
                  )}
                </>
              )}

              {qa.length > 0 && (
                <div className="mt-12 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Your answers so far
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {qa.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{p.answer}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* DECISION */}
          {step === "decision" && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Discovery complete</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">{summary}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchNext(service, qa)}
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-left"
                >
                  <MessageSquare className="h-6 w-6 text-primary mb-3" />
                  <div className="font-semibold mb-1">Continue discussion</div>
                  <div className="text-sm text-muted-foreground">
                    Ask a few more questions to refine the brief.
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateCRD}
                  className="p-6 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-left"
                >
                  <FileDown className="h-6 w-6 text-primary mb-3" />
                  <div className="font-semibold mb-1">Generate CRD</div>
                  <div className="text-sm text-muted-foreground">
                    Create your Client Requirement Document now.
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* EMAIL */}
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <div className="inline-flex h-14 w-14 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Almost there</h2>
                <p className="text-muted-foreground">
                  Where should we send a copy of your CRD? We'll also download it now.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your name (optional)</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                    placeholder="you@company.com"
                    autoFocus
                  />
                </div>
                <Button onClick={submitEmail} className="w-full" size="lg">
                  Generate & Download CRD
                </Button>
                <button
                  onClick={() => setStep("decision")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-6"
              >
                <Check className="h-10 w-10 text-primary" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">All set, {name || "thanks"}!</h2>
              <p className="text-muted-foreground mb-2 text-lg">
                Your CRD has been downloaded.
              </p>
              <p className="text-muted-foreground mb-10">
                A copy will also be sent to <span className="text-foreground font-medium">{email}</span>.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={restart} variant="outline">
                  Start a new wizard
                </Button>
                <Button onClick={() => navigate("/")}>Back to home</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Wizard;
