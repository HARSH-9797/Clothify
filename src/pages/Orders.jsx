import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { FiPackage, FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const BACKEND_URL = "http://localhost:4000";

// ── ORDER TRACKER COMPONENT ───────────────────────────────────────
const OrderTracker = ({ orderId, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus || "Order Placed");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const steps = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = steps.indexOf(status);

  useEffect(() => {
    const socket = io(BACKEND_URL, { withCredentials: true });

    socket.on("connect", () => {
      socket.emit("joinOrder", orderId);
      setIsLive(true);
    });

    socket.on("statusUpdate", (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
        setUpdatedAt(new Date(data.updatedAt).toLocaleTimeString());
      }
    });

    socket.on("disconnect", () => setIsLive(false));

    return () => socket.disconnect();
  }, [orderId]);

  return (
    <div className="mt-4 pt-4 border-t border-slate-600">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}></div>
        <span className="text-xs text-gray-400">{isLive ? "Live tracking active" : "Connecting..."}</span>
        {updatedAt && (
          <span className="text-xs text-purple-400 ml-auto">Updated at {updatedAt}</span>
        )}
      </div>

      <div className="flex items-start justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            {index < steps.length - 1 && (
              <div className={`absolute top-3 left-1/2 w-full h-0.5 ${
                index < currentStep ? "bg-purple-500" : "bg-slate-600"
              }`}></div>
            )}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 relative ${
              index < currentStep
                ? "bg-purple-600 text-white"
                : index === currentStep
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-800"
                : "bg-slate-700 text-slate-400"
            }`}>
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className={`text-xs mt-1 text-center leading-tight ${
              index === currentStep
                ? "text-purple-400 font-medium"
                : index < currentStep
                ? "text-slate-300"
                : "text-slate-500"
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


// ── MAIN ORDERS PAGE ─────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BACKEND_URL}/api/order/userorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token
        }
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders.reverse());
      }

    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ── DELETE ORDER ─────────────────────────────────────────────
  const deleteOrder = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;

    setDeletingId(orderId);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BACKEND_URL}/api/order/delete/${orderId}`, {
        method: "DELETE",
        headers: { token }
      });

      const data = await res.json();

      if (data.success) {
        // Remove from UI instantly without refetch
        setOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        alert("Failed to delete order: " + data.message);
      }

    } catch (error) {
      console.log("DELETE ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'packing':
        return { icon: FiPackage, color: 'text-orange-400', text: 'Packing' };
      case 'shipped':
        return { icon: FiTruck, color: 'text-blue-400', text: 'Shipped' };
      case 'out for delivery':
        return { icon: FiTruck, color: 'text-yellow-400', text: 'Out for Delivery' };
      case 'delivered':
        return { icon: FiCheckCircle, color: 'text-green-400', text: 'Delivered' };
      default:
        return { icon: FiClock, color: 'text-purple-400', text: status || "Order Placed" };
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900'>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10 animate-float-delay"></div>
      </div>

      <div className='relative z-10 flex justify-center pt-10 pb-20 px-4 sm:px-10'>
        <div className='w-full max-w-4xl'>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-200'>
              MY <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>ORDERS</span>
            </h1>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* LOADING */}
          {isLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='bg-slate-700/30 p-6 rounded-xl animate-pulse h-40'></div>
              ))}
            </div>

          ) : orders.length === 0 ? (

            <div className='text-center py-20 bg-slate-800/50 border border-slate-700 rounded-2xl'>
              <div className='w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiShoppingBag className='text-4xl text-gray-500' />
              </div>
              <h3 className='text-xl text-gray-300 mb-2'>No Orders Yet</h3>
              <p className='text-gray-500 mb-6'>Start shopping to see your orders here</p>
              <Link to="/collection" className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl'>
                Start Shopping
              </Link>
            </div>

          ) : (

            <div className='space-y-4'>
              {orders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                const isDeleting = deletingId === order._id;

                return (
                  <div
                    key={index}
                    className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-all ${isDeleting ? "opacity-50" : ""}`}
                  >
                    {/* Order header */}
                    <div className='flex justify-between items-center mb-4'>
                      <div className='flex items-center gap-3'>
                        <StatusIcon className={`text-xl ${statusInfo.color}`} />
                        <p className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className='text-gray-500 text-xs font-mono'>
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => deleteOrder(order._id)}
                          disabled={isDeleting}
                          className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete order"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Order details */}
                    <div className='grid sm:grid-cols-2 gap-2 text-sm mb-2'>
                      <p>
                        <span className='text-gray-500'>Amount:</span>
                        <span className='ml-2 text-white font-medium'>₹{order.amount}</span>
                      </p>
                      <p>
                        <span className='text-gray-500'>Payment:</span>
                        <span className='ml-2 text-white'>{order.paymentMethod}</span>
                      </p>
                      <p>
                        <span className='text-gray-500'>Date:</span>
                        <span className='ml-2 text-white'>
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        <span className='text-gray-500'>Items:</span>
                        <span className='ml-2 text-white'>
                          {order.items?.length || 0} Products
                        </span>
                      </p>
                    </div>

                    {/* Live Order Tracker */}
                    <OrderTracker
                      orderId={order._id}
                      initialStatus={order.status}
                    />

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s infinite; }
        .animate-float-delay { animation: float 6s infinite 2s; }
      `}</style>
    </div>
  );
};

export default Orders;