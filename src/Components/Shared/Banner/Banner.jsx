import React from "react";
import { Link } from "react-router";
import Container from "../../Container";

const Banner = () => {
  return (
    <Container>
        <div className="bg-red-50 py-20">
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Donate Blood, Save Lives
        </h1>

        {/* Subheading (optional) */}
        <p className="text-lg text-gray-600 mb-10">
          Join our mission to help people in need. Become a donor or search for
          one.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-5">
          {/* Join as Donor */}
          <Link
            to="/register"
            className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition"
          >
            Join as a Donor
          </Link>

          {/* Search Donors */}
          <Link
            to="/search"
            className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Search Donors
          </Link>
        </div>
      </div>
    </div>
    </Container>
  );
};

export default Banner;
