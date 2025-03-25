import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

export interface BookCounts {
  toRead: number;
  reading: number;
  read: number;
}

export const useReaderBookCounts = (): BookCounts => {
  const [counts, setCounts] = useState<BookCounts>({
    toRead: 0,
    reading: 0,
    read: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const statuses = [0, 1, 2]; // ToRead, Reading, Read
        const [toRead, reading, read] = await Promise.all(
          statuses.map((status) =>
            api.get(
              `http://localhost:8001/api/Reader/user-books/${userId}?status=${status}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          )
        );

        setCounts({
          toRead: toRead.data.data?.length || 0,
          reading: reading.data.data?.length || 0,
          read: read.data.data?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching reader book counts", err);
      }
    };

    fetchCounts();
  }, []);

  return counts;
};
