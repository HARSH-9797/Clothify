import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from "react-icons/fi"
import { ShopContext } from "../components/context/ShopContext"

const Login = () => {
  const navigate = useNavigate()
  const { setToken, fetchCart } = useContext(ShopContext)

  const [currentState, setCurrentState] = useState("Login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  useEffect(() => {
    validateForm()
  }, [email, password, name, currentState])

  const validateForm = () => {
    let tempErrors = {}
    let valid = true

    if (currentState === "Sign Up" && !name) {
      tempErrors.name = "Name is required"
      valid = false
    }

    if (!email) {
      tempErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid"
      valid = false
    }

    if (!password) {
      tempErrors.password = "Password is required"
      valid = false
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    setErrors(tempErrors)
    setIsFormValid(valid)
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const url = currentState === "Login"
        ? "http://127.0.0.1:4000/api/user/login"
        : "http://127.0.0.1:4000/api/user/register"

      const bodyData = currentState === "Login"
        ? { email, password, rememberMe }
        : { name, email, password }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("username", data.name)
        setToken(data.token)
        fetchCart()
        setSuccessMessage("Authentication successful! Redirecting...")
        setTimeout(() => { navigate("/") }, 1500)
      } else {
        setErrors({ form: data.message || "Authentication failed. Please try again." })
      }

    } catch (error) {
      setErrors({ form: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // ← Google OAuth: redirects to Express which redirects to Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google"
  }

  const toggleState = () => {
    setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
    setErrors({})
    setSuccessMessage("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[420px] border border-white/20 transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {currentState}
        </h2>
        <p className="text-white/70 text-center mb-6">
          {currentState === "Login"
            ? "Welcome back! Please login to your account."
            : "Create a new account to get started."}
        </p>

        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mb-4 flex items-center">
            <FiCheck className="mr-2" />
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4 flex items-center">
            <FiAlertCircle className="mr-2" />
            {errors.form}
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          {currentState === "Sign Up" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg outline-none bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all`}
              />
              {errors.name && <p className="text-red-300 text-xs mt-1 ml-2">{errors.name}</p>}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg outline-none bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all`}
            />
            {errors.email && <p className="text-red-300 text-xs mt-1 ml-2">{errors.email}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pl-10 pr-10 rounded-lg outline-none bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all`}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
            </div>
            {errors.password && <p className="text-red-300 text-xs mt-1 ml-2">{errors.password}</p>}
          </div>

          {currentState === "Login" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500 focus:ring-opacity-25"
                />
                Remember me
              </label>
              <span
  onClick={() => setShowForgot(true)}
  className="text-purple-300 text-sm hover:text-purple-200 transition-colors cursor-pointer"
>
  Forgot password?
</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              currentState
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-white/70">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          {/* ← GOOGLE BUTTON — now wired to OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="flex justify-center items-center py-2 px-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
            title="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>

          {/* GitHub — decorative for now */}
          <button className="flex justify-center items-center py-2 px-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>

          {/* Instagram — decorative for now */}
          <button className="flex justify-center items-center py-2 px-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162s6.162 2.759 6.162 6.162-2.759 6.162-6.162 6.162-6.162-2.759-6.162-6.162zm1.621 0c0 2.507 2.034 4.541 4.541 4.541s4.541-2.034 4.541-4.541-2.034-4.541-4.541-4.541-4.541 2.034-4.541 4.541zm9.908-6.326c0 .796-.646 1.44-1.44 1.44s-1.44-.646-1.44-1.44.646-1.439 1.44-1.439 1.44.646 1.44 1.439z"/>
            </svg>
          </button>
        </div>

        <div className="text-white/80 text-sm text-center">
          {currentState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <span
                className="font-bold text-purple-300 cursor-pointer hover:text-purple-200 transition-colors"
                onClick={toggleState}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="font-bold text-purple-300 cursor-pointer hover:text-purple-200 transition-colors"
                onClick={toggleState}
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}

export default Login