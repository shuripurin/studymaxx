import {
  TextInput,
  Button,
  Paper,
  ScrollArea,
  Container,
  Stack,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { chatBaseURL } from "../routes";
import { TypeWriter } from "../utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post(
        chatBaseURL,
        { message },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
  }).mutateAsync;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const data = await sendMessage(trimmed);

      const content =
        typeof data === "string"
          ? data
          : data.reply ||
            data.message ||
            data.response ||
            "No response from server.";

      const botReply: Message = {
        role: "assistant",
        content: content?.toString().trim() || "No response received.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Something went wrong. Please try again.",
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container size="md" px="md" className="h-[90vh] flex flex-col">
      <ScrollArea
        style={{ flex: 1 }}
        className="bg-gray-50 rounded-md p-4 mb-2"
      >
        <Stack>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Paper shadow="xs" radius="md" p="md" withBorder>
                {msg.role === "assistant" ? (
                  <TypeWriter text={msg.content} delay={2} />
                ) : (
                  msg.content
                )}
              </Paper>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <div className="flex items-center gap-3">
          <TextInput
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Type your message..."
            radius="xl"
            className="flex-1"
          />
          <Button type="submit" radius="xl">
            Send
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default Chat;
