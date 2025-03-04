import { useEffect, useState } from "react";
import { Language } from "../Models/Language";
import api from "../api/api";

export const useLanguages = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [langLoading, setLoading] = useState<boolean>(true);
    const [langError, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchLanguages = async () => {
        try {
          const response = await api.get(
            import.meta.env.VITE_API_URL + "/book/languages"
          );
          console.log(response.data);
          if (response.data.success) {
            setLanguages(response.data.data);
          } else {
            setError("Failed to fetch languages.");
          }
        } catch (error) {
          console.error("Error fetching languages:", error);
          setError("Error fetching languages.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchLanguages();
    }, []);
  
    return { languages, langLoading, langError };
  };