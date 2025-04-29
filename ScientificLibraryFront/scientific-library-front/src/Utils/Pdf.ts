import api from "../api/api";

export const openPdf = async (bookId: string) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await api.get(`http://localhost:8001/api/book/open/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Failed to download PDF", error);
  }
};


export const downloadPdf = async (bookId:string) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await api.get(`http://localhost:8001/api/book/download/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `book-${bookId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download PDF", error);
  }
};
