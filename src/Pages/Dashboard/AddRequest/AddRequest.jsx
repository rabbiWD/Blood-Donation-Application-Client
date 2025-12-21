import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../../Providers/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router";

const AddRequest = () => {
  const { role } = useAuth(AuthContext);
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

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:3000/add-request", {
        params: {
          page,
          limit: 10,
          status: filters.status || undefined,
          bloodGroup: filters.bloodGroup || undefined,
          district: filters.district.trim() || undefined, // trim করা
        },
      });

      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalRequests: 0,
      });
    } catch (err) {
      toast.error("Failed to load requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filters change হলে page 1 থেকে fetch
  useEffect(() => {
    fetchRequests(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
    fetchRequests(newPage);
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully!");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`);
      toast.success("Request deleted successfully");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to delete request", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | All Blood Donation Requests</title>
        <meta
          name="description"
          content="View and manage all blood donation requests in BloodCare dashboard."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              🩸 All Blood Donation Requests
            </h1>
            <p className="mt-3 text-red-100 text-lg">
              Total: {pagination.totalRequests} requests
            </p>
          </div>

          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="select select-bordered w-full"
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
                className="select select-bordered w-full"
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
                className="input input-bordered w-full"
              />
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-500 dark:text-gray-400">
                  No blood donation requests found with current filters.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto mb-10">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-red-50 dark:bg-red-900/30 text-lg">
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
                        <tr key={req._id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                          <td>
                            <div className="font-bold">{req.recipientName}</div>
                            <div className="text-sm opacity-70">by {req.requesterName || "Unknown"}</div>
                          </td>
                          <td>
                            <div>{req.upazila}, {req.district}</div>
                            <div className="text-sm opacity-70">{req.hospital}</div>
                          </td>
                          <td>
                            <div>{new Date(req.donationDate).toLocaleDateString("en-GB")}</div>
                            <div className="text-sm opacity-70">{req.donationTime}</div>
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
                              className="select select-sm w-full"
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Done</option>
                              <option value="canceled">Canceled</option>
                            </select>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <Link
                                to={`/dashboard/request-details/${req._id}`}
                                className="btn btn-sm btn-info"
                              >
                                View
                              </Link>
                              {role === "admin" && (
                                <button
                                  onClick={() => handleDelete(req._id)}
                                  className="btn btn-sm btn-error"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-shadow"
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{req.recipientName}</h3>
                            <p className="text-sm opacity-70">by {req.requesterName || "Unknown"}</p>
                          </div>
                          <span className="badge badge-error badge-lg text-white font-bold">
                            {req.bloodGroup}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Location:</strong> {req.upazila}, {req.district}
                          </p>
                          <p>
                            <strong>Hospital:</strong> {req.hospital}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(req.donationDate).toLocaleDateString("en-GB")}
                          </p>
                          <p>
                            <strong>Time:</strong> {req.donationTime}
                          </p>
                        </div>

                        <div className="mt-6">
                          <label className="label font-semibold">Status</label>
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="select select-bordered w-full"
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>

                        <div className="card-actions justify-between mt-6">
                          <Link
                            to={`/dashboard/request-details/${req._id}`}
                            className="btn btn-info btn-block md:btn-wide"
                          >
                            View Details
                          </Link>
                          {role === "admin" && (
                            <button
                              onClick={() => handleDelete(req._id)}
                              className="btn btn-error btn-block md:btn-wide mt-2 md:mt-0"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="btn btn-outline btn-error"
                    >
                      Previous
                    </button>

                    <span className="text-lg font-medium">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="btn btn-outline btn-error"
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
    </>
  );
}

export default AddRequest;