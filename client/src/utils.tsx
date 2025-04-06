import { useState, useEffect } from "react";

export async function apiCaller<T = any>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    queryParams?: Record<string, string>;
    token?: string;
  }
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    queryParams,
    token,
  } = options || {};

  const queryString = queryParams
    ? "?" + new URLSearchParams(queryParams).toString()
    : "";

  const res = await fetch(`${endpoint}${queryString}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }

  return res.json();
}

interface TypeWriterProps {
  text: string;
  delay?: number;
}

export function TypeWriter({ text, delay = 20 }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex(index + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [index, text, delay]);

  return <span>{displayed}</span>;
}
