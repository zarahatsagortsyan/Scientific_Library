// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useTable, useSortBy, useGlobalFilter, Column } from "react-table";
// import api from "../../../api/api";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   isActive: number;
//   banned: boolean;
// }

// const PublishersListPage: React.FC = () => {
//   const [publishers, setPublishers] = useState<User[]>([]);
//   const [publishers, setPublishers] = useState<User[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const publishersResponse = await api.get(
//           import.meta.env.VITE_API_URL + "/users/publishers/active"
//         );
//         const publishersResponse = await axios.get(
//           import.meta.env.VITE_API_URL + "/api/users/publishers/active"
//         );
//         setPublishers(publishersResponse.data);
//         setPublishers(publishersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleBanUser = async (userId: string) => {
//     try {
//       await axios.put(`/api/users/${userId}/ban`);
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, isActive: 99 } : user
//         )
//       );
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, isActive: 99 } : user
//         )
//       );
//     } catch (error) {
//       console.error("Failed to ban user:", error);
//     }
//   };

//   const handleUnbanUser = async (userId: string) => {
//     try {
//       await axios.put(`/api/users/${userId}/unban`);
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, isActive: 1 } : user
//         )
//       );
//       setPublishers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, isActive: 1 } : user
//         )
//       );
//     } catch (error) {
//       console.error("Failed to unban user:", error);
//     }
//   };

//   const columns: Column<User>[] = [
//     { Header: "Name", accessor: "name" },
//     { Header: "Email", accessor: "email" },
//     {
//       Header: "Status",
//       accessor: "isActive",
//       Cell: ({ value }: { value: number }) =>
//         value === 99 ? "Banned" : "Active",
//     },
//     {
//       Header: "Actions",
//       accessor: "id",
//       Cell: ({ row }: { row: { original: User } }) => (
//         <div>
//           {row.original.isActive === 99 ? (
//             <button
//               className="bg-green-500 text-white p-2"
//               onClick={() => handleUnbanUser(row.original.id)}
//             >
//               Unban
//             </button>
//           ) : (
//             <button
//               className="bg-red-500 text-white p-2"
//               onClick={() => handleBanUser(row.original.id)}
//             >
//               Ban
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable<User>({ columns, data: [...publishers, ...publishers] }, useSortBy);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl mb-4">Admin User Management</h1>
//       <table {...getTableProps()} className="min-w-full bg-white border">
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()} className="px-4 py-2 border">
//                   {column.render("Header")}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => (
//                   <td {...cell.getCellProps()} className="px-4 py-2 border">
//                     {cell.render("Cell")}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PublishersListPage;
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { useTable, useSortBy, Column } from "react-table";
// import api from "../../../api/api";
// import { jwtDecode } from "jwt-decode";

// // Define the User interface to match the API response
// export interface User {
//   id: string;
//   userName: string;
//   email: string;
//   type: string; // 'Reader' or 'Publisher' or 'Admin'
//   banned: boolean;
//   createdDate: string; // ISO date string
//   birthDate: string; // ISO date string
// }

// const PublishersListPage: React.FC = () => {
//   const [publishers, setPublishers] = useState<User[]>([]);
//   const [publishers, setPublishers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         setError("Authentication required.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const decodedToken: any = jwtDecode(token);
//         const userId =
//           decodedToken[
//             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//           ];
//         const response = await api.get(
//           `${import.meta.env.VITE_API_URL}/users/publishers/active`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.status === 200 && response.data.success) {
//           setPublishers(response.data.data);
//         } else {
//           setError(response.data.message || "Failed to fetch materials.");
//         }
//       } catch (error) {
//         console.error("Error fetching materials:", error);
//         setError("Failed to retrieve data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleBanUser = async (userId: string) => {
//     // try {
//     //   await axios.put(`/api/users/${userId}/ban`);
//     //   setPublishers((prev) =>
//     //     prev.map((user) =>
//     //       user.id === userId ? { ...user, banned: true } : user
//     //     )
//     //   );
//     //   setPublishers((prev) =>
//     //     prev.map((user) =>
//     //       user.id === userId ? { ...user, banned: true } : user
//     //     )
//     //   );
//     // } catch (error) {
//     //   console.error("Failed to ban user:", error);
//     // }
//   };

//   const handleUnbanUser = async (userId: string) => {
//     // try {
//     //   await axios.put(`/api/users/${userId}/unban`);
//     //   setPublishers((prev) =>
//     //     prev.map((user) =>
//     //       user.id === userId ? { ...user, banned: false } : user
//     //     )
//     //   );
//     //   setPublishers((prev) =>
//     //     prev.map((user) =>
//     //       user.id === userId ? { ...user, banned: false } : user
//     //     )
//     //   );
//     // } catch (error) {
//     //   console.error("Failed to unban user:", error);
//     // }
//   };

//   const columns: Column<User>[] = [
//     { Header: "Name", accessor: "userName" },
//     { Header: "Email", accessor: "email" },
//     { Header: "User Type", accessor: "type" },
//     {
//       Header: "Status",
//       accessor: "banned",
//       Cell: ({ value }: { value: boolean }) =>
//         value === true ? "Banned" : "Active",
//     },
//     {
//       Header: "Actions",
//       accessor: "id",
//       Cell: ({ row }: { row: { original: User } }) => (
//         <div>
//           {row.original.banned === true ? (
//             <button
//               className="bg-green-500 text-white p-2"
//               onClick={() => handleUnbanUser(row.original.id)}
//             >
//               Unban
//             </button>
//           ) : (
//             <button
//               className="bg-red-500 text-white p-2"
//               onClick={() => handleBanUser(row.original.id)}
//             >
//               Ban
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable<User>({ columns, data: [...publishers, ...publishers] }, useSortBy);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="p-4">
//       <h1>asdasd</h1>
//       <h1 className="text-2xl mb-4">Admin User Management</h1>
//       <table {...getTableProps()} className="min-w-full bg-white border">
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()} className="px-4 py-2 border">
//                   {column.render("Header")}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>

//         <tbody {...getTableBodyProps()}>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => (
//                   <td {...cell.getCellProps()} className="px-4 py-2 border">
//                     {cell.render("Cell")}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PublishersListPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
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
      reader.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
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
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPublishers.map((reader) => (
            <tr key={reader.id}>
              <td>{reader.userName}</td>
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

export default PublishersListPage;
