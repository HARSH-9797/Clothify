import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const OrderTracker = ({ orderId }) => {
  const [status, setStatus] = useState("Order Placed")
  const [updated, setUpdated] = useState(null)

  useEffect(() => {
    const socket = io("http://localhost:4000", { withCredentials: true })

    // Join this order's room
    socket.emit("joinOrder", orderId)

    // Listen for status updates from admin
    socket.on("statusUpdate", (data) => {
      setStatus(data.status)
      setUpdated(new Date(data.updatedAt).toLocaleTimeString())
    })

    return () => socket.disconnect()
  }, [orderId])

  const steps = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"]
  const currentStep = steps.indexOf(status)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Live Order Tracking</h3>
      
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${index <= currentStep 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                : "bg-slate-700 text-slate-400"}`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className={`text-xs text-center ${index <= currentStep ? "text-purple-400" : "text-slate-500"}`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-full mt-4 ${index < currentStep ? "bg-purple-600" : "bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className="text-sm text-slate-400">Current status: </span>
        <span className="text-purple-400 font-medium">{status}</span>
        {updated && <span className="text-slate-500 text-xs ml-2">· updated at {updated}</span>}
      </div>
    </div>
  )
}

export default OrderTracker