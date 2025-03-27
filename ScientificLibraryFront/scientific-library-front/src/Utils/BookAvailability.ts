import { jwtDecode } from "jwt-decode";
import { Book } from "../Models/Book";
import api from "../api/api";

export const toggleBookAvailability = async (book:Book) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }
    const decodedToken: any = jwtDecode(token);
    const publisherId =  decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const response = await api.patch(
      `${import.meta.env.VITE_API_URL}/Publisher/books/availability`,
      {
        PublisherId: publisherId,
        BookId: book.id,
        Availability: !book.isAvailable,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200 && response.data.success == true) {
      return { ...book, isAvailable: !book.isAvailable };
    } else {
      console.error("Failed to toggle availability:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error toggling availability:", error);
    return null;
  }
};