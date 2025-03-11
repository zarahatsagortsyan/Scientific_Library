// // // import React, { useState } from "react";
// // // import Select from "react-select";
// // // import "./BookFilter.css";

// // // interface BookFilterProps {
// // //   filters: {
// // //     title: string;
// // //     author: string;
// // //     genres: number[];
// // //     languages: string[];
// // //     keywords: string[];
// // //   };
// // //   onFilter: (filters: BookFilterProps["filters"]) => void;
// // //   genres: { id: number; name: string }[];
// // //   languages: string[];
// // //   keywords: string[];
// // // }

// // // const BookFilter: React.FC<BookFilterProps> = ({
// // //   filters,
// // //   onFilter,
// // //   genres,
// // //   languages,
// // //   keywords,
// // // }) => {
// // //   const [filterData, setFilterData] = useState(filters);

// // //   const handleChange = (field: keyof typeof filterData, value: any) => {
// // //     setFilterData((prev) => ({ ...prev, [field]: value }));
// // //   };

// // //   return (
// // //     <div className="book-filter">
// // //       <input
// // //         type="text"
// // //         placeholder="Author"
// // //         value={filterData.author}
// // //         onChange={(e) => handleChange("author", e.target.value)}
// // //       />

// // //       <input
// // //         type="text"
// // //         placeholder="Title"
// // //         value={filterData.title}
// // //         onChange={(e) => handleChange("title", e.target.value)}
// // //       />

// // //       {/* Multi-select dropdowns */}
// // //       <Select
// // //         isMulti
// // //         options={genres.map((g) => ({ value: g.id, label: g.name }))} // ✅ Corrected type
// // //         value={genres
// // //           .filter((g) => filters.genres.includes(g.id))
// // //           .map((g) => ({ value: g.id, label: g.name }))}
// // //         onChange={(selected) =>
// // //           handleChange(
// // //             "genres",
// // //             selected.map((s) => s.value)
// // //           )
// // //         }
// // //         placeholder="Select Genres"
// // //       />

// // //       <Select
// // //         isMulti
// // //         options={languages.map((lang) => ({ value: lang, label: lang }))} // ✅ Corrected type
// // //         value={languages
// // //           .filter((lang) => filters.languages.includes(lang))
// // //           .map((lang) => ({ value: lang, label: lang }))}
// // //         onChange={(selected) =>
// // //           handleChange(
// // //             "languages",
// // //             selected.map((s) => s.value)
// // //           )
// // //         }
// // //         placeholder="Select Languages"
// // //       />

// // //       <Select
// // //         isMulti
// // //         options={keywords.map((k) => ({ value: k, label: k }))} // ✅ Corrected type
// // //         value={keywords
// // //           .filter((k) => filters.keywords.includes(k))
// // //           .map((k) => ({ value: k, label: k }))}
// // //         onChange={(selected) =>
// // //           handleChange(
// // //             "keywords",
// // //             selected.map((s) => s.value)
// // //           )
// // //         }
// // //         placeholder="Select Keywords"
// // //       />

// // //       <button onClick={() => onFilter(filterData)}>Filter</button>
// // //     </div>
// // //   );
// // // };

// // // export default BookFilter;
// // import React from "react";
// // import Select from "react-select";

// // interface BookFilterProps {
// //   filters: {
// //     title: string;
// //     author: string;
// //     genres: number[];
// //     languages: string[];
// //     keywords: string[];
// //   };
// //   onFilter: (filters: BookFilterProps["filters"]) => void;
// //   genres: { id: number; name: string }[];
// //   languages: string[];
// //   keywords: string[];
// // }

// // const BookFilter: React.FC<BookFilterProps> = ({
// //   filters,
// //   onFilter,
// //   genres,
// //   languages,
// //   keywords,
// // }) => {
// //   const handleChange = (field: keyof typeof filters, value: any) => {
// //     onFilter({ ...filters, [field]: value });
// //   };

// //   return (
// //     <div className="book-filter">
// //       <input
// //         type="text"
// //         placeholder="Search by title..."
// //         value={filters.title}
// //         onChange={(e) => handleChange("title", e.target.value)}
// //       />
// //       <input
// //         type="text"
// //         placeholder="Search by author..."
// //         value={filters.author}
// //         onChange={(e) => handleChange("author", e.target.value)}
// //       />

// //       <Select
// //         isMulti
// //         options={genres.map((g) => ({ value: g.id, label: g.name }))}
// //         value={genres
// //           .filter((g) => filters.genres.includes(g.id))
// //           .map((g) => ({ value: g.id, label: g.name }))}
// //         onChange={(selected) =>
// //           handleChange(
// //             "genres",
// //             selected.map((s) => s.value)
// //           )
// //         }
// //         placeholder="Select Genres"
// //       />

// //       <Select
// //         isMulti
// //         options={languages.map((lang) => ({ value: lang, label: lang }))}
// //         value={languages
// //           .filter((lang) => filters.languages.includes(lang))
// //           .map((lang) => ({ value: lang, label: lang }))}
// //         onChange={(selected) =>
// //           handleChange(
// //             "languages",
// //             selected.map((s) => s.value)
// //           )
// //         }
// //         placeholder="Select Languages"
// //       />

// //       <Select
// //         isMulti
// //         options={keywords.map((k) => ({ value: k, label: k }))}
// //         value={keywords
// //           .filter((k) => filters.keywords.includes(k))
// //           .map((k) => ({ value: k, label: k }))}
// //         onChange={(selected) =>
// //           handleChange(
// //             "keywords",
// //             selected.map((s) => s.value)
// //           )
// //         }
// //         placeholder="Select Keywords"
// //       />
// //     </div>
// //   );
// // };

// // export default BookFilter;
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import debounce from "lodash.debounce"; // ✅ Import debounce

// interface BookFilterProps {
//   filters: {
//     title: string;
//     author: string;
//     genres: number[];
//     languages: string[];
//     keywords: string[];
//   };
//   onFilter: (filters: BookFilterProps["filters"]) => void;
//   genres: { id: number; name: string }[];
//   languages: string[];
//   keywords: string[];
// }

// const BookFilter: React.FC<BookFilterProps> = ({
//   filters,
//   onFilter,
//   genres,
//   languages,
//   keywords,
// }) => {
//   // ✅ Local state to hold input values temporarily
//   const [title, setTitle] = useState(filters.title);
//   const [author, setAuthor] = useState(filters.author);

//   // ✅ Debounce function (waits 500ms after user stops typing)
//   const debounceFilter = debounce((newFilters) => {
//     onFilter(newFilters);
//   }, 1000);

//   // ✅ Sync local state with global state (useEffect ensures filters persist)
//   useEffect(() => {
//     setTitle(filters.title);
//     setAuthor(filters.author);
//   }, [filters.title, filters.author]);

//   // ✅ Handle typing for title & author fields
//   const handleInputChange = (field: "title" | "author", value: string) => {
//     if (field === "title") setTitle(value);
//     if (field === "author") setAuthor(value);

//     debounceFilter({ ...filters, [field]: value });
//   };

//   const handleSelectChange = (field: keyof typeof filters, value: any) => {
//     onFilter({ ...filters, [field]: value });
//   };

//   return (
//     <div className="book-filter">
//       <input
//         type="text"
//         placeholder="Search by title..."
//         value={title}
//         onChange={(e) => handleInputChange("title", e.target.value)} // ✅ Debounced input
//       />
//       <input
//         type="text"
//         placeholder="Search by author..."
//         value={author}
//         onChange={(e) => handleInputChange("author", e.target.value)} // ✅ Debounced input
//       />

//       <Select
//         isMulti
//         options={genres.map((g) => ({ value: g.id, label: g.name }))}
//         value={genres
//           .filter((g) => filters.genres.includes(g.id))
//           .map((g) => ({ value: g.id, label: g.name }))}
//         onChange={(selected) =>
//           handleSelectChange(
//             "genres",
//             selected.map((s) => s.value)
//           )
//         }
//         placeholder="Select Genres"
//       />

//       <Select
//         isMulti
//         options={languages.map((lang) => ({ value: lang, label: lang }))}
//         value={languages
//           .filter((lang) => filters.languages.includes(lang))
//           .map((lang) => ({ value: lang, label: lang }))}
//         onChange={(selected) =>
//           handleSelectChange(
//             "languages",
//             selected.map((s) => s.value)
//           )
//         }
//         placeholder="Select Languages"
//       />

//       <Select
//         isMulti
//         options={keywords.map((k) => ({ value: k, label: k }))}
//         value={keywords
//           .filter((k) => filters.keywords.includes(k))
//           .map((k) => ({ value: k, label: k }))}
//         onChange={(selected) =>
//           handleSelectChange(
//             "keywords",
//             selected.map((s) => s.value)
//           )
//         }
//         placeholder="Select Keywords"
//       />
//     </div>
//   );
// };

// export default BookFilter;
import React, { useState, useEffect } from "react";
import Select from "react-select";

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
  // ✅ Keep local state for text fields (prevents re-render on every keystroke)
  const [title, setTitle] = useState(filters.title);
  const [author, setAuthor] = useState(filters.author);

  // ✅ Sync local state with global filters when filters change (important for persisting state)
  useEffect(() => {
    setTitle(filters.title);
    setAuthor(filters.author);
  }, [filters.title, filters.author]);

  // ✅ Update filter only when user **finishes typing** (onBlur or Enter key)
  const applyFilter = (field: "title" | "author", value: string) => {
    onFilter({ ...filters, [field]: value });
  };

  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Search by title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)} // ✅ Only updates local state
        onBlur={() => applyFilter("title", title)} // ✅ Apply filter when input loses focus
        onKeyDown={(e) => e.key === "Enter" && applyFilter("title", title)} // ✅ Apply on Enter
      />

      <input
        type="text"
        placeholder="Search by author..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)} // ✅ Only updates local state
        onBlur={() => applyFilter("author", author)} // ✅ Apply filter when input loses focus
        onKeyDown={(e) => e.key === "Enter" && applyFilter("author", author)} // ✅ Apply on Enter
      />

      <Select
        isMulti
        options={genres.map((g) => ({ value: g.id, label: g.name }))}
        value={genres
          .filter((g) => filters.genres.includes(g.id))
          .map((g) => ({ value: g.id, label: g.name }))}
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
        value={languages
          .filter((lang) => filters.languages.includes(lang))
          .map((lang) => ({ value: lang, label: lang }))}
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
        value={keywords
          .filter((k) => filters.keywords.includes(k))
          .map((k) => ({ value: k, label: k }))}
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
