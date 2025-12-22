
import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router";

const RequestDetails = () => {
  const { id } = useParams(); // req._id from URL
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const res = await axios.get(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`
      );
      setRequest(res.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-bold text-error mb-4">Request Not Found</h2>
        <Link to="/dashboard/donation-requests" className="btn btn-primary">
          Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/donation-request"
        className="btn btn-ghost btn-sm mb-6 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Requests
      </Link>

      <div className="bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header with Blood Group Badge */}
        <div className="bg-red-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Donation Request Details</h1>
          <div className="text-6xl font-extrabold mt-4">
            {request.bloodGroup}
          </div>
          <p className="text-xl mt-2 opacity-90">Urgent Blood Needed</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Requester Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Requester Information
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Name:</span> {request.requesterName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {request.requesterEmail}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {request.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Recipient Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Recipient Details
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Recipient Name:</span> {request.recipientName}
                </p>
                <p>
                  <span className="font-medium">Blood Group:</span>{" "}
                  <span className="badge badge-lg badge-error text-white">
                    {request.bloodGroup}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Units Needed:</span>{" "}
                  <span className="font-bold text-xl text-red-600">
                    {request.units} Bag{request.units > 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Location</h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">District:</span> {request.district}
                </p>
                <p>
                  <span className="font-medium">Upazila:</span> {request.upazila}
                </p>
                <p>
                  <span className="font-medium">Hospital:</span> {request.hospitalName}
                </p>
                <p>
                  <span className="font-medium">Full Address:</span>{" "}
                  {request.fullAddress}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Time & Status</h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Donation Date:</span>{" "}
                  {new Date(request.donationDateTime).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <span className="font-medium">Donation Time:</span>{" "}
                  {new Date(request.donationDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <span className="font-medium">Request Status:</span>{" "}
                  <span
                    className={`badge badge-lg ${
                      request.status === "pending"
                        ? "badge-warning"
                        : request.status === "inprogress"
                        ? "badge-info"
                        : request.status === "completed"
                        ? "badge-success"
                        : "badge-ghost"
                    }`}
                  >
                    {request.status || "pending"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Reason for Donation</h3>
            <div className="bg-base-200 p-5 rounded-xl">
              <p className="text-gray-700 leading-relaxed">
                {request.reason || "No additional reason provided."}
              </p>
            </div>
          </div>

          {/* Request Message (if any) */}
          {request.message && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Additional Message</h3>
              <div className="bg-info/10 border border-info p-5 rounded-xl">
                <p className="italic text-info">"{request.message}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;