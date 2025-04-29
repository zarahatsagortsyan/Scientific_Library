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
  