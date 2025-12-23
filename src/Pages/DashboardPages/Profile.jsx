import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/UseAxiosSecure";

const Profile = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const axiosSecure = useAxiosSecure()

  // Load districts & upazilas
  useEffect(() => {
    Promise.all([axios.get("/district.json"), axios.get("/upazila.json")])
      .then(([distRes, upaRes]) => {
        setDistricts(distRes.data.districts || []);
        setUpazilas(upaRes.data.upazilas || []);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (authUser?.email) {
      const fetchProfile = async () => {
        try {
          const res = await axiosSecure.get(
            `https://blood-donation-application-server-phi.vercel.app/users/${authUser.email}`
          );
          setProfile(res.data);
          setFormData(res.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (error.response?.status === 404) {
            alert("Profile not found!");
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [authUser, navigate]);

  // Filter upazilas when district changes
  useEffect(() => {
    if (formData.district && districts.length > 0) {
      const selectedDist = districts.find((d) => d.name === formData.district);
      if (selectedDist) {
        const filtered = upazilas.filter(
          (u) => u.district_id === selectedDist.id
        );
        setFilteredUpazilas(filtered);

        // Reset upazila if not valid for new district
        if (
          formData.upazila &&
          !filtered.some((u) => u.name === formData.upazila)
        ) {
          setFormData((prev) => ({ ...prev, upazila: "" }));
        }
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.district, districts, upazilas]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // শুধু এডিটেবল ফিল্ড পাঠানো হবে
  const handleSave = async () => {
    if (!authUser?.email) return;

    setSaving(true);
    try {
      const dataToUpdate = {
        name: formData.name?.trim(),
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      };

      await axiosSecure.patch(
        `https://blood-donation-application-server-phi.vercel.app/users/${authUser.email}`,
        dataToUpdate
      );

      // Update local state
      setProfile((prev) => ({ ...prev, ...dataToUpdate }));
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg = error.response?.data?.message || error.message;
      alert("Failed to update profile: " + msg);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-600">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-12">
        My Profile
      </h1>

      <div className="card bg-base-100 shadow-2xl">
        <div className="card-body p-10">
          {/* Avatar */}
          <div className="flex justify-center mb-10">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-8 border-red-200 shadow-2xl"
              />
            ) : (
              <div className="avatar placeholder">
                <div className="bg-red-600 text-white rounded-full w-40">
                  <span className="text-7xl font-bold">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-right mb-10">
            {!isEditing ? (
              <button onClick={handleEdit} className="btn btn-primary btn-lg">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-success btn-lg"
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner"></span>{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button onClick={handleCancel} className="btn btn-ghost btn-lg">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            {/* Name */}
            <div>
              <label className="label font-bold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Enter your name"
                className={`input input-bordered w-full ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="label font-bold">Email</label>
              <input
                type="email"
                value={formData.email || ""}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="label font-bold">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`select select-bordered w-full ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="label font-bold">District</label>
              <select
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`select select-bordered w-full ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="label font-bold">Upazila</label>
              <select
                name="upazila"
                value={formData.upazila || ""}
                onChange={handleChange}
                disabled={!isEditing || !formData.district}
                className={`select select-bordered w-full ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              >
                <option value="">
                  {formData.district
                    ? "Select Upazila"
                    : "First select district"}
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="label font-bold">Role</label>
              <input
                type="text"
                value={profile.role || "donor"}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="label font-bold">Account Status</label>
              <input
                type="text"
                value={profile.status === "active" ? "Active" : "Blocked"}
                readOnly
                className={`input input-bordered w-full font-bold ${
                  profile.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
