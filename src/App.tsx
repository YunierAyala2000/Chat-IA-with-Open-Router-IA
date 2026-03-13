import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Send, Sun, Bot, User, Sparkles, Zap, Check, X } from "lucide-react";
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40">
      {/* Fondo con partículas animadas */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 via-transparent to-transparent dark:from-indigo-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent dark:from-purple-900/20" />

        {/* Patrón de grid más elegante */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Efecto de desenfoque en los bordes */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-600/20" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:h-[85vh] sm:rounded-3xl lg:rounded-4xl dark:border-white/10 dark:bg-slate-900/95">
          {/* Header con diseño moderno */}
          <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/50 px-4 py-2 backdrop-blur-sm sm:px-6 sm:py-3 dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              {/* Logo animado */}
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-xl bg-indigo-400/20 blur-md" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/30 transition-transform hover:scale-110 hover:rotate-3 sm:h-11 sm:w-11">
                  <Bot className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl dark:text-white">
                    Asistente IA
                  </h2>

                  {/* Badge mejorado */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm sm:text-xs">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    PRO
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    OpenRouter
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>Modelos gratuitos</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="icon"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          <div
            ref={listRef}
            className="scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/60 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-3 duration-500`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className={`flex max-w-[90%] items-end gap-2 sm:max-w-[80%] lg:max-w-[70%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                      )}
                    </div>
                    {/* Indicador de online para el asistente */}
                    {message.role === "assistant" && (
                      <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  {/* Contenedor del mensaje con efecto de burbuja */}
                  <div className="group relative">
                    <div
                      className={`relative rounded-2xl px-3 py-2 text-xs shadow-md transition-all hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm lg:px-5 lg:py-3 lg:text-base ${
                        message.role === "user"
                          ? "rounded-br-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                          : "rounded-bl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />

                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap sm:text-base lg:text-lg">
                        {message.content}
                      </p>

                      {/* Metadata del mensaje */}
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[8px] opacity-50 sm:text-[10px] ${
                          message.role === "user" ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {message.role === "user" && (
                          <>
                            <span>·</span>
                            <Check className="h-2.5 w-2.5" />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Efecto de sombra en la burbuja */}
                    <div
                      className={`absolute -bottom-1 ${
                        message.role === "user" ? "right-2" : "left-2"
                      } h-3 w-3 rotate-45 bg-inherit opacity-50 blur-sm`}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de escritura mejorado con animación más suave */}
            {isSending && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-3 flex justify-start duration-500">
                <div className="flex max-w-[90%] items-end gap-2 sm:max-w-[80%] lg:max-w-[70%]">
                  <div className="relative shrink-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-lg sm:h-8 sm:w-8 lg:h-9 lg:w-9">
                      <Bot className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    </div>
                  </div>

                  <div className="relative rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-md sm:px-5 sm:py-4 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        {[0, 150, 300].map((delay, i) => (
                          <div
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 sm:h-2 sm:w-2"
                            style={{ animationDelay: `${delay}ms`, animationDuration: "0.8s" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isSending && (
              <div className="animate-in fade-in-0 flex h-auto flex-col items-center justify-center py-6 text-center duration-700">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-400/20 blur-xl" />
                  <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl sm:h-20 sm:w-20">
                    <Bot className="h-8 w-8 text-white sm:h-10 sm:w-10" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-700 sm:text-lg dark:text-slate-300">
                  ¡Bienvenido al Asistente IA!
                </h3>
                <p className="max-w-xs text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  Estoy aquí para ayudarte. Puedes preguntarme lo que necesites y te responderé con la ayuda de modelos
                  de IA avanzados.
                </p>
              </div>
            )}
          </div>

          {/* Área de input con diseño moderno */}
          <div className="border-t border-slate-200/70 bg-white/50 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4 dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="relative flex-1">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  rows={1}
                  className="max-h-32 w-full resize-none rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-xs text-slate-900 shadow-inner transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 sm:py-3.5 sm:text-sm dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30"
                  style={{ minHeight: "44px" }}
                />

                <div className="absolute right-3 bottom-2 flex items-center gap-2">
                  {draft.length > 0 && (
                    <>
                      <button
                        onClick={() => setDraft("")}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="text-[10px] text-slate-400">{draft.length}/500</span>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={sendMessage}
                disabled={!draft.trim() || isSending}
                className="group relative h-11 w-11 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-0 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-12 sm:w-12"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 opacity-0 blur transition-opacity group-hover:opacity-50" />
                <Send className="relative h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Barra de herramientas y información */}
            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[8px] text-indigo-600 sm:text-[10px] dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Zap className="h-2.5 w-2.5" />
                  Enter para enviar
                </span>
              </div>

              <span className="text-[8px] text-slate-400 sm:text-[10px]">Desarrollado por Junier Ayala Perez</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
