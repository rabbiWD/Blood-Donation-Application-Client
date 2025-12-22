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
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: `/donation-request/${id}` } });
    }
  }, [user, authLoading, navigate, id]);

  // Fetch request details
  useEffect(() => {
    if (user) {
      const fetchRequest = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/donation-request/${id}`);
          setRequest(res.data);
        } catch (error) {
          console.error("Error fetching request:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRequest();
    }
  }, [id, user]);

  // Handle donation confirmation
  const handleDonate = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      await axios.patch(`http://localhost:3000/donation-requests/${id}/donate`, {
        donorName: user.displayName || "Anonymous",
        donorEmail: user.email,
        status: "inprogress", // Change status to inprogress
      });

      // Update local state to reflect new status
      setRequest((prev) => ({ ...prev, status: "inprogress" }));

      // Close modal
      setModalOpen(false);

      // Optional: Show success message
      alert("Thank you! Your donation has been confirmed. The request is now in progress.");
    } catch (error) {
      console.error("Error confirming donation:", error);
      alert("Failed to confirm donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!request) {
    return <div className="text-center py-20 text-2xl">Request not found.</div>;
  }

  const isPending = request.status === "pending";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="card bg-base-100 shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-10 text-red-600">
            Blood Donation Request Details
          </h1>

          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg mb-10">
            <div className="space-y-4">
              <p><span className="font-semibold">Recipient Name:</span> {request.recipientName}</p>
              <p><span className="font-semibold">Blood Group:</span>{" "}
                <span className="text-red-600 font-bold text-xl">{request.bloodGroup}</span>
              </p>
              <p><span className="font-semibold">Location:</span> {request.upazila}, {request.district}</p>
              <p><span className="font-semibold">Hospital:</span> {request.hospitalName}</p>
            </div>
            <div className="space-y-4">
              <p><span className="font-semibold">Donation Date:</span>{" "}
                {new Date(request.donationDate).toLocaleDateString()}
              </p>
              <p><span className="font-semibold">Donation Time:</span> {request.donationTime}</p>
              <p><span className="font-semibold">Status:</span>{" "}
                <span className={`badge ${request.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                  {request.status === 'pending' ? 'Pending' : 'In Progress'}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-semibold text-xl mb-3">Request Message</h3>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>{request.requestMessage}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p><span className="font-semibold">Requester:</span> {request.requesterName}</p>
            <p><span className="font-semibold">Contact Email:</span> {request.requesterEmail}</p>
            <p><span className="font-semibold">Phone:</span> {request.phoneNumber}</p>
          </div>

          {/* Donate Button - Only show if pending */}
          {isPending && (
            <div className="card-actions justify-center mt-12">
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-success btn-lg text-white"
              >
                I Want to Donate
              </button>
            </div>
          )}

          {!isPending && (
            <div className="alert alert-info mt-10">
              <span>This request is already in progress. Thank you for your support!</span>
            </div>
          )}
        </div>
      </div>

      {/* Donate Confirmation Modal */}
      {modalOpen && (
        <>
          <input type="checkbox" id="donate-modal" className="modal-toggle" checked />
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-6 text-center text-green-600">
                Confirm Your Donation
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="label font-semibold">Donor Name</label>
                  <input
                    type="text"
                    value={user?.displayName || "Not set"}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="label font-semibold">Donor Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>

                <div className="alert alert-warning mt-6">
                  <span>
                    You are about to confirm that you will donate blood for this request.
                    The status will change to <strong>"In Progress"</strong>.
                  </span>
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => setModalOpen(false)}
                  className="btn btn-ghost"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Confirm Donation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationRequestDetails;