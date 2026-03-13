const OPENROUTER_BASE_URL = "https://openrouter.ai";
const DEFAULT_OPENROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_IA_API_KEY;

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type OpenRouterCompletionChoice = {
  index: number;
  message: ChatMessage;
  finish_reason: string | null;
};

export type OpenRouterCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

function getOpenRouterApiKey(apiKey?: string) {
  const key = apiKey ?? DEFAULT_OPENROUTER_API_KEY;
  if (!key) {
    throw new Error(
      "OpenRouter API key is missing. Set VITE_OPEN_ROUTER_IA_API_KEY in your .env file or pass it explicitly.",
    );
  }
  return key;
}

export async function sendChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    apiKey?: string;
    referer?: string;
    title?: string;
  },
): Promise<OpenRouterCompletionResponse> {
  const { model = "openai/gpt-5.2", apiKey, referer, title } = options ?? {};
  const key = getOpenRouterApiKey(apiKey);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };

  if (referer) headers["HTTP-Referer"] = referer;
  if (title) headers["X-OpenRouter-Title"] = title;

  // Fallbacks to runtime values when in browser.
  if (!referer && typeof window !== "undefined") {
    headers["HTTP-Referer"] = window.location.origin;
  }
  if (!title && typeof document !== "undefined") {
    headers["X-OpenRouter-Title"] = document.title || "Chat-IA";
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/api/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter request failed (${response.status} ${response.statusText}): ${text}`);
  }

  return (await response.json()) as OpenRouterCompletionResponse;
}
