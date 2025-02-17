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
import AdminPendingPage from "../Pages/Admin/AdminPendingBooksPage";

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
            {/* ✅ New Route */}
            <Route path="/add-book" element={<AddBookPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
