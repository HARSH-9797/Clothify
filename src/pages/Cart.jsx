import React, { useContext } from 'react'
import { ShopContext } from '../components/context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Cart = () => {

  const { cartItems, products, removeFromCart, getCartAmount, currency, delivery_fee, updateQuantity } = useContext(ShopContext)

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900'>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay-1"></div>
      </div>

      <div className='relative z-10 flex flex-col items-center pt-10 pb-20 px-4 sm:px-10 lg:px-20'>
        <div className='w-full max-w-5xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-10'>
          <h1 className='text-3xl sm:text-4xl mb-8 font-bold text-gray-200'>YOUR <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>CART</span></h1>

          {/* Cart Items */}
          {Object.keys(cartItems).length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-xl text-gray-400'>Your cart is empty</p>
              <Link to="/collection" className='inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all'>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className='space-y-4'>
              {Object.keys(cartItems).map((itemId) => {
                const product = products.find(p => p._id === itemId)
                if (!product || cartItems[itemId] === 0) return null

                return (
                  <div key={itemId} className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-700/30 border border-slate-600 rounded-xl p-4'>
                    {/* Product Info */}
                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                      <img
                        src={Array.isArray(product.image) ? product.image[0] : product.image}
                        className='w-20 h-20 object-cover rounded-lg'
                        alt={product.name}
                      />
                      <div>
                        <p className='font-semibold text-gray-200'>{product.name}</p>
                        <p className='text-gray-400'>{currency}{product.price}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start'>
                      <button
                        onClick={() => updateQuantity(itemId, cartItems[itemId] - 1)}
                        className='w-8 h-8 bg-slate-600 text-gray-200 border border-slate-500 rounded-lg flex items-center justify-center hover:bg-slate-500 transition-colors'
                      >
                        -
                      </button>
                      <p className='text-gray-200 w-8 text-center'>{cartItems[itemId]}</p>
                      <button
                        onClick={() => updateQuantity(itemId, cartItems[itemId] + 1)}
                        className='w-8 h-8 bg-slate-600 text-gray-200 border border-slate-500 rounded-lg flex items-center justify-center hover:bg-slate-500 transition-colors'
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className='font-semibold text-gray-200 w-full sm:w-auto text-right sm:text-left'>
                      {currency}{product.price * cartItems[itemId]}
                    </p>

                    {/* Remove Item */}
                    <img
                      src={assets.bin_icon}
                      className='w-5 h-5 cursor-pointer filter brightness-0 invert hover:opacity-70 transition-opacity'
                      onClick={() => removeFromCart(itemId)}
                      alt="Remove item"
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Total Section */}
          {Object.keys(cartItems).length > 0 && (
            <div className='mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4'>
              <div className='w-full sm:w-auto space-y-2'>
                <p className='text-gray-400'>Subtotal: <span className='text-gray-200 font-medium'>{currency}{getCartAmount()}</span></p>
                <p className='text-gray-400'>Delivery Fee: <span className='text-gray-200 font-medium'>{currency}{delivery_fee}</span></p>
                <h2 className='text-2xl font-bold text-gray-100 mt-2'>
                  Total: {currency}{getCartAmount() + delivery_fee}
                </h2>
              </div>

              {/* Checkout Button */}
              <Link to="/place-order" className='w-full sm:w-auto'>
                <button className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float 6s ease-in-out infinite; animation-delay: 2s; }
      `}</style>
    </div>
  )
}

export default Cart