import api from "../api/api";

export const handleBookApprove = async (id:any) => {

    console.log(id)
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const response = await api.patch(
      import.meta.env.VITE_API_URL +`/Admin/books/approve?bookId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log('Active Readers:', response.data);
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

export const handleBookReject = async (id:string) => {

  console.log(id)
try {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await api.patch(
    import.meta.env.VITE_API_URL +`/Admin/books/approve?bookId=${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    return { };
  } else {
    console.error("Failed to reject book:", response.data);
    return null;
  }
} catch (error) {
  console.error("Error reject book:", error);
  return null;
}
};