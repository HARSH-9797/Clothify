import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from './context/ShopContext'
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {

  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  const { getCartCount, setShowSearch, token, logout } = useContext(ShopContext)

  const username = localStorage.getItem("username")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate("/")
  }

  return (
    <>
      {/* NAVBAR */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md border-b border-white/10"
          : "bg-slate-900/70 backdrop-blur-sm"
      }`}>

        <div className='flex justify-between items-center px-6 py-4'>

          {/* LOGO */}
          <Link to="/" className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            Clothify
          </Link>

          {/* DESKTOP MENU */}
          <div className='hidden md:flex gap-8'>
            <NavLink to="/" className="text-white/70 hover:text-white">Home</NavLink>
            <NavLink to="/collection" className="text-white/70 hover:text-white">Collection</NavLink>
            <NavLink to="/about" className="text-white/70 hover:text-white">About</NavLink>
            <NavLink to="/contact" className="text-white/70 hover:text-white">Contact</NavLink>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex items-center gap-4'>

            {/* SEARCH */}
            <button onClick={() => setShowSearch(true)}>
              <FiSearch className='text-xl text-white/70 hover:text-white'/>
            </button>

            {/* USER */}
            {!token ? (
              <Link to="/login">
                <FiUser className='text-xl text-white/70 hover:text-white'/>
              </Link>
            ) : (
              <div className='relative'>

                <div
                  onClick={() => setOpen(!open)}
                  className='w-8 h-8 cursor-pointer rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold'
                >
                  {username ? username[0].toUpperCase() : "U"}
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className='absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-lg overflow-hidden'>

                    {/* User info */}
                    <div className='px-4 py-2 border-b border-white/10'>
                      <p className='text-white text-sm font-medium'>{username}</p>
                      <p className='text-white/40 text-xs'>Logged in</p>
                    </div>

                    {/* My Orders */}
                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className='block px-4 py-2 text-white/80 hover:bg-white/10 text-sm'
                    >
                      My Orders
                    </Link>

                    {/* Add Product — admin only */}
                    <Link
                      to="/add-product"
                      onClick={() => setOpen(false)}
                      className='block px-4 py-2 text-white/80 hover:bg-white/10 text-sm'
                    >
                      ➕ Add Product
                    </Link>

                    {/* Admin Dashboard — opens EJS SSR page */}
                    <a
                      href="http://localhost:4000/admin/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className='block px-4 py-2 text-white/80 hover:bg-white/10 text-sm'
                    >
                      📊 Admin Dashboard ↗
                    </a>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 text-sm border-t border-white/10'
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* CART */}
            <Link to="/cart" className='relative'>
              <FiShoppingBag className='text-xl text-white/70 hover:text-white'/>
              {getCartCount() > 0 && (
                <span className='absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-1 rounded-full'>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setVisible(true)} className='md:hidden'>
              <FiMenu className='text-xl text-white'/>
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}>

        <div className='flex justify-between items-center p-5 border-b border-white/10'>
          <h2 className='text-white text-lg'>Menu</h2>
          <FiX className='text-white text-xl cursor-pointer' onClick={() => setVisible(false)}/>
        </div>

        <div className='flex flex-col gap-6 p-6 text-white/80'>
          <NavLink to="/" onClick={() => setVisible(false)}>Home</NavLink>
          <NavLink to="/collection" onClick={() => setVisible(false)}>Collection</NavLink>
          <NavLink to="/about" onClick={() => setVisible(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setVisible(false)}>Contact</NavLink>
          {token && (
            <NavLink to="/orders" onClick={() => setVisible(false)}>My Orders</NavLink>
          )}
          {token && (
            <NavLink to="/add-product" onClick={() => setVisible(false)}>Add Product</NavLink>
          )}
          {token && (
            <a href="http://localhost:4000/admin/dashboard" target="_blank" rel="noreferrer">
              Admin Dashboard ↗
            </a>
          )}
          {token && (
            <button onClick={handleLogout} className='text-left text-red-400'>
              Logout
            </button>
          )}
        </div>

      </div>

      {/* SPACING */}
      <div className='h-16'></div>
    </>
  )
}

export default Navbar