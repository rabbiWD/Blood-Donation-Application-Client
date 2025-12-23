import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
// import { Link, useNavigate } from "react-router-dom"; // Fixed import

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchRecentRequests();
    }
  }, [user]);

  const fetchRecentRequests = async () => {
    try {
      const res = await axios.get(
        `https://blood-donation-application-server-phi.vercel.app/my-donation-request/${user.email}?limit=3`
      );
      setRecentRequests(res.data);
    } catch (error) {
      console.error("Error fetching recent requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`))
      return;

    try {
      await axios.patch(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}/status`,
        { status: newStatus }
      );
      setRecentRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this request? This action cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`
      );
      setRecentRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete.");
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
      {/* Welcome Message */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-600">
          Welcome back, {user?.displayName || "Donor"}! 🩸
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4">
          Thank you for being a lifesaver.
        </p>
      </div>

      {/* Recent Requests */}
      {recentRequests.length > 0 ? (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-7 text-gray-800 text-center sm:text-left">
            Your Recent Donation Requests (Latest 3)
          </h2>

          {/* Desktop Table - Hidden on mobile/tablet */}
          <div className="hidden lg:block overflow-x-auto bg-base-100 shadow-xl rounded-xl">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="font-medium">{req.recipientName}</td>
                    <td>{req.upazila}, {req.district}</td>
                    <td>
                      <span className="badge badge-error badge-lg text-white">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td>{new Date(req.donationDate).toLocaleDateString()}</td>
                    <td>{req.donationTime}</td>
                    <td>
                      <span
                        className={`badge badge-lg ${
                          req.status === "pending"
                            ? "badge-warning"
                            : req.status === "inprogress"
                            ? "badge-info"
                            : req.status === "done"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {req.status === "inprogress" && req.donorName ? (
                        <div>
                          <p className="font-medium">{req.donorName}</p>
                          <p className="text-sm text-gray-600">{req.donorEmail}</p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/donation-request/${req._id}`}>
                          <button className="btn btn-sm btn-primary">View</button>
                        </Link>
                        {req.status === "pending" && (
                          <Link to={`/dashboard/edit-request/${req._id}`}>
                            <button className="btn btn-sm btn-warning">Edit</button>
                          </Link>
                        )}
                        {req.status === "pending" && (
                          <button
                            onClick={() => handleDelete(req._id)}
                            className="btn btn-sm btn-error"
                          >
                            Delete
                          </button>
                        )}
                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req._id, "done")}
                              className="btn btn-sm btn-success"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleStatusChange(req._id, "canceled")}
                              className="btn btn-sm btn-error"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
            {recentRequests.map((req) => (
              <div
                key={req._id}
                className="bg-base-100 shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {req.recipientName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {req.upazila}, {req.district}
                    </p>
                  </div>
                  <span className="badge badge-error badge-lg text-white ml-3">
                    {req.bloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <strong>Date:</strong> {new Date(req.donationDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Time:</strong> {req.donationTime}
                  </div>
                </div>

                <div className="mb-4">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge badge-lg ${
                      req.status === "pending"
                        ? "badge-warning"
                        : req.status === "inprogress"
                        ? "badge-info"
                        : req.status === "done"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                {req.status === "inprogress" && req.donorName && (
                  <div className="mb-4 text-sm">
                    <strong>Donor:</strong> {req.donorName} <br />
                    <span className="text-gray-600">{req.donorEmail}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link to={`/donation-request/${req._id}`} className="flex-1">
                    <button className="btn btn-sm btn-primary w-full">View</button>
                  </Link>

                  {req.status === "pending" && (
                    <>
                      <Link to={`/dashboard/edit-request/${req._id}`} className="flex-1">
                        <button className="btn btn-sm btn-warning w-full">Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-sm btn-error flex-1"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {req.status === "inprogress" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(req._id, "done")}
                        className="btn btn-sm btn-success flex-1"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, "canceled")}
                        className="btn btn-sm btn-error flex-1"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => navigate("/dashboard/my-donation-request")}
              className="btn btn-primary btn-wide"
            >
              View All My Requests
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 sm:py-24">
          <p className="text-xl sm:text-2xl text-gray-600 mb-6">
            You haven't created any donation requests yet.
          </p>
          <Link to="/dashboard/create-request">
            <button className="btn btn-primary btn-lg">
              Create Your First Request
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;