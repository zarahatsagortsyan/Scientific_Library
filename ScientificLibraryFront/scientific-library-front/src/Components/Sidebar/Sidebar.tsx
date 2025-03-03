import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";
import { MdOutlinePlaylistAdd } from "react-icons/md";

// Utility function to get user roles
const getUserRoles = (): string[] | null => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    const roles =
      decodedToken[
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

  useEffect(() => {
    const roles = getUserRoles();
    setUserRole(roles);
  }, []);

  if (userRole == null) return null;

  return (
    <div className="sidebar-container">
      <Sidebar>
        <Menu>
          {/* Reader Links */}
          {userRole?.includes("Reader") && (
            <>
              <MenuItem component={<Link to="/to-read" />}>📖 To Read</MenuItem>
              <MenuItem component={<Link to="/reading" />}>📚 Reading</MenuItem>
              <MenuItem component={<Link to="/read" />}>✅ Read</MenuItem>
              <MenuItem component={<Link to="/my-reviews" />}>
                📝 My Reviews
              </MenuItem>
              <MenuItem component={<Link to="/profile" />}>Profile</MenuItem>
            </>
          )}

          {/* Publisher Links */}
          {userRole?.includes("Publisher") && (
            <>
              <MenuItem component={<Link to="/add-book" />}>
                ➕ Add New Book
              </MenuItem>
              <MenuItem component={<Link to="/published" />}>
                📚 Published Books
              </MenuItem>
              <MenuItem component={<Link to="/rejected" />}>
                ❌ Rejected Books
              </MenuItem>
              <MenuItem component={<Link to="/pending" />}>
                🕒 Pending Approval
              </MenuItem>
              <MenuItem component={<Link to="/profile" />}>Profile</MenuItem>
            </>
          )}

          {/* Admin Links */}
          {userRole?.includes("Admin") && (
            <>
              <MenuItem component={<Link to="/admin-approved" />}>
                ✔️ Approved Books
              </MenuItem>
              <MenuItem component={<Link to="/admin-rejected" />}>
                ❌ Rejected Books
              </MenuItem>
              <MenuItem component={<Link to="/pending-approval" />}>
                ⏳ Pending Approval
              </MenuItem>
              <MenuItem component={<Link to="/readers-list" />}>
                👥 Readers
              </MenuItem>
              <MenuItem component={<Link to="/publishers-list" />}>
                🖋️ Publishers
              </MenuItem>

              <MenuItem component={<Link to="/genre-list" />}>
                <MdOutlinePlaylistAdd />
                Genres
              </MenuItem>
            </>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMenu;
