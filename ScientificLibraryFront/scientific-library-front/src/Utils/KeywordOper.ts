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

export const handleKeywordEdit = async (
  keywordId: string,
  name?: string,
) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const payload = {
      keywordId,
      name: name || null,
    };

    const response = await api.patch(
      `${import.meta.env.VITE_API_URL}/Admin/keywords/${keywordId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data.success) {
      console.log("Genre updated successfully:", response.data);
      return true;
    } else {
      console.error("Failed to update keyword:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error updating keyword:", error);
    return false;
  }
};
