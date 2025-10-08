import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin/AdminNavbar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (e) {
        console.error(e);
        setError("Network error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40">
        <AdminNavbar />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black mb-4">Users</h1>

        {loading ? (
          <div className="text-gray-700">Loading users...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-2 text-sm text-gray-900 flex items-center gap-2">
                      <img
                        src={u.photo || "https://via.placeholder.com/40"}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {u.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {u.email}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          u.role === "admin" ? "bg-red-600" : "bg-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
