import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface PublisherBookCounts {
  approved: number;
  rejected: number;
  pending: number;
}

export const usePublisherBookCounts = (): PublisherBookCounts => {
  const [counts, setCounts] = useState<PublisherBookCounts>({
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const decodedToken: any = jwtDecode(token);
        const publisherId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const response = await axios.get(
          `http://localhost:8001/api/Publisher/books/all?publisherId=${publisherId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data?.data) {
          const books = response.data.data;

          const statusCounts = books.reduce(
            (acc: PublisherBookCounts, book: any) => {
              switch (book.status) {
                case "Approved":
                  acc.approved++;
                  break;
                case "Rejected":
                  acc.rejected++;
                  break;
                case "Pending":
                  acc.pending++;
                  break;
              }
              return acc;
            },
            { approved: 0, rejected: 0, pending: 0 }
          );

          setCounts(statusCounts);
        }
      } catch (err) {
        console.error("Error fetching publisher book counts", err);
      }
    };

    fetchCounts();
  }, []);

  return counts;
};
