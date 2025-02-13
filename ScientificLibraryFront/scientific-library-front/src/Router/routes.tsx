import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookListPage from "../Pages/BookListPage/BookList";
import Header from "../Components/Header/Header";
import BookPage from "../Pages/BookPage/BookPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterReader from "../Pages/RegisterPage/RegisterReader";
import RegisterPublisher from "../Pages/RegisterPage/RegisterPublisher";
import SidebarMenu from "../Components/Sidebar/Sidebar";
import ResetPassword from "../Pages/ResetPasswordPage/ResetPassword";
import AddBookPage from "../Pages/BookCreationPage/AddBookPage";
import PendingBooksPage from "../Pages/Publisher/PendingBooksPage";
import ApprovedBooksPage from "../Pages/Publisher/PublishedBooksPage";
import RejectedBooksPage from "../Pages/Publisher/RejectedBooksPage";
import "../App.css";

const books = [
  {
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    image: "https://images-na.ssl-images-amazon.com/images/I/81WcnNQ-TBL.jpg",
    rating: 4,
    summary:
      "Readers of all ages and walks of life have drawn inspiration and empowerment from Elizabeth Gilbert’s books.",
    voters: 1987,
  },
  {
    title: "Ten Thousand Skies Above You",
    author: "Claudia Gray",
    image:
      "https://i.pinimg.com/originals/a8/b9/ff/a8b9ff74ed0f3efd97e09a7a0447f892.jpg",
    rating: 5,
    summary:
      "The hunt for each splinter of Paul's soul sends Marguerite racing through a war-torn San Francisco.",
    voters: 1500,
  },
];

const authors = [
  {
    name: "Sebastian Jeremy",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Jonathan Doe",
    image:
      "https://images.unsplash.com/photo-1586297098710-0382a496c814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
  },
];

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Header />

      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar Component */}
        <SidebarMenu />

        {/* Main Content (Routes) */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<BookListPage />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register/reader" element={<RegisterReader />} />
            <Route path="/register/publisher" element={<RegisterPublisher />} />
            <Route path="/pending" element={<PendingBooksPage />} />{" "}
            <Route path="/rejected" element={<RejectedBooksPage />} />{" "}
            <Route path="/published" element={<ApprovedBooksPage />} />{" "}
            {/* ✅ New Route */}
            <Route path="/add-book" element={<AddBookPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
