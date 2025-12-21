
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [upazilas, setUpazilas] = useState([])
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState('')
  const[upazila, setUpazila] = useState('')
  

  useEffect(()=>{
    axios.get('/upazila.json')
    .then(res =>{
      setUpazilas(res.data.upazilas)
    })

    axios.get('/district.json')
    .then(res=>{
      setDistricts(res.data.districts)
    })

  },[])




  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    console.log(data);
    try {
      const profileImg = data.photo[0];

      // 1. Firebase email/password registration
      const result = await registerUser(data.email, data.password);
      console.log(result);

      // 2. Upload avatar to ImgBB
      const formData = new FormData();
      formData.append("image", profileImg);

      const image_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`;

      const imgRes = await axios.post(image_API_URL, formData);
      console.log(imgRes.data)

      // 3. Prepare user profile info for Firebase
      const userProfile = {
        displayName: data.name,
        // photoURL: imgRes.data.data.url,
        photoURL
      };

      // 4. Update Firebase profile
      await updateUserProfile(userProfile);

      // (Optional) Send full user info to backend later (role=donor)
      const name = data.name
      const bloodGroup = data.bloodGroup
      const district = data.district
      const upazila = data.upazila
      const photoURL = imgRes.data.data.display_url
      console.log(photoURL)
      const userInfo = {
        name, bloodGroup, district, upazila, photoURL, role: 'donor', status: 'active'
      }
      await axios.post(`http://localhost:3000/users`, userInfo)
      

      navigate(location.state || "/");
    } catch (error) {
      console.log(error);
    }
  };
  
  
  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shadow-2xl mt-5">
      <h3 className="text-3xl text-center font-bold">Welcome to Blood Donation</h3>
      <p className="text-center">Please Register</p>

      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">

          {/* Name */}
          <label className="label">Full Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-500">Name is required</p>
          )}

          {/* Avatar */}
          <label className="label">Avatar</label>
          <input
            type="file"
            {...register("photo", { required: true })}
            className="file input"
          />
          {errors.photo && (
            <p className="text-red-500">Photo is required</p>
          )}

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">Email is required</p>
          )}

          {/* Blood Group */}
          <label className="label">Blood Group</label>
          <select
            className="select select-bordered"
            {...register("bloodGroup", { required: true })}
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
            <p className="text-red-500">Blood group is required</p>
          )}

          {/* District */}
          <label className="label">District</label>
          <select
           onChange={(e)=>setDistrict(e.target.value)}
            className="select select-bordered"
            {...register("district", { required: true })}
          >
            <option value="">Select District</option>
            {
              districts.map(d=> <option value={d?.name} key={d.id}>{d?.name}</option>)
            }
            
          </select>
          {errors.districts && (
            <p className="text-red-500">District is required</p>
          )}

          {/* Upazila */}
          <label className="label">Upazila</label>
          <select
             onChange={(e)=>setUpazila(e.target.value)}
            className="select select-bordered"
            {...register("upazila", { required: true })}
          >
            <option value="">Select Upazila</option>
            {
              upazilas.map(u=> <option value={u?.name} key={u.id}>{u?.name}</option>)
            }
          </select>
          {errors.upazilas && (
            <p className="text-red-500">Upazila is required</p>
          )}

          {/* Password */}
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
            })}
            className="input"
            placeholder="Password"
          />

          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required.</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be 6 characters or longer
            </p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-500">
              Password must have uppercase, lowercase, number & special char.
            </p>
          )}

          {/* Confirm Password */}
          <label className="label">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="input"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}

          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>

        <p>
          Already have an account?{" "}
          <Link
            state={location.state}
            className="text-blue-400 underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

