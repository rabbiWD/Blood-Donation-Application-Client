import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
// import useAuth from "../../hooks/useAuth";
// import { Link, useNavigate } from "react-router-dom";

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
        `http://localhost:3000/my-donation-request/${user.email}?limit=3`
      );
      setRecentRequests(res.data);
    } catch (error) {
      console.error("Error fetching recent requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change (Done / Cancel)
  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;

    try {
      await axios.patch(`http://localhost:3000/donation-request/${id}/status`, {
        status: newStatus,
      });
      // Update local state
      setRecentRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request? This action cannot be undone.")) return;

    try {
      await axios.delete(`http://localhost:3000/donation-request/${id}`);
      setRecentRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600">
          Welcome back, {user?.displayName || "Donor"}! 🩸
        </h1>
        <p className="text-xl text-gray-600 mt-4">
          Thank you for being a lifesaver.
        </p>
      </div>

      {/* Recent Donation Requests Section */}
      {recentRequests.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Your Recent Donation Requests (Latest 3)
          </h2>

          <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl">
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
                          req.status === "pending" ? "badge-warning" :
                          req.status === "inprogress" ? "badge-info" :
                          req.status === "done" ? "badge-success" :
                          "badge-error"
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

          {/* View All Button */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/dashboard/my-donation-request")}
              className="btn btn-lg btn-primary"
            >
              View All My Requests
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">
            You haven't created any donation requests yet.
          </p>
          <Link to="/dashboard/create-request">
            <button className="btn btn-primary btn-lg mt-6">
              Create Your First Request
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;