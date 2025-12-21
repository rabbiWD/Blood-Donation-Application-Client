import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: `/donation-request/${id}` } });
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    if (user) {
      const fetchRequest = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/donation-requests/${id}`);
          setRequest(res.data);
        } catch (error) {
          console.error("Error fetching request details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRequest();
    }
  }, [id, user]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-2xl">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="card bg-base-100 shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
            Donation Request Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <p><span className="font-semibold">Recipient Name:</span> {request.recipientName}</p>
              <p><span className="font-semibold">Blood Group:</span>{" "}
                <span className="text-red-600 font-bold">{request.bloodGroup}</span>
              </p>
              <p><span className="font-semibold">Location:</span> {request.upazila}, {request.district}</p>
            </div>
            <div>
              <p><span className="font-semibold">Donation Date:</span>{" "}
                {new Date(request.donationDate).toLocaleDateString()}
              </p>
              <p><span className="font-semibold">Donation Time:</span> {request.donationTime}</p>
              <p><span className="font-semibold">Hospital:</span> {request.hospitalName}</p>
            </div>
          </div>

          <div className="mt-8">
            <p><span className="font-semibold">Requester Name:</span> {request.requesterName}</p>
            <p><span className="font-semibold">Requester Email:</span> {request.requesterEmail}</p>
            <p><span className="font-semibold">Contact Phone:</span> {request.phoneNumber}</p>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-xl mb-3">Request Message:</h3>
            <p className="bg-gray-100 p-4 rounded-lg">{request.requestMessage}</p>
          </div>

          <div className="card-actions justify-center mt-10">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;