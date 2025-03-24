
// const BookSortDropdown = ({
//   orderBy,
//   onChange,
// }: {
//   orderBy: string;
//   onChange: (val: string) => void;
// }) => {
//   return (
//     <select
//       value={orderBy}
//       onChange={(e) => onChange(e.target.value)}
//       className="border px-3 py-1 rounded w-25"
//     >
//       <option value="DatePublished">Newest</option>
//       <option value="Rating">Rating</option>
//       <option value="ReadCount">Popularity</option>
//     </select>
//   );
// };

// export default BookSortDropdown;
import './BookSortDropdown.css'
const BookSortDropdown = ({
    orderBy,
    onChange,
  }: {
    orderBy: string;
    onChange: (val: string) => void;
  }) => {
    return (
      <div className="book-sort-wrapper">
        <select
          value={orderBy}
          onChange={(e) => onChange(e.target.value)}
          className="book-sort-select"
        >
          <option value="DatePublished">Newest</option>
          <option value="Rating">Rating</option>
          <option value="ReadCount">Popularity</option>
        </select>
      </div>
    );
  };
  
  export default BookSortDropdown;
  