// import React, { useEffect, useState } from "react";
// import { User } from "../../../Models/User";
// import "bootstrap/dist/css/bootstrap.min.css";
// import api from "../../../api/api";

// const PublishersListPage: React.FC = () => {
//   const [publishers, setPublishers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const fetchPublishers = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("Authentication required.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await api.get(
//         `${import.meta.env.VITE_API_URL}/users/publishers/active`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setPublishers(response.data.data);
//       setError(null);
//     } catch (err) {
//       console.error("Failed to fetch publishers:", err);
//       setError("Failed to fetch publishers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPublishers();
//   }, []);

//   const token = localStorage.getItem("jwtToken");
//   if (!token) {
//     setError("Authentication required.");
//     setLoading(false);
//     return;
//   }
//   const handleBanUser = async (userId: string) => {
//     try {
//       await api.put(
//         `${import.meta.env.VITE_API_URL}/users/ban?userId=${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, banned: true } : user
//         )
//       );
//     } catch (error) {
//       console.error("Failed to ban user:", error);
//     }
//   };

//   const handleUnbanUser = async (userId: string) => {
//     try {
//       await api.put(
//         `${import.meta.env.VITE_API_URL}/users/unban?userId=${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, banned: false } : user
//         )
//       );
//     } catch (error) {
//       console.error("Failed to unban user:", error);
//     }
//   };

//   const filteredPublishers = publishers.filter(
//     (reader) =>
//       reader.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       reader.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-danger">{error}</div>;

//   return (
//     <div className="container mt-4">
//       <h1 className="mb-4">Publishers Management</h1>

//       <div className="mb-3">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by Name or Email"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <table className="table table-striped table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>Company Name</th>
//             <th>Email</th>
//             <th>Type</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredPublishers.map((reader) => (
//             <tr key={reader.id}>
//               <td>{reader.companyName}</td>
//               <td>{reader.email}</td>
//               <td>{reader.type}</td>
//               <td>{reader.banned ? "Banned" : "Active"}</td>
//               <td>
//                 {reader.banned ? (
//                   <button
//                     className="btn btn-success"
//                     onClick={() => handleUnbanUser(reader.id)}
//                   >
//                     Unban
//                   </button>
//                 ) : (
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => handleBanUser(reader.id)}
//                   >
//                     Ban
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PublishersListPage;
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useMessages } from "../../../Utils/MessageOper";

const AdminMessages: React.FC = () => {
  const { messages, mesLoading, mesError } = useMessages();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;
  const token = localStorage.getItem("jwtToken"); // Retrieve token from local storage

  if (mesLoading) return <div>Loading messages...</div>;
  if (mesError) return <div className="text-danger">{mesError}</div>;

  const markAsReplied = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/messages/${id}/reply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
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
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
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
