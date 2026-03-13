import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Send, Sun, Bot, User, Sparkles, Zap } from "lucide-react";
import { OpenRouterError, sendChatCompletion } from "@/services/openRouterIA-services";

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
      return ["openrouter/free"];
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
          break;
        } catch (err) {
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

      const isUnauthorized = error instanceof OpenRouterError && error.status === 401;

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: isUnauthorized
            ? "Ups, parece que tu API key expiró. Ve a https://openrouter.ai/settings/keys, genera una nueva, pégala en tu archivo .env y vuelve a intentar."
            : `Error: ${errMessage}`,
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/50">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl sm:h-[90vh] sm:rounded-3xl dark:border-white/5 dark:bg-slate-900/90">
          {/* Header Mejorado */}
          <header className="flex items-center justify-between border-b border-slate-200/50 px-4 py-3 sm:px-6 sm:py-4 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
                  Asistente IA
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  Conectado a OpenRouter · Modelos gratuitos
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </header>

          {/* Área de mensajes mejorada */}
          <div
            ref={listRef}
            className="scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/50 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex max-w-[85%] items-start gap-2 sm:max-w-[75%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md sm:h-9 sm:w-9 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                    ) : (
                      <Bot className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                    )}
                  </div>

                  {/* Mensaje */}
                  <div
                    className={`group relative rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all hover:shadow-md sm:px-5 sm:py-3 sm:text-base ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <p className="leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>

                    {/* Timestamp opcional */}
                    <span className="absolute right-2 bottom-0.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-40 sm:bottom-1">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de escritura mejorado */}
            {isSending && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex justify-start duration-300">
                <div className="flex max-w-[75%] items-start gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md sm:h-9 sm:w-9">
                    <Bot className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white px-5 py-4 shadow-sm dark:bg-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isSending && (
              <div className="flex h-auto flex-col items-center justify-center py-10 text-center opacity-50">
                <Bot className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-600">
                  No hay mensajes aún. ¡Comienza la conversación!
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/50 bg-slate-50/50 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4 dark:border-white/5 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="h-11 w-full rounded-xl border border-slate-200/60 bg-white pr-12 pl-4 text-sm text-slate-900 shadow-inner transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:h-12 sm:text-base dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30"
                />
                {draft.length > 0 && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
                    {draft.length}
                  </span>
                )}
              </div>

              <Button
                onClick={sendMessage}
                disabled={!draft.trim() || isSending}
                className="group relative h-11 w-11 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-0 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-12 sm:w-12"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <Send className="relative h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
              <Zap className="mr-1 inline h-3 w-3" />
              Presiona Enter para enviar · Modelos gratuitos de OpenRouter · Desarrollado por Junier Ayala Perez
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
