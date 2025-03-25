import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  MdOutlinePlaylistAdd,
  MdBook,
  MdLibraryBooks,
  MdCheckCircle,
  MdPending,
  MdPeople,
  MdRateReview,
  MdPerson,
  MdAdd,
  MdCancel,
  MdMessage
} from "react-icons/md";
import "./Sidebar.css";
import { useReaderBookCounts } from "../../Utils/UseReaderBookCounts";
import { usePublisherBookCounts } from "../../Utils/UsePublisherBookCounts";
import { useAdminBookCounts } from "../../Utils/UseAdminBookCounts";

// Utility function
const getUserRoles = (): string[] | null => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    const roles = decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
    return roles ? [roles] : null;
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};

const SidebarMenu: React.FC = () => {
  const [userRole, setUserRole] = useState<string[] | null>(null);
  const location = useLocation();
  
  const bookCounts = useReaderBookCounts();
  const publisherCounts = usePublisherBookCounts();
  const adminCounts = useAdminBookCounts();

  useEffect(() => {
    const roles = getUserRoles();
    setUserRole(roles);
  }, []);

  if (!userRole) return null;

  const menuItem = (to: string, icon: React.ReactNode, label: string) => (
    <MenuItem
      component={<Link to={to} />}
      icon={icon}
      className={location.pathname === to ? "active-menu-item" : ""}
    >
      {label}
    </MenuItem>
  );

  return (
    <div className="sidebar-container">
      <Sidebar breakPoint="md" backgroundColor="#1f2937" className="custom-sidebar">
        <Menu>
          {userRole.includes("Reader") && (
            <>
              {menuItem("/to-read", <MdBook />, `To Read (${bookCounts.toRead})`)}
              {menuItem("/reading", <MdLibraryBooks />, `Reading (${bookCounts.reading})`)}
              {menuItem("/read", <MdCheckCircle />, `Read (${bookCounts.read})`)}
              {menuItem("/my-reviews", <MdRateReview />, "My Reviews")}
              {menuItem("/profile", <MdPerson />, "Profile")}
            </>
          )}

          {userRole.includes("Publisher") && (
            <>
              {menuItem("/add-book", <MdAdd />, "Add New Book")}
              {menuItem("/published", <MdLibraryBooks />, `Published (${publisherCounts.approved})`)}
              {menuItem("/rejected", <MdCancel />, `Rejected (${publisherCounts.rejected})`)}
              {menuItem("/pending", <MdPending />, `Pending (${publisherCounts.pending})`)}
              {menuItem("/profile", <MdPerson />, "Profile")}
            </>
          )}

          {userRole.includes("Admin") && (
            <>
              {menuItem("/admin-approved", <MdCheckCircle />, `Approved (${adminCounts.approved})`)}
              {menuItem("/admin-rejected", <MdCancel />, `Rejected (${adminCounts.rejected})`)}
              {menuItem("/pending-approval", <MdPending />, `Pending (${adminCounts.pending})`)}
              {menuItem("/readers-list", <MdPeople />, "Readers")}
              {menuItem("/publishers-list", <MdPeople />, "Publishers")}
              {menuItem("/genre-list", <MdOutlinePlaylistAdd />, "Genres")}
              {menuItem("/keyword-list", <MdOutlinePlaylistAdd />, "Keywords")}
              {menuItem("/messages-list", <MdMessage />, "Messages")}
            </>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMenu;
