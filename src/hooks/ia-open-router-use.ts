import { useEffect, useRef, useState } from "react";
import { OpenRouterError, sendChatCompletion } from "@/services/openRouterIA-services";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function useOpenRouterChat() {
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

  return {
    draft,
    setDraft,
    isSending,
    messages,
    listRef,
    sendMessage,
  };
}
