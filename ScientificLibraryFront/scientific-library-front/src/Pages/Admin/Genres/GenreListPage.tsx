import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGenres } from "../../../Utils/GenresOper";
import { Genre } from "../../../Models/Genre";
import GenreEditForm from "./GenreEditForm";

const GenresListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const { genres, loading, error } = useGenres();

  if (loading) return <div>Loading genres...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  const handleEditGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGenre(null);
  };

  const filteredGenres = genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Genres Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
          {filteredGenres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
              <td>{genre.description}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditGenre(genre)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default GenresListPage;
