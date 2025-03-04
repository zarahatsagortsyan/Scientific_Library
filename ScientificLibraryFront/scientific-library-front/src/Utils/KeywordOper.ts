import { useEffect, useState } from "react";
import api from "../api/api";
import { Keyword } from "../Models/Keyword";

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keyLoading, setLoading] = useState<boolean>(true);
  const [keyError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await api.get(
          import.meta.env.VITE_API_URL + "/book/keywords"
        );
        console.log(response.data);
        if (response.data.success) {
          setKeywords(response.data.data);
        } else {
          setError("Failed to fetch keywords.");
        }
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setError("Error fetching keywords.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  return { keywords, keyLoading, keyError };
};
