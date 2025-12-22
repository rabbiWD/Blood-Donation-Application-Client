import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
// import { Link } from "react-router-dom";

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/donation-request/pending");
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600">
        Blood Donation Requests
      </h1>

      {requests.length === 0 ? (
        <div className="alert alert-info shadow-lg text-center py-8">
          <span>No pending blood donation requests at the moment.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <div
              key={request._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="card-body">
                <h2 className="card-title text-xl">
                  Recipient: {request.recipientName}
                </h2>

                <div className="space-y-2 mt-3">
                  <p>
                    <span className="font-semibold">Blood Group:</span>{" "}
                    <span className="text-red-600 font-bold text-lg">
                      {request.bloodGroup}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {request.upazila}, {request.district}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(request.donationDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {request.donationTime}
                  </p>
                </div>

                <div className="card-actions justify-end mt-6">
                  <Link to={`/donation-request/${request._id}`}>
                    <button className="btn btn-primary">View Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequest;