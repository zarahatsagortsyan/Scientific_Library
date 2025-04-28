import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBookPage.css";
import { FaRegFilePdf } from "react-icons/fa";
import { useGenres } from "../../Utils/GenresOper";
import { useLanguages } from "../../Utils/GetLanguages";
import { useKeywords } from "../../Utils/KeywordOper";
import KeywordSelection from "../../Components/KeywordSelection/KeywordSelection";
import api from "../../api/api";

const AddBookPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genreId: 0,
    language: "",
    description: "",
    isbn: "",
    publicationDate: "",
    pageCount: 0,
    keywords: [] as string[],
    isAvailable: true,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { genres } = useGenres();
  const { languages } = useLanguages();
  const { keywords, keyLoading, keyError } = useKeywords();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fileError, setFileError] = useState<string>(""); // For file validation errors

  const validImageFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
  ];
  const validPdfFormat = "application/pdf";

  const handleKeywordChange = (keyword: string) => {
    setSelectedKeywords((prevKeywords) =>
      prevKeywords.includes(keyword)
        ? prevKeywords.filter((k) => k !== keyword)
        : [...prevKeywords, keyword]
    );
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "image" | "pdf"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (fileType === "image") {
        if (!validImageFormats.includes(selectedFile.type)) {
          setFileError(
            "Invalid image format. Only JPG, PNG, and GIF are allowed."
          );
          setCoverImage(null);
          return;
        }
        setFileError("");
        setCoverImage(selectedFile);
      } else if (fileType === "pdf") {
        if (selectedFile.type !== validPdfFormat) {
          setFileError("Invalid file format. Only PDF files are allowed.");
          setPdfFile(null);
          return;
        }
        setFileError("");
        setPdfFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Prevent submission if there are file errors
    if (fileError) {
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setErrorMessage("Unauthorized. Please log in.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "keywords") {
        formDataToSend.append(key, value.toString());
      }
    });

    selectedKeywords.forEach((keyword) => {
      formDataToSend.append("keywords", keyword);
    });

    if (coverImage) formDataToSend.append("coverImage", coverImage);
    if (pdfFile) formDataToSend.append("pdfFile", pdfFile);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/publisher/books`,
        formDataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Book submitted for approval!");
        window.location.reload();
        navigate("/");
      } else {
        setErrorMessage("Failed to create book.");
      }
    } catch (error: any) {
      console.error("Error creating book:", error);

      if (error.response && error.response.data) {
        const errorMsg =
          error.response.data.message || "An error occurred. Please try again.";
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="centered-container">
      <div className="add-book-page">
        <h2 className="form-title">📖 Add New Book</h2>
        {/* Show error messages */}
        {errorMessage && <div className="error">{errorMessage}</div>}
        {fileError && <div className="error">{fileError}</div>}

        <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-section">
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
            <select
              name="genreId"
              value={formData.genreId}
              required
              onChange={handleInputChange}
              className="genre-select"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
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
            <select
              name="language"
              value={formData.language}
              required
              onChange={handleInputChange}
              className="genre-select"
            >
              <option value="">Select Language</option>
              {languages.map((languages) => (
                <option key={languages.id} value={languages.name}>
                  {languages.name}
                </option>
              ))}
            </select>
            <KeywordSelection
              keywords={keywords}
              selectedKeywords={selectedKeywords}
              handleKeywordChange={handleKeywordChange}
              keyLoading={keyLoading}
              keyError={keyError}
            />
          </div>

          <div className="form-section">
            <h3>📂 Upload Files</h3>

            {/* Cover Image */}
            <div className="file-input">
              <label htmlFor="coverImage" className="file-label">
                📷 Upload Book Cover (JPG, PNG, GIF)
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/jpeg, image/png, image/jpg, image/gif"
                onChange={(e) => handleFileChange(e, "image")}
                required
              />
            </div>

            {/* PDF File */}
            <div className="file-input">
              <label htmlFor="pdfFile" className="file-label">
                📄 Upload Book File (PDF) <FaRegFilePdf />
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

          <button
            type="submit"
            className="submit-button"
            disabled={!!fileError}
          >
            🚀 Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
