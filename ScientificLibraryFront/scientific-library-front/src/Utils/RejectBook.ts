import axios from "axios";

export const handleBookApprove = async (id:string) => {

    console.log(id)
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const response = await axios.patch(
      `http://localhost:8001/api/Admin/books/${id}/approve`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      return { };
    } else {
      console.error("Failed to approve book:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error approving book:", error);
    return null;
  }
};