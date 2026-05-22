import React, { useContext } from 'react'
import { ShopContext } from './context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {

  const { currency } = useContext(ShopContext);

  return (
    // Main card container with dark theme
    <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 group transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'>
      <Link className='text-gray-200' to={`/product/${id}`}>

        {/* Image Container */}
        <div className='relative overflow-hidden rounded-lg bg-slate-900/50'>
          {/* SALE BADGE - Styled with a vibrant gradient */}
          <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg">
            SALE
          </span>

          {/* Product Image with hover effect */}
          <img
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out'
            src={Array.isArray(image) ? image[0] : image}
            alt={name}
          />
        </div>

        {/* Product Details */}
        <div className='mt-3'>
          {/* PRODUCT NAME */}
          <p className='text-sm font-medium text-gray-200 truncate group-hover:text-purple-400 transition-colors'>{name}</p>

          {/* STAR RATING */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-xs text-gray-500">(25)</span> {/* Optional: Add review count */}
          </div>

          {/* PRICE */}
          <div className='flex items-center justify-between mt-2'>
            <p className='text-lg font-semibold text-gray-100'>{currency}{price}</p>
            {/* Optional: Old Price for sale items */}
            <p className='text-xs text-gray-500 line-through'>$89.99</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem