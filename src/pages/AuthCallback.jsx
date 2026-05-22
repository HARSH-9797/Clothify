import { useEffect, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ShopContext } from "../components/context/ShopContext"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setToken, fetchCart } = useContext(ShopContext)

  useEffect(() => {
    const token = searchParams.get("token")
    const name = searchParams.get("name")

    if (token) {
      // Save token exactly like normal login
      localStorage.setItem("token", token)
      localStorage.setItem("username", name)

      // Update React state so navbar shows logged in
      setToken(token)

      // Load cart immediately
      fetchCart()

      // Redirect to home
      navigate("/")
    } else {
      // Something went wrong with Google OAuth
      navigate("/login")
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl">Signing you in with Google...</p>
      </div>
    </div>
  )
}

export default AuthCallback