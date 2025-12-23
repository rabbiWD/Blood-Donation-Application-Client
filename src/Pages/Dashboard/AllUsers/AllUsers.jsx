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
    if (!email || isCurrentUser(email)) {
      toast.error(!email ? "Invalid user email!" : "You cannot block/unblock yourself!");
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
    if (!email || isCurrentUser(email)) {
      toast.error(!email ? "Invalid user email!" : "You cannot change your own role!");
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-6 sm:mb-8 text-center">
        All Users Management 👤
      </h1>

      {/* Filter */}
      <div className="mb-6 sm:mb-8 flex justify-center sm:justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full max-w-xs rounded-xl"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="blocked">Blocked Users</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto bg-base-100 shadow-xl rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-red-50 text-base lg:text-lg">
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
                <td colSpan="7" className="text-center py-16 text-gray-500 text-xl">
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
                        <div className="w-12 rounded-full ring ring-red-200 ring-offset-2">
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
                  <td className="font-mono text-sm">{u.email}</td>
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
                        {!u.email && (
                          <li>
                            <span className="text-error px-4 py-2">
                              Action Disabled (No Email)
                            </span>
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

      {/* Mobile & Tablet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
        {currentUsers.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500 text-xl">
            No users found
          </div>
        ) : (
          currentUsers.map((u, index) => (
            <div
              key={u.email}
              className="bg-base-100 shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {u.photoURL ? (
                    <div className="avatar">
                      <div className="w-16 rounded-full ring ring-red-200 ring-offset-2">
                        <img src={u.photoURL} alt={u.name || "User"} />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-16">
                        <span className="text-2xl">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{u.name || "N/A"}</h3>
                  <p className="text-sm text-gray-600 font-mono truncate max-w-[200px]">
                    {u.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
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
                    <span
                      className={`badge badge-lg ${
                        u.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="dropdown dropdown-end w-full">
                  <label tabIndex={0} className="btn btn-block btn-ghost justify-start">
                    <span>Actions</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full z-50"
                  >
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
                    {!u.email && (
                      <li>
                        <span className="text-error">Action Disabled (No Email)</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <button
            className="btn btn-outline btn-error"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-sm sm:text-base font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline btn-error"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;