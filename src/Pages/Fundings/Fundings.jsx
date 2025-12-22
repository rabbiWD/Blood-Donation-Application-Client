import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Funding = () => {
  const { user, loading: authLoading } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [fundings, setFundings] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  const API_BASE =
    import.meta.env.MODE === "production"
      ? "https://blood-donation-application-server-phi.vercel.app"
      : "http://localhost:3000";

  useEffect(() => {
    if (authLoading || !user) return;
    fetchFundings();
  }, [user, authLoading]);

  const fetchFundings = async () => {
    setPageLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/fundings`);
      setFundings(res.data.fundings || []);
      setTotalFunding(res.data.totalFunding || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load donations");
      setFundings([]);
      setTotalFunding(0);
    } finally {
      setPageLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return toast.error("Stripe not loaded");

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 10) return toast.error("Minimum ৳10");

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { data } = await axios.post(`${API_BASE}/create-payment-intent`, {
        amount: numAmount,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.displayName || user?.name || "Anonymous",
              email: user?.email,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post(`${API_BASE}/fundings`, {
          amount: numAmount,
          donorName: user?.displayName || user?.name || "Anonymous",
          donorEmail: user?.email,
          transactionId: paymentIntent.id,
        });

        toast.success("Thank you! Your donation was successful 🩷");
        setAmount("");
        cardElement.clear();
        setShowModal(false);
        fetchFundings();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodDonation | Support Our Mission - Donate</title>
      </Helmet>

      {/* Light Theme Optimized Background */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-6 drop-shadow-lg">
              Support BloodDonation Foundation
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Every contribution brings us closer to saving more lives. Your support helps organize blood drives and emergency responses across Bangladesh.
            </p>
          </div>

          {/* Total Funds + Donate Button */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20 items-center">
            {/* Total Funds Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-pink-100">
                <p className="text-3xl font-semibold text-gray-600 mb-4">
                  Total Funds Collected
                </p>
                <p className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                  ৳{totalFunding.toLocaleString()}
                </p>
                <p className="text-lg text-gray-600 mt-6">
                  Thanks to {fundings.length} amazing donors 
                </p>
              </div>
            </div>

            {/* Donate Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-2xl md:text-3xl font-bold px-12 py-8 rounded-3xl shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-500"
              >
                Donate Now 
              </button>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
              Recent Donations
            </h2>

            {fundings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-8">🩸</div>
                <p className="text-2xl md:text-3xl text-gray-600">
                  No donations yet. Be the first to make an impact!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fundings.map((f) => (
                  <div
                    key={f._id}
                    className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-pink-200"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">
                          {f.donorName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(f.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                        ৳{f.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-green-600">
                      <span className="text-3xl">✓</span>
                      <span className="font-semibold text-lg">Successful</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-3xl font-bold text-center text-red-600 mb-8">
              Make a Donation
            </h3>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="label text-lg font-semibold">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min ৳10)"
                  className="input input-bordered input-lg w-full"
                  required
                  disabled={processing}
                />
              </div>

              <div>
                <label className="label text-lg font-semibold">
                  Card Details
                </label>
                <div className="p-6 border-2 border-pink-200 rounded-2xl bg-pink-50">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "18px",
                          color: "#424770",
                          "::placeholder": { color: "#aab7c4" },
                        },
                        invalid: { color: "#9e2146" },
                      },
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Test card: <code className="bg-gray-200 px-3 py-1 rounded">4242 4242 4242 4242</code>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing || !stripe}
                  className="btn btn-error btn-lg flex-1"
                >
                  {processing ? (
                    <>
                      <span className="loading loading-spinner"></span> Processing...
                    </>
                  ) : (
                    "Donate Now"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setAmount("");
                    elements?.getElement(CardElement)?.clear();
                  }}
                  className="btn btn-ghost btn-lg flex-1"
                  disabled={processing}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const FundingWithStripe = () => (
  <Elements stripe={stripePromise}>
    <Funding />
  </Elements>
);

export default FundingWithStripe;