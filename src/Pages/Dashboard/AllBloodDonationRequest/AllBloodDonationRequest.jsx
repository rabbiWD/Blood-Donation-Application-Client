import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
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
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchRequests(newPage);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/donation-request/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully!");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(`${API_BASE}/donation-request/${id}`);
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
        <title>BloodDonation | All Blood Donation Requests</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-8 px-4 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-10 sm:px-8 sm:py-12 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                All Blood Donation Requests
              </h1>
              <p className="text-lg sm:text-xl text-red-100">
                Total: {pagination.totalRequests} request{pagination.totalRequests !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filters - Responsive Grid */}
            <div className="p-6 sm:p-8 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className="input input-bordered w-full rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Requests List */}
            <div className="p-6 sm:p-8 lg:p-12">
              {requests.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-2xl sm:text-3xl text-gray-600 font-medium">
                    No blood donation requests found with current filters.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table - Hidden on mobile/tablet */}
                  <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
                    <table className="table table-zebra w-full text-base lg:text-lg">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="py-4">Recipient</th>
                          <th className="py-4">Location</th>
                          <th className="py-4">Date & Time</th>
                          <th className="py-4">Blood Group</th>
                          <th className="py-4">Status</th>
                          <th className="py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id} className="hover:bg-red-50 transition-colors">
                            <td className="py-4">
                              <div className="font-bold text-gray-800 truncate max-w-xs">
                                {req.recipientName}
                              </div>
                              <div className="text-sm text-gray-600">
                                by {req.requesterName || "Unknown"}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="font-medium">{req.upazila}, {req.district}</div>
                              <div className="text-sm text-gray-600 truncate max-w-xs">
                                {req.hospitalName || req.hospital || "N/A"}
                              </div>
                            </td>
                            <td className="py-4">
                              <div>{new Date(req.donationDate).toLocaleDateString("en-GB")}</div>
                              <div className="text-sm text-gray-600">{req.donationTime}</div>
                            </td>
                            <td className="py-4">
                              <span className="badge badge-error badge-lg text-white font-bold">
                                {req.bloodGroup}
                              </span>
                            </td>
                            <td className="py-4">
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
                            <td className="py-4">
                              <div className="flex gap-2">
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

                  {/* Mobile & Tablet Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
                    {requests.map((req) => (
                      <div
                        key={req._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-red-100 transition-all duration-300 flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 truncate">
                              {req.recipientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {req.requesterName || "Unknown"}
                            </p>
                          </div>
                          <span className="badge badge-error badge-lg text-white font-bold ml-3">
                            {req.bloodGroup}
                          </span>
                        </div>

                        <div className="space-y-2 text-gray-700 text-sm flex-1">
                          <p className="truncate">
                            <strong>Location:</strong> {req.upazila}, {req.district}
                          </p>
                          <p className="truncate">
                            <strong>Hospital:</strong> {req.hospitalName || req.hospital || "N/A"}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(req.donationDate).toLocaleDateString("en-GB")}
                          </p>
                          <p>
                            <strong>Time:</strong> {req.donationTime}
                          </p>
                        </div>

                        <div className="mt-5">
                          <label className="label text-sm font-semibold text-gray-700 pb-1">Status</label>
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="select select-bordered w-full rounded-xl text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>

                        <div className="flex gap-3 mt-5">
                          <Link
                            to={`/dashboard/request-details/${req._id}`}
                            className="btn btn-info flex-1 rounded-xl text-sm"
                          >
                            View Details
                          </Link>
                          {role === "admin" && (
                            <button
                              onClick={() => handleDelete(req._id)}
                              className="btn btn-error flex-1 rounded-xl text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination - Responsive */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 sm:mt-12">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="btn btn-outline btn-error rounded-xl px-6"
                      >
                        Previous
                      </button>

                      <span className="text-base sm:text-lg font-medium text-gray-700">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="btn btn-outline btn-error rounded-xl px-6"
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