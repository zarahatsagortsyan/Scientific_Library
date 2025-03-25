import { useEffect, useState } from "react";
import axios from "axios";

export interface AdminBookCounts {
  approved: number;
  rejected: number;
  pending: number;
}

export const useAdminBookCounts = (): AdminBookCounts => {
  const [counts, setCounts] = useState<AdminBookCounts>({
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await axios.get(
          `http://localhost:8001/api/Admin/books/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data?.data) {
          const books = response.data.data;

          const statusCounts = books.reduce(
            (acc: AdminBookCounts, book: any) => {
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
        console.error("Error fetching admin book counts", err);
      }
    };

    fetchCounts();
  }, []);

  return counts;
};
