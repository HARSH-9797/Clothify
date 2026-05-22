import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../components/context/ShopContext";

const PlaceOrder = () => {
  const { cartItems, products, getCartAmount, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    city: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl = "http://localhost:4000";

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Build order items from cart
  const buildOrderItems = () => {
    const orderItems = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = products.find(p => p._id === item);
        if (product) {
          orderItems.push({
            id: item,
            name: product.name,
            price: product.price,
            quantity: cartItems[item]
          });
        }
      }
    }
    return orderItems;
  };

  // ── RAZORPAY PAYMENT ─────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const orderItems = buildOrderItems();

      // Step 1: Create order in backend
      const res = await fetch(`${backendUrl}/api/payment/razorpay/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token
        },
        body: JSON.stringify({
          items: orderItems,
          amount: getCartAmount(),
          address
        })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      // Step 2: Open Razorpay popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Clothify",
        description: "Purchase from Clothify",
        order_id: data.razorpayOrderId,

        // Step 3: After payment success — verify on backend
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${backendUrl}/api/payment/razorpay/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setCartItems({});
              setSuccess("Payment successful! Redirecting to orders...");
              setTimeout(() => navigate("/orders"), 1500);
            } else {
              setError("Payment verification failed. Contact support.");
            }
          } catch (err) {
            setError("Verification error. Please contact support.");
          }
        },

        // User closed the popup
        modal: {
          ondismiss: () => {
            setError("Payment cancelled.");
            setIsLoading(false);
          }
        },

        // Prefill user details
        prefill: {
          name: address.name,
        },

        theme: {
          color: "#7C3AED", // purple to match your theme
        },
      };

      // Load Razorpay script dynamically
      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsLoading(false);

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // ── COD PAYMENT ──────────────────────────────────────────────
const handleCODPayment = async (orderItems) => {
  setIsLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");
    const amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const res = await fetch(`${backendUrl}/api/payment/cod`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token
      },
      body: JSON.stringify({
        items: orderItems,
        amount,
        address
      })
    });

    const data = await res.json();

    if (data.success) {
      setCartItems({});
      setSuccess("Order placed successfully! Redirecting...");
      setTimeout(() => navigate("/orders"), 1500);
    } else {
      setError(data.message);
    }

  } catch (err) {
  console.log("COD ERROR:", err)  // ← add this
  setError("Something went wrong. Please try again.");
} finally {
    setIsLoading(false);
  }
};

  const placeOrder = () => {
  if (!address.name || !address.city || !address.pincode) {
    setError("Please fill in all fields");
    return;
  }

  const orderItems = buildOrderItems();
  console.log("Order items:", orderItems);

  if (orderItems.length === 0) {
    setError("Your cart is empty. Please add items first.");
    return;
  }

  if (paymentMethod === "razorpay") {
    handleRazorpayPayment();
  } else {
    handleCODPayment(orderItems);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900 pt-10 pb-20 px-4">

      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">
          Check<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">out</span>
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-200 font-semibold mb-4">Delivery Address</h2>
          <div className="flex flex-col gap-3">
            <input
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
              className="bg-slate-700/50 border border-slate-600 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
            />
            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="bg-slate-700/50 border border-slate-600 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="bg-slate-700/50 border border-slate-600 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-200 font-semibold mb-4">Payment Method</h2>
          <div className="flex flex-col gap-3">

            {/* Razorpay option */}
            <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
              paymentMethod === "razorpay"
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-600 hover:border-slate-500"
            }`}>
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="text-purple-500"
              />
              <div>
                <p className="text-white font-medium">Pay Online</p>
                <p className="text-gray-400 text-sm">UPI, Cards, Net Banking, Wallets</p>
              </div>
              <img
                src="https://razorpay.com/assets/razorpay-logo-white.svg"
                alt="Razorpay"
                className="h-5 ml-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
            </label>

            {/* COD option */}
            <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
              paymentMethod === "cod"
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-600 hover:border-slate-500"
            }`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="text-purple-500"
              />
              <div>
                <p className="text-white font-medium">Cash on Delivery</p>
                <p className="text-gray-400 text-sm">Pay when your order arrives</p>
              </div>
            </label>

          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-200 font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-300 mb-2">
            <span>Subtotal</span>
            <span>₹{getCartAmount()}</span>
          </div>
          <div className="flex justify-between text-gray-300 mb-2">
            <span>Delivery</span>
            <span className="text-green-400">Free</span>
          </div>
          <div className="border-t border-slate-600 mt-3 pt-3 flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>₹{getCartAmount()}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Processing..."
            : paymentMethod === "razorpay"
            ? `Pay ₹${getCartAmount()} with Razorpay`
            : "Place Order (COD)"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;