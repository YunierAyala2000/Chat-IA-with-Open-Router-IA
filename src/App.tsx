import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Send, Sun } from "lucide-react";
import { sendChatCompletion } from "@/services/openRouterIA-services";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy tu asistente. Escribe algo y te responderé.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";

    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const getFreeModels = async (): Promise<string[]> => {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models");

      const data = (await res.json()) as { data: Array<{ id: string }> };

      return data.data.map((m) => m.id).filter((id) => id.endsWith(":free"));
    } catch (e) {
      console.error("Error fetching models", e);
      return ["openrouter/free"]; // fallback seguro
    }
  };

  const sendMessage = async () => {
    if (isSending) return;

    const trimmed = draft.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setIsSending(true);

    try {
      const freeModels = await getFreeModels();

      let completion = null;
      let lastError = null;

      for (const model of freeModels) {
        try {
          completion = await sendChatCompletion(
            [
              ...messagesRef.current,
              {
                role: "user",
                content: trimmed,
              },
            ],
            { model },
          );

          console.log("✅ Modelo usado:", model);
          break;
        } catch (err) {
          console.log("❌ Falló modelo:", model);
          lastError = err;
        }
      }

      if (!completion) {
        throw lastError || new Error("No free models available");
      }

      const assistantText = completion.choices?.[0]?.message?.content ?? "(sin respuesta)";

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Error inesperado";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error: ${errMessage}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      {/* Glow ambiental */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-600/25" />
      </div>

      <div className="relative mx-4 w-full max-w-xl sm:max-w-md">
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-2xl shadow-black/10 backdrop-blur-xl sm:h-[680px] sm:max-h-[680px] dark:border-white/10 dark:bg-white/5 dark:shadow-black/50">
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

          <header className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Chat IA</h1>
              <p className="text-xs text-slate-600 dark:text-white/60">Un diseño estilo chat para conversar.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-white dark:ring-white/10">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>En línea</span>
              </div>

              <Button
                variant="outline"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-white shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white/80 dark:bg-slate-950/40 dark:text-white dark:ring-white/10 dark:hover:bg-teal-100"
                aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </header>

          <div
            ref={listRef}
            className="scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent dark:scrollbar-thumb-white/10 flex-1 space-y-4 overflow-y-auto px-4 pt-2 pb-6 sm:px-6"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
                    message.role === "user"
                      ? "bg-emerald-100 text-slate-900 ring-emerald-200 dark:bg-emerald-500/20 dark:text-white dark:ring-emerald-500/30"
                      : "bg-slate-100/70 text-slate-900 ring-slate-200/50 dark:bg-white/10 dark:text-white dark:ring-white/10"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-slate-100/70 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200/50 dark:bg-white/10 dark:ring-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400/80 dark:bg-white/40" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400/80 delay-75 dark:bg-white/40" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400/80 delay-150 dark:bg-white/40" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/50 px-4 py-4 sm:px-6 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="h-10 flex-1 bg-white/60 text-slate-900 placeholder:text-slate-500 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
              />
              <Button
                onClick={sendMessage}
                disabled={!draft.trim()}
                className="flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 font-semibold text-white shadow-lg shadow-purple-900/40 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
