import { Book } from "../Models/Book";
import { useNavigate } from "react-router-dom";
// import { toggleBookAvailability } from "./BookAvailability";
// import { useState } from "react";

export const handleImageClick = (book: Book) => {
    
    const navigate = useNavigate();
    navigate(`/book/${book.id}`, { state: { book } });
};
// const [books, setBooks] = useState<Book[]>([]);
  // const handleToggleAvailability = async (book: Book) => {
  //   const updatedBook = await toggleBookAvailability(book);
  //   if (updatedBook) {
  //     setBooks((prevBooks) =>
  //       prevBooks.map((b) =>
  //         b.id === updatedBook.id
  //           ? { ...b, isAvailable: updatedBook.isAvailable }
  //           : b
  //       )
  //     );
  //   }
  // };