import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
// import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
// import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  useEffect(() => {
    fetch("/district.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));

    fetch("/upazila.json")
      .then((res) => res.json())
      .then((data) => setAllUpazilas(data.upazilas || []));
  }, []);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = districts.find((d) => d.name === districtName);
    if (district) {
      const filtered = allUpazilas.filter((u) => u.district_id === district.id);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const image = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    // Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!image) {
      toast.error("Please upload a profile photo");
      return;
    }

    try {
      // Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", image);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        formData
      );

      const photoURL = imgRes.data.data.display_url;

      // Firebase registration
      await registerUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      // Save to backend
      const userInfo = {
        name,
        email,
        photoURL,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
      };

      await axios.post("http://localhost:3000/users", userInfo); // লোকাল বা প্রোডাকশন URL

      toast.success("Registration successful! Welcome to BloodCare 🩸");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Register as Donor</title>
      </Helmet>

      {/* Light Theme Optimized Background */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
                Register as Donor
              </h1>
              <p className="text-xl text-red-100">
                Join our community and help save lives
              </p>
            </div>

            {/* Form Body */}
            <div className="p-8 lg:p-12">
              <form onSubmit={handleRegister} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      className="input input-bordered w-full text-lg rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full text-lg rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="label text-lg font-semibold text-gray-700">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="file-input file-input-bordered w-full rounded-xl text-lg"
                    required
                  />
                </div>

                {/* Blood Group, District, Upazila */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bloodGroup"
                      className="select select-bordered w-full text-lg rounded-xl"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      onChange={handleDistrictChange}
                      className="select select-bordered w-full text-lg rounded-xl"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select District
                      </option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Upazila <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="upazila"
                      className="select select-bordered w-full text-lg rounded-xl"
                      defaultValue=""
                      required
                      disabled={filteredUpazilas.length === 0}
                    >
                      <option value="" disabled>
                        {filteredUpazilas.length === 0 ? "Select district first" : "Select Upazila"}
                      </option>
                      {filteredUpazilas.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full text-lg rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="label text-lg font-semibold text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="input input-bordered w-full text-lg rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-5 rounded-2xl text-white font-bold text-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500"
                >
                  Register as Donor
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-10">
                <p className="text-lg text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-red-600 hover:text-red-700 hover:underline transition-all"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;