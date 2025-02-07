import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";

// Utility function to extract roles
const getUserRoles = (): string[] | null => {
  const token = localStorage.getItem("jwtToken"); // Get the JWT token from localStorage
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token); // Decode the JWT token
    const roles =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    return roles ? [roles] : null; // Ensure it returns an array
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};

const SidebarMenu: React.FC = () => {
  const [userRole, setUserRole] = useState<string[] | null>(null); // Store user roles as an array
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(
    window.matchMedia("(max-width: 800px)").matches
  );

  // Use useEffect to update userRole only once
  useEffect(() => {
    const roles = getUserRoles(); // Get roles from the token
    setUserRole(roles); // Update the state with the roles array
  }, []); // Empty dependency array ensures this runs only once when the component mounts
  if (userRole == null) {
    return;
  }

  return (
    <div style={{ display: "flex", height: "100%", minHeight: "400px" }}>
      <Sidebar>
        <Menu>
          {/* Conditionally render menu items based on roles */}
          {userRole?.includes("Reader") && (
            <>
              <MenuItem component={<Link to="/to-read" />}>To Read</MenuItem>
              <MenuItem component={<Link to="/reading" />}>Reading</MenuItem>
              <MenuItem component={<Link to="/read" />}>Read</MenuItem>
              <MenuItem component={<Link to="/my-reviews" />}>
                My Reviews
              </MenuItem>
            </>
          )}
          {userRole?.includes("Publisher") && (
            <>
              <MenuItem component={<Link to="/published" />}>
                Published
              </MenuItem>
              <MenuItem component={<Link to="/rejected" />}>Rejected</MenuItem>
              <MenuItem component={<Link to="/pending-approval" />}>
                Pending Approval
              </MenuItem>
            </>
          )}

          {userRole?.includes("Admin") && (
            <>
              <MenuItem component={<Link to="/approved" />}>Approved</MenuItem>
              <MenuItem component={<Link to="/rejected" />}>Rejected</MenuItem>
              <MenuItem component={<Link to="/pending-approval" />}>
                Pending Approval
              </MenuItem>
              <MenuItem component={<Link to="/readers" />}>Readers</MenuItem>
              <MenuItem component={<Link to="/publishers" />}>
                Publishers
              </MenuItem>
            </>
          )}
        </Menu>
      </Sidebar>
      <main style={{ padding: 10 }}>
        <div>
          {broken && (
            <button className="sb-button" onClick={() => setToggled(!toggled)}>
              Toggle
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SidebarMenu;
