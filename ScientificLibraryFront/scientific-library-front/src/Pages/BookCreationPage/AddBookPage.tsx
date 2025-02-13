import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddBookPage.css";

// Define Genre type
interface Genre {
  id: number;
  name: string;
}

const AddBookPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    isbn: "",
    publicationDate: "",
    pageCount: 0,
    language: "",
    format: "",
    keywords: "",
    isAvailable: true,
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Fetch genres from the API when the component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/Book/genres"
        );
        if (response.data.success) {
          setGenres(response.data.data);
        } else {
          alert("Failed to fetch genres");
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "image" | "pdf"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      fileType === "image"
        ? setCoverImage(selectedFile)
        : setPdfFile(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Unauthorized. Please log in.");
      return;
    }

    const formDataToSend = new FormData();
    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });
    // Add files
    if (coverImage) formDataToSend.append("coverImage", coverImage);
    if (pdfFile) formDataToSend.append("pdfFile", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:8001/api/publisher/books",
        formDataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Book submitted for approval!");
        navigate("/");
      } else {
        alert("Failed to create book.");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="centered-container">
      <div className="add-book-page">
        <h2 className="form-title">📖 Add New Book</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section">
            <h3>📝 Book Details</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              required
              onChange={handleInputChange}
            />

            {/* Genre Dropdown */}
            <select
              name="genre"
              value={formData.genre}
              required
              onChange={handleInputChange}
              className="genre-select"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Description"
              required
              onChange={handleInputChange}
            ></textarea>
            <input
              type="text"
              name="isbn"
              placeholder="ISBN"
              required
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="publicationDate"
              required
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="pageCount"
              placeholder="Page Count"
              required
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="language"
              placeholder="Language"
              required
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="format"
              placeholder="Format (eBook, Audiobook, etc.)"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="keywords"
              placeholder="Keywords (comma-separated)"
              onChange={handleInputChange}
            />
          </div>

          {/* File Uploads */}
          <div className="form-section">
            <h3>📂 Upload Files</h3>

            {/* Cover Image */}
            <div className="file-input">
              <label htmlFor="coverImage" className="file-label">
                📷 Upload Book Cover (Image)
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                required
              />
            </div>

            {/* PDF File */}
            <div className="file-input">
              <label htmlFor="pdfFile" className="file-label">
                📄 Upload Book File (PDF)
              </label>
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, "pdf")}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            🚀 Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
