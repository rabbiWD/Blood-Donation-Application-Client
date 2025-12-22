import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";




const Funding = () => {
  const { user } = useAuth();
  const [fundings, setFundings] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchFundings();
  }, []);

  const fetchFundings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/fundings");
      const data = res.data;
      setFundings(data);

      // Total calculate
      const total = data.reduce((sum, f) => sum + f.amount, 0);
      setTotalFunds(total);
    } catch (error) {
      console.error("Error fetching fundings:", error);
      toast.error("Failed to load funding history");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
    //   const stripe = await stripePromise;

      const res = await axios.post("http://localhost:3000/create-checkout-session", {
        amount: parseInt(amount) * 100, // Stripe uses cents
        donorName: user?.displayName || user?.name || "Anonymous",
        donorEmail: user?.email,
      });
      console.log(res.data)
      window.location.href= res.data.url

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Helmet>
        <title>BloodCare | Funding & Donations</title>
      </Helmet>

      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Support BloodCare 🩸
      </h1>

      {/* Total Funds Card */}
      <div className="stats shadow mb-10 w-full">
        <div className="stat place-items-center">
          <div className="stat-title text-2xl">Total Funds Collected</div>
          <div className="stat-value text-primary text-5xl">৳{totalFunds.toLocaleString()}</div>
          <div className="stat-desc text-lg mt-2">Thank you to all donors!</div>
        </div>
      </div>

      {/* Give Fund Section */}
      <div className="card bg-base-100 shadow-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">Give Fund</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <input
            type="number"
            placeholder="Enter amount in BDT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full max-w-xs text-lg"
            min="50"
          />
          <button onClick={handleDonate} className="btn btn-success btn-lg">
            Donate Now
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Your contribution helps us save lives ❤️
        </p>
      </div>

      {/* Funding History Table */}
      <h2 className="text-3xl font-bold mb-6">Funding History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-red-50 text-lg">
              <th>Donor Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {fundings.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500 text-xl">
                  No funding records yet. Be the first to donate!
                </td>
              </tr>
            ) : (
              fundings.map((f, i) => (
                <tr key={i} className="hover">
                  <td className="font-medium">{f.donorName}</td>
                  <td className="font-bold text-success">৳{f.amount.toLocaleString()}</td>
                  <td>{new Date(f.date).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funding;