import { useEffect, useState } from "react";
import api from "../api/api";

interface Message {
  id: number;
  email: string;
  content: string;
  status: string;
}
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mesLoading, setLoading] = useState<boolean>(true);
  const [mesError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("Authentication required.");
        }
        const response = await api.get(
          import.meta.env.VITE_API_URL + "/admin/messages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        if (response.data.success) {
          setMessages(response.data.data);
        } else {
          setError("Failed to fetch meswords.");
        }
      } catch (error) {
        console.error("Error fetching meswords:", error);
        setError("Error fetching meswords.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, mesLoading, mesError };
};
