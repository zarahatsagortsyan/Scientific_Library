import React, { useState } from "react";
import { Keyword } from "../../../Models/Keyword";
import "./KeywordEditForm.css";
import { handleKeywordEdit } from "../../../Utils/KeywordOper";

interface KeywordEditFormProps {
  keyword: Keyword;
  onClose: () => void;
  hideCancelButton?: boolean;
}

const KeywordEditForm: React.FC<KeywordEditFormProps> = ({
  keyword,
  onClose,
  hideCancelButton,
}) => {
  const [name, setName] = useState<string>(keyword.name || "");

  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const success = await handleKeywordEdit(keyword.id, name);
    if (success) {
      alert("Keyword updated successfully!");
      window.location.reload();
      onClose();
    } else {
      alert("Failed to update keyword.");
    }
  };

  return (
    <div className="keyword-edit-form">
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

export default KeywordEditForm;
