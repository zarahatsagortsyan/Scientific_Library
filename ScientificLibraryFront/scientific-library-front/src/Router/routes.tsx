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
import AdminPendingPage from "../Pages/Admin/Books/AdminPendingBooksPage";
import PublishersListPage from "../Pages/Admin/Users/PublishersListPage";
import AdminRejectedBooksPage from "../Pages/Admin/Books/AdminRejectedBooksPage";
import AdminApprovedBooksPage from "../Pages/Admin/Books/AdminApprovedBooksPage";
import ReadersListPage from "../Pages/Admin/Users/ReadersListPage";
import GenresListPage from "../Pages/Admin/Genres/GenreListPage";
import ReaderToReadList from "../Pages/Reader/ToReadListPage";
import ReaderReadingList from "../Pages/Reader/ReadingListPage";
import ReaderReadList from "../Pages/Reader/ReadListPage";
import ReaderReviewsPage from "../Pages/Reader/ReviewsPage";

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
            <Route path="/book/:bookId" element={<BookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register/reader" element={<RegisterReader />} />
            <Route path="/register/publisher" element={<RegisterPublisher />} />
            <Route path="/pending" element={<PendingBooksPage />} />{" "}
            <Route path="/rejected" element={<RejectedBooksPage />} />{" "}
            <Route path="/published" element={<ApprovedBooksPage />} />{" "}
            <Route path="/pending-approval" element={<AdminPendingPage />} />{" "}
            <Route path="/publishers-list" element={<PublishersListPage />} />{" "}
            <Route path="/readers-list" element={<ReadersListPage />} />{" "}
            <Route path="/to-read" element={<ReaderToReadList />} />{" "}
            <Route path="/reading" element={<ReaderReadingList />} />{" "}
            <Route path="/read" element={<ReaderReadList />} />{" "}
            <Route path="/my-reviews" element={<ReaderReviewsPage />} />{" "}
            <Route
              path="/admin-rejected"
              element={<AdminRejectedBooksPage />}
            />{" "}
            <Route
              path="/admin-approved"
              element={<AdminApprovedBooksPage />}
            />{" "}
            <Route path="/genre-list" element={<GenresListPage />} />{" "}
            {/* ✅ New Route */}
            <Route path="/add-book" element={<AddBookPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
