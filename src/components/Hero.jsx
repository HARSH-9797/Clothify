import React, { useState, useEffect } from 'react'
import { assets } from "../assets/assets"
import { Link } from "react-router-dom"
import { FiArrowRight, FiShoppingBag, FiStar, FiZap } from "react-icons/fi"

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <FiZap />, title: "Lightning Fast", desc: "Same day delivery" },
    { icon: <FiStar />, title: "Premium Quality", desc: "Handpicked items" },
    { icon: <FiShoppingBag />, title: "Exclusive Deals", desc: "Members only" }
  ];

  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl my-8'>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 flex flex-col lg:flex-row'>
        
        {/* Left Side */}
        <div className='w-full lg:w-1/2 flex items-center justify-center py-16 px-8 lg:px-16'>
          <div className={`max-w-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <p className='text-white/80 text-sm font-medium'>
                OUR BEST SELLERS
              </p>
            </div>

            {/* Main Heading */}
            <h1 className='text-5xl lg:text-7xl font-bold text-white leading-tight mb-6'>
              Latest
              <span className='block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Arrivals
              </span>
            </h1>

            {/* Description */}
            <p className='text-white/70 text-lg mb-8 max-w-md'>
              Discover our newest collection with cutting-edge designs and premium materials that define the future of fashion.
            </p>

            {/* Features */}
            <div className='flex flex-col gap-3 mb-8'>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 cursor-pointer ${
                    activeFeature === index ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'opacity-70'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className='text-purple-400 text-xl'>
                    {feature.icon}
                  </div>
                  <div>
                    <p className='text-white font-medium'>{feature.title}</p>
                    <p className='text-white/60 text-sm'>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link to="/collection" className='inline-flex items-center group'>
              <div className='relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                <span className='relative z-10 flex items-center gap-2'>
                  SHOP NOW
                  <FiArrowRight className='transform transition-transform duration-300 group-hover:translate-x-1' />
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform transition-transform duration-300 translate-y-full group-hover:translate-y-0'></div>
              </div>
            </Link>

            {/* Social Proof */}
            <div className='flex items-center gap-6 mt-8'>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900'></div>
                ))}
              </div>
              <div>
                <p className='text-white font-medium'>10k+ Happy Customers</p>
                <div className='flex text-yellow-400'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className='fill-current' />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='w-full lg:w-1/2 relative min-h-[500px] lg:min-h-[700px]'>
          {/* Glowing Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          
          {/* Image Container with Glassmorphism Frame */}
          <div className='absolute inset-0 flex items-center justify-center p-8'>
            <div className='relative w-full h-full max-w-md max-h-[600px] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10'>
              {/* Animated Border */}
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-75 blur-sm z-0'></div>
              
              {/* Image */}
              <div className='relative z-10 w-full h-full overflow-hidden'>
                <img
                  className='w-full h-full object-cover transform transition-transform duration-7000 hover:scale-110'
                  src={assets.hero_img}
                  alt="Hero"
                />
                
                {/* Overlay Gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>
              </div>
              
              {/* Floating Offer Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                <span className='font-bold text-sm'>50% OFF</span>
              </div>
              
              {/* Interactive Hotspot */}
              <div 
                className="absolute bottom-20 left-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer group"
                style={{
                  transform: `translate(₹ {mousePosition.x * 0.02}px, ₹ {mousePosition.y * 0.02}px)`
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                <div className="absolute w-3 h-3 bg-white rounded-full"></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  New Collection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-16 {
          background-size: 16px 16px;
        }
      `}</style>
    </div>
  )
}

export default Hero