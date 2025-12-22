import React, { useEffect, useState } from "react";
import axios from "axios";

const Search = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const [searchData, setSearchData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load districts and upazilas from JSON files
  useEffect(() => {
    axios.get("/district.json").then((res) => {
      setDistricts(res.data.districts || []);
    });

    axios.get("/upazila.json").then((res) => {
      setUpazilas(res.data.upazilas || []);
    });
  }, []);

  // Filter upazilas based on selected district
  useEffect(() => {
    if (searchData.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === searchData.district
      );
      if (selectedDistrict) {
        const relatedUpazilas = upazilas.filter(
          (u) => u.district_id === selectedDistrict.id
        );
        setFilteredUpazilas(relatedUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [searchData.district, districts, upazilas]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const queryParams = new URLSearchParams();
      if (searchData.bloodGroup)
        queryParams.append("bloodGroup", searchData.bloodGroup);
      if (searchData.district)
        queryParams.append("district", searchData.district);
      if (searchData.upazila) queryParams.append("upazila", searchData.upazila);

      const res = await axios.get(
        `https://blood-donation-application-server-phi.vercel.app/search/donors?${queryParams.toString()}`
      );
      setDonors(res.data);
    } catch (error) {
      console.error("Search error:", error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600">
        Search for Blood Donors
      </h1>

      {/* Search Form */}
      <div className="card bg-base-100 shadow-xl p-8 mb-12">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Blood Group */}
          <div>
            <label className="label font-semibold">Blood Group</label>
            <select
              name="bloodGroup"
              value={searchData.bloodGroup}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
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
          </div>

          {/* District */}
          <div>
            <label className="label font-semibold">District</label>
            <select
              name="district"
              value={searchData.district}
              onChange={handleChange}
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

          {/* Upazila */}
          <div>
            <label className="label font-semibold">Upazila</label>
            <select
              name="upazila"
              value={searchData.upazila}
              onChange={handleChange}
              className="select select-bordered w-full"
              disabled={!searchData.district}
            >
              <option value="">
                {searchData.district
                  ? "Select Upazila"
                  : "First select a district"}
              </option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="btn btn-primary w-full h-[48px]"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div>
        {loading && <p className="text-center text-lg">Searching donors...</p>}

        {!loading && searched && donors.length === 0 && (
          <div className="alert alert-info shadow-lg text-center py-8">
            <span>
              No donors found matching your criteria. Try different filters.
            </span>
          </div>
        )}

        {!loading && donors.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold text-center mb-8">
              Found {donors.length} Donor{donors.length > 1 ? "s" : ""}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {donors.map((donor) => (
                <div
                  key={donor._id || donor.email}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="card-body items-center text-center">
                    {donor.photoURL ? (
                      <img
                        src={donor.photoURL}
                        alt={donor.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-red-200 mb-4"
                      />
                    ) : (
                      <div className="avatar placeholder mb-4">
                        <div className="bg-neutral text-neutral-content rounded-full w-28">
                          <span className="text-4xl">
                            {donor.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-bold">{donor.name}</h3>
                    <p className="text-lg font-semibold text-red-600">
                      Blood Group: {donor.bloodGroup}
                    </p>
                    <p>
                      Location: {donor.upazila}, {donor.district}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Status:{" "}
                      {donor.status === "active" ? "Available" : "Inactive"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl">
              Fill the form above to search for blood donors
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
