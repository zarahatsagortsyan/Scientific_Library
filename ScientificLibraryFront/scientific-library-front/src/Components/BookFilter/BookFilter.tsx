import React, { useState, useRef, useEffect } from "react";
import "./BookFilter.css";

interface BookFilterProps {
  onFilter: (filters: {
    title?: string;
    author?: string;
    languages?: string[];
    genres?: string[];
    keywords?: string[];
  }) => void;
  genres: string[];
  keywords: string[];
  languages: string[];
}

const BookFilter: React.FC<BookFilterProps> = ({
  onFilter,
  genres,
  keywords,
  languages,
}) => {
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    languages: [] as string[],
    genres: [] as string[],
    keywords: [] as string[],
  });

  const [dropdowns, setDropdowns] = useState({
    genres: false,
    languages: false,
    keywords: false,
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdowns({ genres: false, languages: false, keywords: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (
    value: string,
    category: "languages" | "genres" | "keywords"
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const toggleDropdown = (dropdown: keyof typeof dropdowns) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <div className="book-filter">
      <div className="filter-group">
        <label>📖 Title</label>
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Enter book title..."
        />
      </div>

      <div className="filter-group">
        <label>✍️ Author</label>
        <input
          type="text"
          name="author"
          value={filters.author}
          onChange={handleChange}
          placeholder="Enter author name..."
        />
      </div>

      <div className="filter-group multi-select" ref={dropdownRef}>
        <label>📚 Genres</label>
        <button type="button" onClick={() => toggleDropdown("genres")}>
          {filters.genres.length > 0
            ? filters.genres.join(", ")
            : "Select genres..."}
        </button>
        {dropdowns.genres && (
          <div className="multi-select-dropdown">
            {genres.map((genre) => (
              <label key={genre}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={filters.genres.includes(genre)}
                  onChange={() => handleCheckboxChange(genre, "genres")}
                />
                {genre}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-group multi-select" ref={dropdownRef}>
        <label>🌐 Languages</label>
        <button type="button" onClick={() => toggleDropdown("languages")}>
          {filters.languages.length > 0
            ? filters.languages.join(", ")
            : "Select languages..."}
        </button>
        {dropdowns.languages && (
          <div className="multi-select-dropdown">
            {languages.map((lang) => (
              <label key={lang}>
                <input
                  type="checkbox"
                  value={lang}
                  checked={filters.languages.includes(lang)}
                  onChange={() => handleCheckboxChange(lang, "languages")}
                />
                {lang}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-group multi-select" ref={dropdownRef}>
        <label>🔍 Keywords</label>
        <button type="button" onClick={() => toggleDropdown("keywords")}>
          {filters.keywords.length > 0
            ? filters.keywords.join(", ")
            : "Select keywords..."}
        </button>
        {dropdowns.keywords && (
          <div className="multi-select-dropdown">
            {keywords.map((keyword) => (
              <label key={keyword}>
                <input
                  type="checkbox"
                  value={keyword}
                  checked={filters.keywords.includes(keyword)}
                  onChange={() => handleCheckboxChange(keyword, "keywords")}
                />
                {keyword}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-actions">
        <button onClick={() => onFilter(filters)}>🔎 Filter</button>
      </div>
    </div>
  );
};


