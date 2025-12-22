import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

const AllBloodDonationRequest = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    bloodGroup: "",
    district: "",
  });

  const API_BASE =
    import.meta.env.MODE === "production"
      ? "https://blood-donation-application-server-phi.vercel.app"
      : "http://localhost:3000";

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/all-blood-donation-request`, {
        params: {
          page,
          limit: 10,
          status: filters.status || undefined,
          bloodGroup: filters.bloodGroup || undefined,
          district: filters.district.trim() || undefined,
        },
      });

      setRequests(res.data.requests || []);
      setPagination(
        res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRequests: 0,
        }
      );
    } catch (err) {
      toast.error("Failed to load requests");
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
    fetchRequests(newPage);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/donation-requests/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully!");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      await axios.delete(`${API_BASE}/donation-requests/${id}`);
      toast.success("Request deleted successfully");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to delete request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | All Blood Donation Requests</title>
      </Helmet>

      {/* Light Theme Background */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
                All Blood Donation Requests
              </h1>
              <p className="text-xl text-red-100">
                Total: {pagination.totalRequests} request{pagination.totalRequests !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filters */}
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="select select-bordered w-full rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                </select>

                <select
                  value={filters.bloodGroup}
                  onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                  className="select select-bordered w-full rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500"
                >
                  <option value="">All Blood Groups</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search by district (e.g., Dhaka)"
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="input input-bordered w-full rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12">
              {requests.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-3xl text-gray-600">
                    No blood donation requests found with current filters.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="table table-zebra w-full text-lg">
                      <thead>
                        <tr className="bg-red-100 text-left">
                          <th>Recipient</th>
                          <th>Location</th>
                          <th>Date & Time</th>
                          <th>Blood Group</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id} className="hover:bg-red-50 transition-colors">
                            <td>
                              <div className="font-bold text-gray-800">{req.recipientName}</div>
                              <div className="text-sm text-gray-600">
                                by {req.requesterName || "Unknown"}
                              </div>
                            </td>
                            <td>
                              <div className="font-medium">{req.upazila}, {req.district}</div>
                              <div className="text-sm text-gray-600">{req.hospitalName || req.hospital || "N/A"}</div>
                            </td>
                            <td>
                              <div>{new Date(req.donationDate).toLocaleDateString("en-GB")}</div>
                              <div className="text-sm text-gray-600">{req.donationTime}</div>
                            </td>
                            <td>
                              <span className="badge badge-error badge-lg text-white font-bold">
                                {req.bloodGroup}
                              </span>
                            </td>
                            <td>
                              <select
                                value={req.status}
                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                className="select select-bordered select-sm w-full max-w-xs rounded-xl"
                              >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Done</option>
                                <option value="canceled">Canceled</option>
                              </select>
                            </td>
                            <td>
                              <div className="flex gap-3">
                                <Link
                                  to={`/dashboard/request-details/${req._id}`}
                                  className="btn btn-info btn-sm rounded-xl"
                                >
                                  View
                                </Link>
                                {role === "admin" && (
                                  <button
                                    onClick={() => handleDelete(req._id)}
                                    className="btn btn-error btn-sm rounded-xl"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
                    {requests.map((req) => (
                      <div
                        key={req._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-red-100 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                              {req.recipientName}
                            </h3>
                            <p className="text-gray-600">
                              by {req.requesterName || "Unknown"}
                            </p>
                          </div>
                          <span className="badge badge-error badge-lg text-white font-bold">
                            {req.bloodGroup}
                          </span>
                        </div>

                        <div className="space-y-3 text-gray-700">
                          <p>
                            <strong>Location:</strong> {req.upazila}, {req.district}
                          </p>
                          <p>
                            <strong>Hospital:</strong> {req.hospitalName || req.hospital || "N/A"}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(req.donationDate).toLocaleDateString("en-GB")}
                          </p>
                          <p>
                            <strong>Time:</strong> {req.donationTime}
                          </p>
                        </div>

                        <div className="mt-6">
                          <label className="label font-semibold text-gray-700">Status</label>
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="select select-bordered w-full rounded-xl"
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <Link
                            to={`/dashboard/request-details/${req._id}`}
                            className="btn btn-info flex-1 rounded-xl"
                          >
                            View Details
                          </Link>
                          {role === "admin" && (
                            <button
                              onClick={() => handleDelete(req._id)}
                              className="btn btn-error flex-1 rounded-xl"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-6 mt-12">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="btn btn-outline btn-error rounded-xl"
                      >
                        Previous
                      </button>

                      <span className="text-xl font-medium text-gray-700">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="btn btn-outline btn-error rounded-xl"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBloodDonationRequest;