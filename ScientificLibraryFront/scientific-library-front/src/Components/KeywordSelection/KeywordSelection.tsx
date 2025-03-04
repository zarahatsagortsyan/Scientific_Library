import React, { useState } from "react";
import "./KeywordSelection.css"; // Import CSS

// Define TypeScript types
interface Keyword {
  id: string;
  name: string;
}

interface KeywordSelectionProps {
  keywords: Keyword[];
  selectedKeywords: string[];
  handleKeywordChange: (keyword: string) => void;
  keyLoading: boolean;
  keyError: string | null;
}

const KeywordSelection: React.FC<KeywordSelectionProps> = ({
  keywords,
  selectedKeywords,
  handleKeywordChange,
  keyLoading,
  keyError,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter keywords based on search input
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="keywords-container">
      <label>Select Keywords:</label>

      {/* Search Input */}
      <input
        type="text"
        className="keyword-search"
        placeholder="🔍 Search keywords..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {keyLoading ? (
        <p>Loading keywords...</p>
      ) : keyError ? (
        <p className="error">{keyError}</p>
      ) : (
        <div className="keyword-list">
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map((keyword) => (
              <label key={keyword.id} className="keyword-checkbox">
                <input
                  type="checkbox"
                  value={keyword.name}
                  checked={selectedKeywords.includes(keyword.name)}
                  onChange={() => handleKeywordChange(keyword.name)}
                />
                {keyword.name}
              </label>
            ))
          ) : (
            <p>No matching keywords found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordSelection;
