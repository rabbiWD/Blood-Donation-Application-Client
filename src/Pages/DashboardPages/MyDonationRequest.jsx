import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
// import useAuth from "../../hooks/useAuth"; // Adjust path as needed
// import { Link } from "react-router-dom";

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
        `http://localhost:3000/my-donation-request/${user.email}`
      );
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (error) {
      console.error("Error fetching my requests:", error);
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
    setCurrentPage(1); // Reset to first page on filter
  }, [statusFilter, requests]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-8">
        My Donation Requests
      </h1>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`btn ${statusFilter === "all" ? "btn-primary" : "btn-outline"}`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`btn ${statusFilter === "pending" ? "btn-warning" : "btn-outline"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("inprogress")}
          className={`btn ${statusFilter === "inprogress" ? "btn-info" : "btn-outline"}`}
        >
          In Progress
        </button>
        <button
          onClick={() => setStatusFilter("done")}
          className={`btn ${statusFilter === "done" ? "btn-success" : "btn-outline"}`}
        >
          Done
        </button>
        <button
          onClick={() => setStatusFilter("canceled")}
          className={`btn ${statusFilter === "canceled" ? "btn-error" : "btn-outline"}`}
        >
          Canceled
        </button>
      </div>

      {/* Results Count */}
      <p className="mb-4 text-lg">
        Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
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
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No donation requests found.
                </td>
              </tr>
            ) : (
              currentItems.map((request) => (
                <tr key={request._id}>
                  <td className="font-medium">{request.recipientName}</td>
                  <td>
                    {request.upazila}, {request.district}
                  </td>
                  <td>
                    <span className="badge badge-lg badge-error text-white">
                      {request.bloodGroup}
                    </span>
                  </td>
                  <td>
                    {new Date(request.donationDate).toLocaleDateString()}
                  </td>
                  <td>{request.donationTime}</td>
                  <td>
                    <span
                      className={`badge badge-lg ${
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
                    <Link to={`/donation-request/${request._id}`}>
                      <button className="btn btn-sm btn-primary">View</button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
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