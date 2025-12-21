
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import useAuth from "../../../hooks/useAuth";
// import { Link, useLocation, useNavigate } from "react-router";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Register = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();

//   const [upazilas, setUpazilas] = useState([])
//   const [districts, setDistricts] = useState([])
//   const [district, setDistrict] = useState('')
//   const[upazila, setUpazila] = useState('')
  

//   useEffect(()=>{
//     axios.get('/upazila.json')
//     .then(res =>{
//       setUpazilas(res.data.upazilas)
//     })

//     axios.get('/district.json')
//     .then(res=>{
//       setDistricts(res.data.districts)
//     })

//   },[])




//   const { registerUser, updateUserProfile } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleRegistration = async (data) => {
//     console.log(data);
//     try {
//        const name = data.name
//       const bloodGroup = data.bloodGroup
//       const district = data.district
//       const upazila = data.upazila

//       const profileImg = data.photo[0];

//       // 1. Firebase email/password registration
//       const result = await registerUser(data.email, data.password);
//       console.log(result);

//       // 2. Upload avatar to ImgBB
//       const formData = new FormData();
//       formData.append("image", profileImg);

//       const image_API_URL = `https://api.imgbb.com/1/upload?key=${
//         import.meta.env.VITE_image_host_key
//       }`;

//       const imgRes = await axios.post(image_API_URL, formData);
//       console.log(imgRes.data)

      
//       const photoURL = imgRes.data.data.display_url
      
//       // 3. Prepare user profile info for Firebase
//       const userProfile = {
//         displayName: data.name,
//         photoURL: photoURL,
     
//       };

//       // 4. Update Firebase profile
//       await updateUserProfile(userProfile);

//       // (Optional) Send full user info to backend later (role=donor)
     
//       console.log(photoURL)
//       const userInfo = {
//         name, bloodGroup, district, upazila, photoURL, role: 'donor', status: 'active'
//       }
//       await axios.post(`http://localhost:3000/users`, userInfo)
      

//       navigate(location.state || "/");
//       toast.success('Donor Registration successfull')
//     } catch (error) {
//       console.log(error);
//     }
//   };

  
//   return (
//     <div className="card bg-base-100 w-full mx-auto max-w-sm shadow-2xl mt-5">
//       <h3 className="text-3xl text-center font-bold">Welcome to Blood Donation</h3>
//       <p className="text-center">Please Register</p>

//       <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
//         <fieldset className="fieldset">

//           {/* Name */}
//           <label className="label">Full Name</label>
//           <input
//             type="text"
//             {...register("name", { required: true })}
//             className="input"
//             placeholder="Your Name"
//           />
//           {errors.name && (
//             <p className="text-red-500">Name is required</p>
//           )}

//           {/* Avatar */}
//           <label className="label">Avatar</label>
//           <input
//             type="file"
//             {...register("photo", { required: true })}
//             className="file input"
//           />
//           {errors.photo && (
//             <p className="text-red-500">Photo is required</p>
//           )}

//           {/* Email */}
//           <label className="label">Email</label>
//           <input
//             type="email"
//             {...register("email", { required: true })}
//             className="input"
//             placeholder="Email"
//           />
//           {errors.email && (
//             <p className="text-red-500">Email is required</p>
//           )}

//           {/* Blood Group */}
//           <label className="label">Blood Group</label>
//           <select
//             className="select select-bordered"
//             {...register("bloodGroup", { required: true })}
//           >
//             <option value="">Select Blood Group</option>
//             <option>A+</option>
//             <option>A-</option>
//             <option>B+</option>
//             <option>B-</option>
//             <option>AB+</option>
//             <option>AB-</option>
//             <option>O+</option>
//             <option>O-</option>
//           </select>
//           {errors.bloodGroup && (
//             <p className="text-red-500">Blood group is required</p>
//           )}

//           {/* District */}
//           <label className="label">District</label>
//           <select
//            onChange={(e)=>setDistrict(e.target.value)}
//             className="select select-bordered"
//             {...register("district", { required: true })}
//           >
//             <option value="">Select District</option>
//             {
//               districts.map(d=> <option value={d?.name} key={d.id}>{d?.name}</option>)
//             }
            
//           </select>
//           {errors.districts && (
//             <p className="text-red-500">District is required</p>
//           )}

//           {/* Upazila */}
//           <label className="label">Upazila</label>
//           <select
//              onChange={(e)=>setUpazila(e.target.value)}
//             className="select select-bordered"
//             {...register("upazila", { required: true })}
//           >
//             <option value="">Select Upazila</option>
//             {
//               upazilas.map(u=> <option value={u?.name} key={u.id}>{u?.name}</option>)
//             }
//           </select>
//           {errors.upazilas && (
//             <p className="text-red-500">Upazila is required</p>
//           )}

//           {/* Password */}
//           <label className="label">Password</label>
//           <input
//             type="password"
//             {...register("password", {
//               required: true,
//               minLength: 6,
//               pattern:
//                 /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
//             })}
//             className="input"
//             placeholder="Password"
//           />

//           {errors.password?.type === "required" && (
//             <p className="text-red-500">Password is required.</p>
//           )}
//           {errors.password?.type === "minLength" && (
//             <p className="text-red-500">
//               Password must be 6 characters or longer
//             </p>
//           )}
//           {errors.password?.type === "pattern" && (
//             <p className="text-red-500">
//               Password must have uppercase, lowercase, number & special char.
//             </p>
//           )}

//           {/* Confirm Password */}
//           <label className="label">Confirm Password</label>
//           <input
//             type="password"
//             {...register("confirmPassword", {
//               required: true,
//               validate: (value) =>
//                 value === watch("password") || "Passwords do not match",
//             })}
//             className="input"
//             placeholder="Confirm Password"
//           />
//           {errors.confirmPassword && (
//             <p className="text-red-500">{errors.confirmPassword.message}</p>
//           )}

//           <button className="btn btn-neutral mt-4">Register</button>
//         </fieldset>

//         <p>
//           Already have an account?{" "}
//           <Link
//             state={location.state}
//             className="text-blue-400 underline"
//             to="/login"
//           >
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;




import { Helmet } from "react-helmet";
import axios from "axios";
import { toast } from "react-hot-toast";
// import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../Providers/AuthContext";

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
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const image = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);

      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
       formData
      );

      const photoURL = imgRes.data.data.display_url;

      await registerUser(email, password);
      await updateUserProfile(name, photoURL);

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

      await axios.post("http://localhost:3000/users", userInfo);

      toast.success("Registration successful! Welcome to BloodCare 🩸");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Register as Donor</title>
        <meta
          name="description"
          content="Join BloodCare as a blood donor. Register with your details and help save lives in your community."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Register as Donor
            </h1>
            <p className="text-xl text-red-100">
              Join our community and help save lives
            </p>
          </div>

          <div className="card-body p-8 lg:p-12 -mt-6">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-lg font-semibold">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
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
                  <label className="label text-lg font-semibold">
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
                  <label className="label text-lg font-semibold">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-error btn-lg w-full text-xl font-bold py-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
              >
                Register as Donor
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-red-600 dark:text-red-500 hover:underline transition"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
