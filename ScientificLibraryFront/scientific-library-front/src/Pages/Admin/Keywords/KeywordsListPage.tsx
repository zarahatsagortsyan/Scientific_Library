import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Keyword } from "../../../Models/Keyword";
import { useKeywords } from "../../../Utils/KeywordOper";
import KeywordEditForm from "./KeywordEditForm";
import api from "../../../api/api";

const KeywordsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const keywordsPerPage = 6; // ✅ Show 6 keywords per page

  const { keywords, keyLoading, keyError } = useKeywords();

  if (keyLoading) return <div>Loading keywords...</div>;
  if (keyError) return <div className="text-danger">{keyError}</div>;

  const handleEditKeyword = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKeyword(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewKeyword("");
    setErrorMessage("");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setErrorMessage("");
  };

  const handleCreateKeyword = async () => {
    if (!newKeyword.trim()) {
      setErrorMessage("Keyword name is required.");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("jwtToken");
      console.log("asdasdasd  " + newKeyword);
      await api.post(
        `${import.meta.env.VITE_API_URL}/Admin/keywords`,
        { name: newKeyword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); // Refresh to get updated keywords
    } catch (err) {
      console.error("Error creating keyword:", err);
      setErrorMessage("Failed to create keyword.");
    } finally {
      setCreating(false);
    }
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredKeywords.length / keywordsPerPage);
  const startIndex = (currentPage - 1) * keywordsPerPage;
  const paginatedKeywords = filteredKeywords.slice(
    startIndex,
    startIndex + keywordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Keywords Management</h1>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Name or Description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleOpenCreateModal}>
          ➕ Create Keyword
        </button>
      </div>

      {paginatedKeywords.length === 0 ? (
        <div className="alert alert-warning text-center">
          No keywords available. Click "Create Keyword" to add one.
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKeywords.map((keyword) => (
              <tr key={keyword.id}>
                <td>{keyword.id}</td>
                <td>{keyword.name}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditKeyword(keyword)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Pagination Controls */}
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

      {/* Edit Keyword Modal */}
      {isModalOpen && selectedKeyword && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">edit keyword</h5>
                {/* <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button> */}
              </div>
              <div className="modal-body">
                <KeywordEditForm
                  keyword={selectedKeyword}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Keyword Modal */}
      {isCreateModalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">new keyword</h5>
                {/* <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseCreateModal}
                ></button> */}
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateKeyword}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseCreateModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordsListPage;
