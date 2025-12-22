import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState("active"); // Default

  // Load districts & upazilas
  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => setDistricts(res.data.districts || []));
    axios
      .get("/upazila.json")
      .then((res) => setUpazilas(res.data.upazilas || []));
  }, []);

  // Get user status (to block if not active)
  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://blood-donation-application-server-phi.vercel.app/users/${user.email}`
        )
        .then((res) => setUserStatus(res.data.status || "active"))
        .catch(() => setUserStatus("active"));
    }
  }, [user]);

  // Filter upazilas based on selected district
  const selectedDistrict = watch("district");
  useEffect(() => {
    if (selectedDistrict) {
      const dist = districts.find((d) => d.name === selectedDistrict);
      if (dist) {
        const filtered = upazilas.filter((u) => u.district_id === dist.id);
        setFilteredUpazilas(filtered);
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, districts, upazilas]);

  const onSubmit = async (data) => {
    if (userStatus !== "active") {
      alert("You are blocked. You cannot create donation requests.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        requesterName: user.displayName || "Unknown",
        requesterEmail: user.email,
        recipientName: data.recipientName,
        district: data.district,
        upazila: data.upazila,
        hospitalName: data.hospitalName,
        fullAddress: data.fullAddress,
        bloodGroup: data.bloodGroup,
        donationDate: data.donationDate,
        donationTime: data.donationTime,
        requestMessage: data.requestMessage,
        status: "pending", // Default status
      };

      await axios.post(
        "https://blood-donation-application-server-phi.vercel.app/donation-request",
        payload
      );
      alert("Donation request created successfully!");
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If user is blocked
  if (userStatus !== "active") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="alert alert-error shadow-lg max-w-lg mx-auto">
          <span>
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            You are currently blocked and cannot create donation requests.
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-10">
        Create New Donation Request
      </h1>

      <div className="card bg-base-100 shadow-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Requester Info - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label font-semibold">Requester Name</label>
              <input
                type="text"
                value={user?.displayName || "Loading..."}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="label font-semibold">Requester Email</label>
              <input
                type="email"
                value={user?.email || "Loading..."}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="label font-semibold">Recipient Name</label>
            <input
              type="text"
              {...register("recipientName", {
                required: "Recipient name is required",
              })}
              className="input input-bordered w-full"
              placeholder="Enter recipient's name"
            />
            {errors.recipientName && (
              <p className="text-error text-sm mt-1">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* District & Upazila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label font-semibold">District</label>
              <select
                {...register("district", { required: "District is required" })}
                className="select select-bordered w-full"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-error text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label className="label font-semibold">Upazila</label>
              <select
                {...register("upazila", { required: "Upazila is required" })}
                className="select select-bordered w-full"
                disabled={!selectedDistrict}
              >
                <option value="">
                  {selectedDistrict
                    ? "Select Upazila"
                    : "First select district"}
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="text-error text-sm mt-1">
                  {errors.upazila.message}
                </p>
              )}
            </div>
          </div>

          {/* Hospital & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label font-semibold">Hospital Name</label>
              <input
                type="text"
                {...register("hospitalName", {
                  required: "Hospital name is required",
                })}
                className="input input-bordered w-full"
                placeholder="e.g. Dhaka Medical College Hospital"
              />
              {errors.hospitalName && (
                <p className="text-error text-sm mt-1">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>

            <div>
              <label className="label font-semibold">Full Address</label>
              <input
                type="text"
                {...register("fullAddress", {
                  required: "Address is required",
                })}
                className="input input-bordered w-full"
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
              />
              {errors.fullAddress && (
                <p className="text-error text-sm mt-1">
                  {errors.fullAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* Blood Group, Date, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label font-semibold">Blood Group</label>
              <select
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
                className="select select-bordered w-full"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
              {errors.bloodGroup && (
                <p className="text-error text-sm mt-1">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div>
              <label className="label font-semibold">Donation Date</label>
              <input
                type="date"
                {...register("donationDate", { required: "Date is required" })}
                className="input input-bordered w-full"
              />
              {errors.donationDate && (
                <p className="text-error text-sm mt-1">
                  {errors.donationDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="label font-semibold">Donation Time</label>
              <input
                type="time"
                {...register("donationTime", { required: "Time is required" })}
                className="input input-bordered w-full"
              />
              {errors.donationTime && (
                <p className="text-error text-sm mt-1">
                  {errors.donationTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Request Message */}
          <div>
            <label className="label font-semibold">Request Message</label>
            <textarea
              {...register("requestMessage", {
                required: "Please write why you need blood",
              })}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Describe why you need blood (e.g., accident, surgery, etc.)"
            />
            {errors.requestMessage && (
              <p className="text-error text-sm mt-1">
                {errors.requestMessage.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full max-w-md"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Donation Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
