import { useState, useCallback } from "react";
import { chatAPI } from "../services/api";

function useChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isLoading) return;

      // Add user message to messages
      const userMessage = {
        role: "user",
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Get conversation history for API call
        const conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Send message to backend
        const response = await chatAPI.sendMessage(
          messageText,
          conversationHistory
        );

        console.log("API Response:", response);

        // Add bot response to messages
        const botMessage = {
          role: "assistant",
          content: response.response,
          safety: response.safety,
          timestamp: response.timestamp,
        };

        console.log(botMessage);

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Failed to send message:", err);

        // Create error message
        let errorMessage = "Sorry, something went wrong. Please try again.";

        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.code === "ECONNABORTED") {
          errorMessage =
            "Request timeout. The server might be busy, please try again.";
        } else if (err.code === "NETWORK_ERROR") {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        const errorBotMessage = {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date().toISOString(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorBotMessage]);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.role === "user") {
        // Remove the last failed bot message
        setMessages((prev) => prev.slice(0, -1));
        // Resend the user message
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isLoading,
    error,
  };
}

export default useChat;
