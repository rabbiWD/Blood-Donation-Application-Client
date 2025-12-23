import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.email) {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(
        `https://blood-donation-application-server-phi.vercel.app/my-donation-request/${user.email}`
      );
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (error) {
      console.error("Error fetching my requests:", error);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.status === statusFilter)
      );
    }
    setCurrentPage(1);
  }, [statusFilter, requests]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this donation request? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`
      );
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request. Please try again.");
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 sm:mb-8 text-center sm:text-left">
        My Donation Requests
      </h1>

      {/* Status Filter Buttons */}
      <div className="mb-6 flex flex-wrap justify-center sm:justify-start gap-3">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn btn-sm ${
              statusFilter === status
                ? status === "pending"
                  ? "btn-warning"
                  : status === "inprogress"
                  ? "btn-info"
                  : status === "done"
                  ? "btn-success"
                  : status === "canceled"
                  ? "btn-error"
                  : "btn-primary"
                : "btn-outline"
            }`}
          >
            {status === "all"
              ? "All"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-base sm:text-lg font-medium text-center sm:text-left">
        Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
      </p>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto bg-base-100 shadow-xl rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-lg">
              <th>Recipient Name</th>
              <th>Location</th>
              <th>Blood Group</th>
              <th>Donation Date</th>
              <th>Donation Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-gray-500 text-xl">
                  No donation requests found for this filter.
                </td>
              </tr>
            ) : (
              currentItems.map((request) => (
                <tr key={request._id} className="hover">
                  <td className="font-medium">{request.recipientName}</td>
                  <td>
                    {request.upazila}, {request.district}
                  </td>
                  <td>
                    <span className="badge badge-lg badge-error text-white font-bold">
                      {request.bloodGroup}
                    </span>
                  </td>
                  <td>{new Date(request.donationDate).toLocaleDateString()}</td>
                  <td>{request.donationTime}</td>
                  <td>
                    <span
                      className={`badge badge-lg font-bold ${
                        request.status === "pending"
                          ? "badge-warning"
                          : request.status === "inprogress"
                          ? "badge-info"
                          : request.status === "done"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/donation-request/${request._id}`}>
                        <button className="btn btn-sm btn-primary">View</button>
                      </Link>
                      {request.status === "pending" && (
                        <>
                          <Link to={`/dashboard/edit-request/${request._id}`}>
                            <button className="btn btn-sm btn-warning">Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="btn btn-sm btn-error"
                          >
                            Delete
                          </button>
                        </>
                      )}
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
        {currentItems.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500 text-xl">
            No donation requests found for this filter.
          </div>
        ) : (
          currentItems.map((request) => (
            <div
              key={request._id}
              className="bg-base-100 shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{request.recipientName}</h3>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {request.upazila}, {request.district}
                  </p>
                </div>
                <span className="badge badge-lg badge-error text-white font-bold">
                  {request.bloodGroup}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <strong>Date:</strong> {new Date(request.donationDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {request.donationTime}
                </div>
              </div>

              <div className="mb-5">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge badge-lg font-bold ${
                    request.status === "pending"
                      ? "badge-warning"
                      : request.status === "inprogress"
                      ? "badge-info"
                      : request.status === "done"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                <Link to={`/donation-request/${request._id}`}>
                  <button className="btn btn-sm btn-primary flex-1">View</button>
                </Link>
                {request.status === "pending" && (
                  <>
                    <Link to={`/dashboard/edit-request/${request._id}`}>
                      <button className="btn btn-sm btn-warning flex-1">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="btn btn-sm btn-error flex-1"
                    >
                      Delete
                    </button>
                  </>
                )}
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

          <span className="text-sm sm:text-base">
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

export default MyDonationRequests;