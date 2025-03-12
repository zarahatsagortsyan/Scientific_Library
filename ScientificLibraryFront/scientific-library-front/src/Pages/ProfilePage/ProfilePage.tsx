import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./ProfilePage.css";
import api from "../../api/api";

interface Profile {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const userRole =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setRole(userRole);

        const apiUrl =
          userRole === "Reader"
            ? `${import.meta.env.VITE_API_URL}/reader/profile/${userId}`
            : `${import.meta.env.VITE_API_URL}/publisher/profile/${userId}`;

        const response = await api.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data.success) {
          setProfile(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to retrieve profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl =
        role === "Reader"
          ? `${import.meta.env.VITE_API_URL}/reader/profile/update`
          : `${import.meta.env.VITE_API_URL}/publisher/profile/update`;

      const response = await api.put(apiUrl, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data.success) {
        alert("Profile updated successfully!");
        setEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  if (loading) return <div className="loader">⏳ Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {role === "Reader" ? (
        <>
          <p>
            <strong>First Name:</strong>{" "}
            {editing ? (
              <input
                type="text"
                value={profile?.firstName || ""}
                onChange={(e) =>
                  setProfile({ ...profile!, firstName: e.target.value })
                }
              />
            ) : (
              profile?.firstName
            )}
          </p>
          <p>
            <strong>Last Name:</strong>{" "}
            {editing ? (
              <input
                type="text"
                value={profile?.lastName || ""}
                onChange={(e) =>
                  setProfile({ ...profile!, lastName: e.target.value })
                }
              />
            ) : (
              profile?.lastName
            )}
          </p>
        </>
      ) : (
        <p>
          <strong>Company Name:</strong> {""}
          {editing ? (
            <input
              type="text"
              value={profile?.companyName || ""}
              onChange={(e) =>
                setProfile({ ...profile!, companyName: e.target.value })
              }
            />
          ) : (
            profile?.companyName
          )}
        </p>
      )}
      <p>
        <strong>Email:</strong> {profile?.email}
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        {editing ? (
          <input
            type="text"
            value={profile?.phone || ""}
            onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
          />
        ) : (
          profile?.phone
        )}
      </p>

      {editing ? (
        <button className="save-button" onClick={handleUpdateProfile}>
          Save Changes
        </button>
      ) : (
        <button className="edit-button" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
