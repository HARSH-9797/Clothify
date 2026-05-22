import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import AuthCallback from "./pages/AuthCallback"
import AddProduct from "./pages/AddProduct"
import ResetPassword from "./pages/ResetPassword"

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ParticlesBackground from './components/ParticlesBackground'

const App = () => {
  const location = useLocation()

  // Pages where Navbar and Footer should be hidden
  const hideLayout = ["/login"].includes(location.pathname)

  return (
    <div className='relative min-h-screen'>

      <ParticlesBackground />

      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

        {/* Hide Navbar on login page */}
        {!hideLayout && <Navbar />}
        {!hideLayout && <SearchBar />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

        {/* Hide Footer on login page */}
        {!hideLayout && <Footer />}

      </div>

    </div>
  )
}

export default App