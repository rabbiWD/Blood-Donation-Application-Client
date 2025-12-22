import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const AllUsers = () => {
  const { user: currentUser } = useAuth();
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
      const res = await axios.get(
        "https://blood-donation-application-server-phi.vercel.app/all-users"
      );
      const allUsers = Array.isArray(res.data) ? res.data : [];
      // ফিল্টার করো যাতে শুধু valid email যুক্ত ইউজার থাকে
      const validUsers = allUsers.filter((u) => u.email && typeof u.email === "string");
      setUsers(validUsers);
      setFilteredUsers(validUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
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
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const isCurrentUser = (email) => currentUser?.email === email;

  const handleStatusChange = async (email, newStatus) => {
    if (!email) {
      toast.error("Invalid user email!");
      return;
    }
    if (isCurrentUser(email)) {
      toast.error("You cannot block/unblock yourself!");
      return;
    }

    try {
      await axios.patch(
        `https://blood-donation-application-server-phi.vercel.app/users/${email}`,
        { status: newStatus }
      );
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    if (!email) {
      toast.error("Invalid user email!");
      return;
    }
    if (isCurrentUser(email)) {
      toast.error("You cannot change your own role!");
      return;
    }

    try {
      await axios.patch(
        `https://blood-donation-application-server-phi.vercel.app/users/${email}`,
        { role: newRole }
      );
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
              <th>#</th>
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
                <td colSpan="7" className="text-center py-12 text-gray-500 text-xl">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((u, index) => (
                <tr key={u.email} className="hover">
                  <td>{indexOfFirst + index + 1}</td>
                  <td>
                    {u.photoURL ? (
                      <div className="avatar">
                        <div className="w-12 rounded-full ring ring-red-200 ring-offset-base-100 ring-offset-2">
                          <img src={u.photoURL} alt={u.name || "User"} />
                        </div>
                      </div>
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
                  <td className="font-mono text-sm">
                    {u.email || <span className="text-error font-bold">Missing Email!</span>}
                  </td>
                  <td>
                    <span
                      className={`badge badge-lg ${
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
                      className={`badge badge-lg ${
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
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
                      >
                        {/* Block/Unblock - শুধু valid email থাকলে দেখাবে */}
                        {u.email && (
                          <>
                            {u.status === "active" ? (
                              <li>
                                <button
                                  onClick={() => handleStatusChange(u.email, "blocked")}
                                  className="text-error"
                                  disabled={isCurrentUser(u.email)}
                                >
                                  Block User
                                </button>
                              </li>
                            ) : (
                              <li>
                                <button
                                  onClick={() => handleStatusChange(u.email, "active")}
                                  className="text-success"
                                  disabled={isCurrentUser(u.email)}
                                >
                                  Unblock User
                                </button>
                              </li>
                            )}

                            {u.role !== "volunteer" && (
                              <li>
                                <button
                                  onClick={() => handleRoleChange(u.email, "volunteer")}
                                  disabled={isCurrentUser(u.email)}
                                >
                                  Make Volunteer
                                </button>
                              </li>
                            )}

                            {u.role !== "admin" && (
                              <li>
                                <button
                                  onClick={() => handleRoleChange(u.email, "admin")}
                                  className="text-primary font-medium"
                                  disabled={isCurrentUser(u.email)}
                                >
                                  Make Admin
                                </button>
                              </li>
                            )}
                          </>
                        )}

                        {/* যদি email না থাকে */}
                        {!u.email && (
                          <li>
                            <span className="text-error px-4 py-2">Action Disabled (No Email)</span>
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

      {/* Pagination (আগের মতোই রাখলাম - কাজ করছে) */}
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

            <button
              className={`join-item btn ${currentPage === 1 ? "btn-active" : ""}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>

            {currentPage > 4 && totalPages > 5 && (
              <button className="join-item btn btn-disabled">...</button>
            )}

            {[...Array(totalPages)]
              .slice(Math.max(1, currentPage - 2), Math.min(totalPages - 1, currentPage + 2))
              .map((_, i) => {
                const page = Math.max(2, currentPage - 2) + i;
                return (
                  <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

            {currentPage < totalPages - 3 && totalPages > 5 && (
              <>
                <button className="join-item btn btn-disabled">...</button>
                <button
                  className={`join-item btn ${currentPage === totalPages ? "btn-active" : ""}`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            {currentPage >= totalPages - 3 && totalPages > 5 && (
              <button
                className={`join-item btn ${currentPage === totalPages ? "btn-active" : ""}`}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}

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