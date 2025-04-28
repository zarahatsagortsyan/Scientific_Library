import api from "../api/api";

export const handleBookApprove = async (id: any) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const response = await api.put(
      import.meta.env.VITE_API_URL + `/Admin/books/approve?bookId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      alert("Book approved successfully!");
      window.location.reload(); // Refresh the page
    } else {
      console.error("Failed to approve book:", response.data);
    }
  } catch (error) {
    console.error("Error approving book:", error);
  }
};

export const handleBookReject = async (id: any) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const response = await api.patch(
      import.meta.env.VITE_API_URL + `/Admin/books/reject?bookId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      alert("Book rejected successfully!");
      window.location.reload(); // Refresh the page
    } else {
      console.error("Failed to reject book:", response.data);
    }
  } catch (error) {
    console.error("Error rejecting book:", error);
  }
};
