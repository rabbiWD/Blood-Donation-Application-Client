import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
// import useAuth from "../../hooks/useAuth";
// import { Link } from "react-router-dom"; // সঠিক ইমপোর্ট

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
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
        `http://localhost:3000/my-donation-request/${user.email}` // plural "requests"
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete request with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation request? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/donation-request/${id}`);
      // Remove from local state
      setRequests((prev) => prev.filter((req) => req._id !== id));
      alert("Request deleted successfully!");
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-8">
        My Donation Requests
      </h1>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-3">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn ${
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
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-lg font-medium">
        Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl">
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
                  <td>{request.upazila}, {request.district}</td>
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
                      {/* View Button */}
                      <Link to={`/donation-request/${request._id}`}>
                        <button className="btn btn-sm btn-primary">View</button>
                      </Link>

                      {/* Edit Button - only for pending */}
                      {request.status === "pending" && (
                        <Link to={`/dashboard/edit-request/${request._id}`}>
                          <button className="btn btn-sm btn-warning">Edit</button>
                        </Link>
                      )}

                      {/* Delete Button - only for pending */}
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      )}
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

export default MyDonationRequests;