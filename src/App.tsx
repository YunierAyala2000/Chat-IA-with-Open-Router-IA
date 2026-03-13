import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { sendChatCompletion, type ChatMessage } from "@/services/openRouterIA-services";

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
  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const getFreeModels = async () => {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models");

      const data = await res.json();

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

    const userMessage = {
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

      const assistantMessage = {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Glow ambiental */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="relative mx-4 w-full max-w-md">
        <div className="flex h-[680px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

          <header className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Chat IA</h1>
              <p className="text-xs text-white/50">Un diseño estilo chat para conversar.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/50">En línea</span>
            </div>
          </header>

          <div
            ref={listRef}
            className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1 space-y-4 overflow-y-auto px-6 pt-2 pb-6"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.role === "user"
                      ? "bg-emerald-500/20 text-white ring-1 ring-emerald-500/30"
                      : "bg-white/10 text-white ring-1 ring-white/10"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="h-10 bg-white/5 text-white placeholder:text-white/40"
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
