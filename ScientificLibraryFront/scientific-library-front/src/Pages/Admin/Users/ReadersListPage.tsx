// export default ReadersListPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../../Models/User";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/api";

const ReadersListPage: React.FC = () => {
  const [readers, setReaders] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchReaders = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/users/readers/active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReaders(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch readers:", err);
      setError("Failed to fetch readers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
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
      setReaders((prev) =>
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
      setReaders((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, banned: false } : user
        )
      );
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const filteredReaders = readers.filter(
    (reader) =>
      reader.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Readers Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by First/Last name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReaders.map((reader) => (
            <tr key={reader.id}>
              <td>{reader.firstName}</td>
              <td>{reader.lastName}</td>
              <td>{reader.email}</td>
              <td>{reader.type}</td>
              <td>{reader.banned ? "Banned" : "Active"}</td>
              <td>
                {reader.banned ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleUnbanUser(reader.id)}
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleBanUser(reader.id)}
                  >
                    Ban
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

export default ReadersListPage;
