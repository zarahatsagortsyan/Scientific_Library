import { useEffect, useState } from "react";
import api from "../api/api";
import { Genre } from "../Models/Genre";

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get(
          import.meta.env.VITE_API_URL + "/book/genres"
        );
        console.log(response.data);
        if (response.data.success) {
          setGenres(response.data.data);
        } else {
          setError("Failed to fetch genres.");
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Error fetching genres.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};

export const handleGenreEdit = async (
  genreId: string,
  name?: string,
  genreDescription?: string
) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const payload = {
      genreId,
      name: name || null,
      genreDescription: genreDescription || null,
    };

    console.log("asdasd: " + payload.name);
    const response = await api.patch(
      `${import.meta.env.VITE_API_URL}/Admin/genres/${genreId}`,
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
      console.error("Failed to update genre:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error updating genre:", error);
    return false;
  }
};
