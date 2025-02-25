// import React, { useState } from "react";
// import { handleGenreEdit } from "../../../Utils/GenresOper";
// import { Genre } from "../../../Models/Genre";
// import "./GenreEditForm.css";

// interface GenreEditFormProps {
//   genre: Genre;
//   onClose: () => void;
// }

// const GenreEditForm: React.FC<GenreEditFormProps> = ({ genre, onClose }) => {
//   const [name, setName] = useState<string>(genre.name || "");
//   const [description, setDescription] = useState<string>(
//     genre.description || ""
//   );

//   const handleSubmit = async () => {
//     console.log("name:" + name);
//     const success = await handleGenreEdit(genre.id, name, description);
//     if (success) {
//       alert("Genre updated successfully!");
//       onClose();
//     } else {
//       alert("Failed to update genre.");
//     }
//   };

//   return (
//     <div className="genre-edit-form">
//       <div className="modal-body">
//         <label>
//           Name:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <label>
//           Description:
//           <input
//             type="text"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </label>
//       </div>
//       <div className="modal-footer">
//         <button onClick={handleSubmit} className="btn btn-success">
//           Save Changes
//         </button>
//         <button onClick={onClose} className="btn btn-secondary">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GenreEditForm;
import React, { useState } from "react";
import { handleGenreEdit } from "../../../Utils/GenresOper";
import { Genre } from "../../../Models/Genre";
import "./GenreEditForm.css";

interface GenreEditFormProps {
  genre: Genre;
  onClose: () => void;
  hideCancelButton?: boolean;
}

const GenreEditForm: React.FC<GenreEditFormProps> = ({
  genre,
  onClose,
  hideCancelButton,
}) => {
  const [name, setName] = useState<string>(genre.name || "");
  const [description, setDescription] = useState<string>(
    genre.description || ""
  );
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError("Name and Description are required.");
      return;
    }

    const success = await handleGenreEdit(genre.id, name, description);
    if (success) {
      alert("Genre updated successfully!");
      window.location.reload();
      onClose();
    } else {
      alert("Failed to update genre.");
    }
  };

  return (
    <div className="genre-edit-form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="modal-body">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="modal-footer">
        <button onClick={handleSubmit} className="btn btn-success">
          Save Changes
        </button>
        {!hideCancelButton && (
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreEditForm;
