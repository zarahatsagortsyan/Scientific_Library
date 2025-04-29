import { Book } from "../Models/Book";
import { useNavigate } from "react-router-dom";

export const handleImageClick = (book: Book) => {
    
    const navigate = useNavigate();
    navigate(`/book/${book.id}`, { state: { book } });
};
