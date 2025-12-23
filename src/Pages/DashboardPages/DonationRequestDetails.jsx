import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // ← যোগ করা হয়েছে
// import { useNavigate, useParams } from "react-router-dom"; // fixed import
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router";

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
          const res = await axios.get(
            `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`
          );
          setRequest(res.data);
        } catch (error) {
          console.error("Error fetching request:", error);
          toast.error("Failed to load request details.");
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
      await axios.patch(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}/donate`,
        {
          donorName: user.displayName || "Anonymous",
          donorEmail: user.email,
          status: "inprogress",
        }
      );

      // Update local state
      setRequest((prev) => ({ ...prev, status: "inprogress" }));

      // Close modal
      setModalOpen(false);

      // Success toast
      toast.success(
        "Thank you for your kindness! ❤️ Your donation has been confirmed. The request is now In Progress.",
        { duration: 6000 }
      );
    } catch (error) {
      console.error("Error confirming donation:", error);
      toast.error("Failed to confirm donation. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!request) {
    return <div className="text-center py-20 text-2xl text-error">Request not found.</div>;
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
              <p>
                <span className="font-semibold">Recipient Name:</span>{" "}
                {request.recipientName}
              </p>
              <p>
                <span className="font-semibold">Blood Group:</span>{" "}
                <span className="text-red-600 font-bold text-xl">
                  {request.bloodGroup}
                </span>
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {request.upazila}, {request.district}
              </p>
              <p>
                <span className="font-semibold">Hospital:</span>{" "}
                {request.hospitalName}
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Donation Date:</span>{" "}
                {new Date(request.donationDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                <span className="font-semibold">Donation Time:</span>{" "}
                {request.donationTime}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`badge badge-lg ${
                    request.status === "pending"
                      ? "badge-warning"
                      : request.status === "inprogress"
                      ? "badge-info"
                      : "badge-success"
                  }`}
                >
                  {request.status === "pending"
                    ? "Pending"
                    : request.status === "inprogress"
                    ? "In Progress"
                    : "Completed"}
                </span>
              </p>
            </div>
          </div>

          {/* Request Message */}
          {request.requestMessage && (
            <div className="mb-10">
              <h3 className="font-semibold text-xl mb-3">Request Message</h3>
              <div className="bg-gray-100 p-6 rounded-lg text-gray-700">
                <p>{request.requestMessage}</p>
              </div>
            </div>
          )}

          {/* Requester Contact */}
          <div className="space-y-3 bg-base-200 p-6 rounded-lg">
            <p>
              <span className="font-semibold">Requester:</span> {request.requesterName}
            </p>
            <p>
              <span className="font-semibold">Contact Email:</span>{" "}
              <a href={`mailto:${request.requesterEmail}`} className="link link-primary">
                {request.requesterEmail}
              </a>
            </p>
            {request.phoneNumber && (
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a href={`tel:${request.phoneNumber}`} className="link link-primary">
                  {request.phoneNumber}
                </a>
              </p>
            )}
          </div>

          {/* Donate Button */}
          {isPending && (
            <div className="card-actions justify-center mt-12">
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-success btn-lg text-white shadow-lg hover:shadow-xl"
              >
                I Want to Donate 🩸
              </button>
            </div>
          )}

          {!isPending && (
            <div className="alert alert-info mt-10 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                This request is already <strong>In Progress</strong>. Thank you to the donor!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-6 text-center text-success">
              Confirm Your Donation ❤️
            </h3>

            <div className="space-y-5">
              <div>
                <label className="label font-semibold">Your Name</label>
                <input
                  type="text"
                  value={user?.displayName || "Not set"}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              <div>
                <label className="label font-semibold">Your Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              <div className="alert alert-warning shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  You are confirming that you will donate blood. The status will change to{" "}
                  <strong>"In Progress"</strong>.
                </span>
              </div>
            </div>

            <div className="modal-action flex gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="btn btn-ghost flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                className="btn btn-success flex-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner"></span> Confirming...
                  </>
                ) : (
                  "Confirm Donation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;