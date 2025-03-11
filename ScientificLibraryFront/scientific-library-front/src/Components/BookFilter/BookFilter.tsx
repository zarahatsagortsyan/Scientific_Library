import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./BookFilter.css";

interface BookFilterProps {
  filters: {
    title: string;
    author: string;
    genres: number[];
    languages: string[];
    keywords: string[];
  };
  onFilter: (filters: BookFilterProps["filters"]) => void;
  genres: { id: number; name: string }[];
  languages: string[];
  keywords: string[];
}

const BookFilter: React.FC<BookFilterProps> = ({
  filters,
  onFilter,
  genres,
  languages,
  keywords,
}) => {
  // Keep local state for text fields (prevents re-render on every keystroke)
  const [title, setTitle] = useState(filters.title);
  const [author, setAuthor] = useState(filters.author);

  // Sync local state with global filters when filters change (important for persisting state)
  useEffect(() => {
    setTitle(filters.title);
    setAuthor(filters.author);
  }, [filters.title, filters.author]);

  // Update filter only when user finishes typing (onBlur or Enter key)
  const applyFilter = (field: "title" | "author", value: string) => {
    onFilter({ ...filters, [field]: value });
  };

  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Search by title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => applyFilter("title", title)}
        onKeyDown={(e) => e.key === "Enter" && applyFilter("title", title)}
      />

      <input
        type="text"
        placeholder="Search by author..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        onBlur={() => applyFilter("author", author)}
        onKeyDown={(e) => e.key === "Enter" && applyFilter("author", author)}
      />

      <Select
        isMulti
        options={genres.map((g) => ({ value: g.id, label: g.name }))}
        value={filters.genres.map((id) => ({
          value: id,
          label: genres.find((g) => g.id === id)?.name || "",
        }))}
        onChange={(selected) =>
          onFilter({
            ...filters,
            genres: selected.map((s) => s.value),
          })
        }
        placeholder="Select Genres"
      />

      <Select
        isMulti
        options={languages.map((lang) => ({ value: lang, label: lang }))}
        value={filters.languages.map((lang) => ({
          value: lang,
          label: lang,
        }))}
        onChange={(selected) =>
          onFilter({
            ...filters,
            languages: selected.map((s) => s.value),
          })
        }
        placeholder="Select Languages"
      />

      <Select
        isMulti
        options={keywords.map((k) => ({ value: k, label: k }))}
        value={filters.keywords.map((k) => ({
          value: k,
          label: k,
        }))}
        onChange={(selected) =>
          onFilter({
            ...filters,
            keywords: selected.map((s) => s.value),
          })
        }
        placeholder="Select Keywords"
      />
    </div>
  );
};

export default BookFilter;
