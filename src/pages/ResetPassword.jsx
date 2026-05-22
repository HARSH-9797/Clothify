import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage("❌ Passwords don't match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("http://localhost:4000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      })
      const data = await res.json()
      if (data.success) {
        setMessage("✅ Password reset! Redirecting to login...")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        setMessage("❌ " + data.message)
      }
    } catch {
      setMessage("❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-[420px] border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Reset Password</h2>

        {message && (
          <div className={`p-3 rounded-xl mb-4 text-sm text-center ${message.startsWith("✅") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="password" placeholder="New Password" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={8}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
          />
          <input
            type="password" placeholder="Confirm Password" value={confirm}
            onChange={e => setConfirm(e.target.value)} required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
          />
          <button type="submit" disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword