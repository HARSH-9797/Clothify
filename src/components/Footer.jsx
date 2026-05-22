import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiSend, FiFacebook, FiInstagram, FiTwitter, FiArrowUp } from 'react-icons/fi'

const Footer = () => {

  // ← useState MUST be inside the component function
  const [email, setEmail] = useState('')
  const [subMessage, setSubMessage] = useState('')

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = async () => {
    if (!email) return
    try {
      const res = await fetch('http://localhost:4000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setSubMessage('✅ Subscribed! Check your email.')
        setEmail('')
      } else {
        setSubMessage('❌ ' + data.message)
      }
    } catch {
      setSubMessage('❌ Something went wrong')
    }
  }

  return (
    <>
      <div className='relative h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-pulse'></div>
      
      <footer className='relative bg-slate-900 text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20'></div>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:40px_40px] opacity-5'></div>
        </div>
        
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
            
            {/* BRAND SECTION */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='group relative inline-block'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity'></div>
                <img src={assets.logo2} className='relative w-40 h-auto transition-transform group-hover:scale-105' alt="Clothify Logo" />
              </div>
              
              <p className='text-white/70 leading-relaxed max-w-md'>
                Clothify is your destination for cutting-edge fashion. We blend style, comfort, and innovation to bring you clothing that stands out.
              </p>
              
              {/* Newsletter */}
              <div className='space-y-3'>
                <p className='text-white font-semibold text-sm'>STAY UPDATED</p>
                <div className='relative max-w-sm'>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all'
                  />
                  <button
                    onClick={handleSubscribe}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:scale-110 transition-transform'
                  >
                    <FiSend className='text-white text-sm' />
                  </button>
                </div>
                {subMessage && <p className='text-green-400 text-sm mt-2'>{subMessage}</p>}
              </div>
              
              {/* Social Icons */}
              <div className='flex gap-3 pt-4'>
                <a href="#" className='group relative p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all'>
                  <FiFacebook className='text-white text-lg group-hover:scale-110 transition-transform' />
                </a>
                <a href="#" className='group relative p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all'>
                  <FiInstagram className='text-white text-lg group-hover:scale-110 transition-transform' />
                </a>
                <a href="#" className='group relative p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all'>
                  <FiTwitter className='text-white text-lg group-hover:scale-110 transition-transform' />
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className='space-y-6'>
              <div>
                <h3 className='text-white font-bold text-lg mb-4 relative inline-block'>
                  QUICK LINKS
                  <div className='absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600'></div>
                </h3>
                <ul className='space-y-3'>
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/collection', label: 'Collection' },
                    { to: '/about', label: 'About Us' },
                    { to: '/contact', label: 'Contact' },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className='text-white/70 hover:text-white transition-all duration-300 flex items-center gap-2 group'>
                        <span className='w-0 group-hover:w-4 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300'></span>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className='space-y-6'>
              <div>
                <h3 className='text-white font-bold text-lg mb-4 relative inline-block'>
                  GET IN TOUCH
                  <div className='absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600'></div>
                </h3>
                <ul className='space-y-4'>
                  <li className='flex items-start gap-3 text-white/70'>
                    <div className='mt-1 p-2 bg-white/10 rounded-lg'>
                      <FiPhone className='text-sm' />
                    </div>
                    <div>
                      <p className='font-medium text-white'>Phone</p>
                      <p className='text-sm'>+91 98765 43210</p>
                    </div>
                  </li>
                  <li className='flex items-start gap-3 text-white/70'>
                    <div className='mt-1 p-2 bg-white/10 rounded-lg'>
                      <FiMail className='text-sm' />
                    </div>
                    <div>
                      <p className='font-medium text-white'>Email</p>
                      <p className='text-sm'>support@clothify.com</p>
                    </div>
                  </li>
                  <li className='flex items-start gap-3 text-white/70'>
                    <div className='mt-1 p-2 bg-white/10 rounded-lg'>
                      <FiMapPin className='text-sm' />
                    </div>
                    <div>
                      <p className='font-medium text-white'>Address</p>
                      <p className='text-sm'>Fashion Street, Mumbai</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className='mt-16 pt-8 border-t border-white/10'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <p className='text-white/60 text-sm'>
                © 2026 Clothify. All rights reserved. Made with ❤️ in India
              </p>
              <button
                onClick={scrollToTop}
                className='group relative px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2'
              >
                <span className='text-white/70 text-sm group-hover:text-white'>Back to Top</span>
                <FiArrowUp className='text-white/70 group-hover:text-white group-hover:-translate-y-1 transition-all' />
              </button>
            </div>
          </div>
        </div>

        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50'></div>
      </footer>
    </>
  )
}

export default Footer