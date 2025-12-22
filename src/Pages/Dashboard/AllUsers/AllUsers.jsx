import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const AllUsers = () => {
  const { user: currentUser } = useAuth(); // current logged in user
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // সার্ভারে নতুন রুট দরকার: /all-users (সব ইউজারের লিস্ট)
      const res = await axios.get("http://localhost:3000/all-users");
      const allUsers = Array.isArray(res.data) ? res.data : [];
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let filtered = users;
    if (filter !== "all") {
      filtered = users.filter((u) => u.status === filter);
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [filter, users]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(indexOfFirst, indexOfLast)
    : [];

  const totalPages = Array.isArray(filteredUsers)
    ? Math.ceil(filteredUsers.length / itemsPerPage)
    : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Change status (block/unblock)
  const handleStatusChange = async (email, newStatus) => {
    if (currentUser?.email === email) {
      toast.error("You cannot block/unblock yourself!");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/users/${email}`, { status: newStatus });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  // Change role
  const handleRoleChange = async (email, newRole) => {
    if (currentUser?.email === email) {
      toast.error("You cannot change your own role!");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/users/${email}`, { role: newRole });
      toast.success(`User role changed to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to change role");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
        All Users Management 👤
      </h1>

      {/* Filter */}
      <div className="mb-8 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="blocked">Blocked Users</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-red-50 text-lg">
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 text-xl">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr key={u.email} className="hover">
                  <td>
                    {u.photoURL ? (
                      <img
                        src={u.photoURL}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                          <span className="text-xl">
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="font-medium">{u.name || "N/A"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin"
                          ? "badge-primary"
                          : u.role === "volunteer"
                          ? "badge-info"
                          : "badge-ghost"
                      }`}
                    >
                      {u.role || "donor"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
                      >
                        {u.status === "active" ? (
                          <li>
                            <button
                              onClick={() => handleStatusChange(u.email, "blocked")}
                              className="text-error"
                            >
                              Block User
                            </button>
                          </li>
                        ) : (
                          <li>
                            <button
                              onClick={() => handleStatusChange(u.email, "active")}
                              className="text-success"
                            >
                              Unblock User
                            </button>
                          </li>
                        )}
                        {u.role !== "volunteer" && u.role !== "admin" && (
                          <li>
                            <button onClick={() => handleRoleChange(u.email, "volunteer")}>
                              Make Volunteer
                            </button>
                          </li>
                        )}
                        {u.role !== "admin" && (
                          <li>
                            <button
                              onClick={() => handleRoleChange(u.email, "admin")}
                              className="text-primary"
                            >
                              Make Admin
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`join-item btn ${currentPage === i + 1 ? "btn-active" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;