import React from "react";
import Container from "../../Container";

const Contact = () => {
  return (
    <Container>
      <div className="bg-gray-50 py-16" id="contact">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Contact Us
            </h2>

            <form className="space-y-5">
              {/* Name */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  placeholder="Type your message..."
                  rows="5"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition w-full"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Number / Info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Need Help?
            </h3>
            <p className="text-lg text-gray-600 mb-2">
              You can contact us directly for any urgent support.
            </p>

            <p className="text-3xl font-bold text-red-500">+880 1234-567890</p>

            <p className="mt-6 text-gray-600">
              We are available 24/7 to help with blood donation support and
              urgent donor searches.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
