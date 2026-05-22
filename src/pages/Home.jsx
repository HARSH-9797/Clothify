import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { FiTrendingUp, FiZap, FiStar, FiGift, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check visibility of sections
      const sections = ['latest', 'bestseller', 'policy', 'newsletter'];
      const newVisibility = {};
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.75;
          newVisibility[section] = isInView;
        }
      });
      
      setIsVisible(prev => ({ ...prev, ...newVisibility }));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial visibility
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay-1"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay-2"></div>
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Enhanced Trending Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-orange-400/20 backdrop-blur-sm border-y border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-orange-400/10 animate-pulse"></div>
        <div className="relative py-4 overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4">
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiTrendingUp className="text-orange-400 animate-pulse" />
                  TRENDING NOW
                </span>
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiZap className="text-yellow-400" />
                  FLAT 40% OFF
                </span>
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiStar className="text-purple-400" />
                  NEW ARRIVALS
                </span>
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiTruck className="text-green-400" />
                  FREE SHIPPING
                </span>
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiGift className="text-pink-400" />
                  SUMMER COLLECTION
                </span>
                <span className="flex items-center gap-2 text-white/90 font-medium">
                  <FiZap className="text-orange-400 animate-pulse" />
                  LIMITED SALE
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Collection Section */}
      <section 
        id="latest"
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible.latest ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium">NEW SEASON</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Latest
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Collection
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Discover our newest arrivals with cutting-edge designs and premium materials
            </p>
          </div>
          
          <LatestCollection />
        </div>
      </section>

      {/* Best Seller Section */}
      <section 
        id="bestseller"
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible.bestseller ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <FiStar className="text-yellow-400" />
              <span className="text-white/80 text-sm font-medium">TOP RATED</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Best
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Sellers
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our most loved products chosen by thousands of satisfied customers
            </p>
          </div>
          
          <BestSeller />
        </div>
      </section>

      {/* Enhanced Policy Section */}
      <section 
        id="policy"
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible.policy ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <FiShield className="text-green-400" />
              <span className="text-white/80 text-sm font-medium">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Promises
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We stand behind our products with unmatched service and quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiTruck className="text-white text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">Free Shipping</h3>
                <p className="text-white/60 text-sm">On all orders over $50</p>
              </div>
            </div>
            
            <div className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiRefreshCw className="text-white text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">Easy Returns</h3>
                <p className="text-white/60 text-sm">30-day return policy</p>
              </div>
            </div>
            
            <div className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiShield className="text-white text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">Secure Payment</h3>
                <p className="text-white/60 text-sm">100% secure transactions</p>
              </div>
            </div>
            
            <div className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiGift className="text-white text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">Member Benefits</h3>
                <p className="text-white/60 text-sm">Exclusive rewards & offers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        id="newsletter"
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <FiGift className="text-purple-400" />
                <span className="text-white/80 text-sm font-medium">EXCLUSIVE OFFERS</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Stay in the
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Loop
                </span>
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion tips.
              </p>
              
              <NewsletterBox />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 4s;
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .bg-grid-16 {
          background-size: 16px 16px;
        }
      `}</style>
    </div>
  )
}

export default Home