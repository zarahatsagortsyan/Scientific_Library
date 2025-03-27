import React, { useEffect, useState } from "react";
import { User } from "../../../Models/User";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/api";

const PublishersListPage: React.FC = () => {
  const [publishers, setPublishers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchPublishers = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/users/publishers/active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPublishers(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch publishers:", err);
      setError("Failed to fetch publishers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    setError("Authentication required.");
    setLoading(false);
    return;
  }
  const handleBanUser = async (userId: string) => {
    try {
      await api.put(
        `${import.meta.env.VITE_API_URL}/users/ban?userId=${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPublishers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, banned: true } : user
        )
      );
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await api.put(
        `${import.meta.env.VITE_API_URL}/users/unban?userId=${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPublishers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, banned: false } : user
        )
      );
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const filteredPublishers = publishers.filter(
    (reader) =>
      reader.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Publishers Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Company Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPublishers.map((reader) => (
            <tr key={reader.id}>
              <td>{reader.companyName}</td>
              <td>{reader.email}</td>
              <td>{reader.type}</td>
              <td>{reader.banned ? "Banned" : "Active"}</td>
              <td>
                {reader.banned ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleUnbanUser(reader.id)}
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleBanUser(reader.id)}
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublishersListPage;
