import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMessages } from "../../../Utils/MessageOper";
import api from "../../../api/api";

const AdminMessages: React.FC = () => {
  const { messages, mesLoading, mesError } = useMessages();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;

  if (mesLoading) return     <div className="container mt-4"> Loading messages...</div>;
  if (mesError) return <div className="text-danger">{mesError}</div>;

  const markAsReplied = async (id: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authentication required.");
      }
      await api.put(
        `${import.meta.env.VITE_API_URL}/admin/messages/${id}/reply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload(); // Refresh the page to update the status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(
    startIndex,
    startIndex + messagesPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Messages</h1>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Email or Content"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {paginatedMessages.length === 0 ? (
        <div className="alert alert-warning text-center">
          No messages available.
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.id}</td>
                <td>{msg.email}</td>
                <td>{msg.content}</td>
                <td>{msg.status}</td>
                <td>
                  {msg.status === "Pending" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => markAsReplied(msg.id)}
                    >
                      Mark as Replied
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ⬅ Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next ➡
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AdminMessages;
