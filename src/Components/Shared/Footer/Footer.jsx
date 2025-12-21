import React from "react";
import Container from "../../Container";
import { Link } from "react-router";

const Footer = () => {
  return (
   <Container>
     <footer className="bg-red-600 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Blood Donation Platform</h2>
          <p className="text-sm text-red-100 leading-6">
            Saving lives through voluntary blood donation. Join our community
            and make a difference today.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">
                Join as a Donor
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:underline">
                Search Donors
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-red-100 text-sm mt-10 border-t border-red-400 pt-4">
        © {new Date().getFullYear()} Blood Donation Platform — All Rights
        Reserved.
      </div>
    </footer>
   </Container>
  );
};

export default Footer;
