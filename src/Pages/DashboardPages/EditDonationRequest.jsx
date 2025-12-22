import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";

const EditDonationRequest = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Load districts & upazilas
  useEffect(() => {
    Promise.all([axios.get("/district.json"), axios.get("/upazila.json")])
      .then(([distRes, upaRes]) => {
        setDistricts(distRes.data.districts || []);
        setUpazilas(upaRes.data.upazilas || []);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  // Fetch the request
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        // ঠিক করা হয়েছে: plural রুট ব্যবহার
        const res = await axios.get(
          `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`
        );
        const req = res.data;

        // Security check
        if (req.requesterEmail !== user?.email) {
          alert("You can only edit your own requests!");
          navigate("/dashboard/my-donation-request");
          return;
        }
        if (req.status !== "pending") {
          alert("Only pending requests can be edited!");
          navigate("/dashboard/my-donation-request");
          return;
        }

        setRequest(req);
        setFormData(req);
      } catch (error) {
        console.error("Error fetching request:", error);
        alert("Request not found or error loading.");
        navigate("/dashboard/my-donation-request");
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchRequest();
  }, [id, user, navigate]);

  // Filter upazilas
  useEffect(() => {
    if (formData.district && districts.length > 0) {
      const selected = districts.find((d) => d.name === formData.district);
      if (selected) {
        const filtered = upazilas.filter((u) => u.district_id === selected.id);
        setFilteredUpazilas(filtered);

        // Reset upazila if invalid after district change
        if (
          formData.upazila &&
          !filtered.some((u) => u.name === formData.upazila)
        ) {
          setFormData((prev) => ({ ...prev, upazila: "" }));
        }
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.district, districts, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // plural রুট
      await axios.patch(
        `https://blood-donation-application-server-phi.vercel.app/donation-request/${id}`,
        formData
      );
      alert("Request updated successfully!");
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update request.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Edit Donation Request
      </h1>

      <form
        onSubmit={handleUpdate}
        className="card bg-base-100 shadow-xl p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label font-semibold">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName || ""}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-semibold">Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName || ""}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-semibold">Full Address</label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress || ""}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-semibold">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-semibold">District</label>
            <select
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-semibold">Upazila</label>
            <select
              name="upazila"
              value={formData.upazila || ""}
              onChange={handleChange}
              required
              disabled={!formData.district}
              className="select select-bordered w-full"
            >
              <option value="">
                {formData.district ? "Select Upazila" : "First select district"}
              </option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-semibold">Donation Date</label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate?.slice(0, 10) || ""}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-semibold">Donation Time</label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime || ""}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="label font-semibold">Request Message</label>
          <textarea
            name="requestMessage"
            value={formData.requestMessage || ""}
            onChange={handleChange}
            required
            rows="6"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="text-center mt-10">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner"></span> Updating...
              </>
            ) : (
              "Update Request"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-donation-request")}
            className="btn btn-ghost btn-lg ml-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;
