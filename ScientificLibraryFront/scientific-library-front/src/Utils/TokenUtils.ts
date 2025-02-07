import { jwtDecode } from "jwt-decode";

interface Token {
  [key: string]: string; // Use string type for claims (like role, email, etc.)
}

export const getUserRole = (): string | null => {
  const token = localStorage.getItem("jwtToken"); // Get the JWT token from localStorage

  if (!token) {
    return null; // Return null if no token exists
  }

  try {
    const decodedToken: Token = jwtDecode(token); // Decode the JWT token
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Extract the role
    console.log(role);
    return role || null; // Return the role if it exists, otherwise return null
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null; // Return null if decoding fails
  }
};
