import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useGenres } from "../../../Utils/GenresOper";
import { Genre } from "../../../Models/Genre";
import GenreEditForm from "./GenreEditForm";

const GenresListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGenre, setNewGenre] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const genresPerPage = 6; // ✅ Show 6 genres per page

  const { genres, loading, error } = useGenres();

  if (loading) return <div className="container mt-4">Loading genres...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  const handleEditGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGenre(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewGenre({ name: "", description: "" });
    setErrorMessage("");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setErrorMessage("");
  };

  const handleCreateGenre = async () => {
    if (!newGenre.name.trim()) {
      setErrorMessage("Genre name is required.");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Admin/genres`,
        newGenre,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); // Refresh to get updated genres
    } catch (err) {
      console.error("Error creating genre:", err);
      setErrorMessage("Failed to create genre.");
    } finally {
      setCreating(false);
    }
  };

  const filteredGenres = genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredGenres.length / genresPerPage);
  const startIndex = (currentPage - 1) * genresPerPage;
  const paginatedGenres = filteredGenres.slice(
    startIndex,
    startIndex + genresPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Genres Management</h1>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Name or Description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleOpenCreateModal}>
          ➕ Create Genre
        </button>
      </div>

      {paginatedGenres.length === 0 ? (
        <div className="alert alert-warning text-center">
          No genres available. Click "Create Genre" to add one.
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
            {paginatedGenres.map((genre) => (
              <tr key={genre.id}>
                <td>{genre.id}</td>
                <td>{genre.name}</td>
                <td>{genre.description}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditGenre(genre)}
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

      {/* Edit Genre Modal */}
      {isModalOpen && selectedGenre && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Genre</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <GenreEditForm
                  genre={selectedGenre}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Genre Modal */}
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
                <h5 className="modal-title">new genre</h5>
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
                    value={newGenre.name}
                    onChange={(e) =>
                      setNewGenre((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newGenre.description}
                    onChange={(e) =>
                      setNewGenre((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateGenre}
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

export default GenresListPage;
