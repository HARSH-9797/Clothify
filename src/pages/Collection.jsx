import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../components/context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiSearch, FiSliders, FiTag, FiTrendingUp, FiClock } from 'react-icons/fi'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [viewMode, setViewMode] = useState('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])

  const toggleCategory = (e) => {
    const value = e.target.value
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value))
    } else {
      setCategory(prev => [...prev, value])
    }
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    if (subCategory.includes(value)) {
      setSubCategory(prev => prev.filter(item => item !== value))
    } else {
      setSubCategory(prev => [...prev, value])
    }
  }

  const applyFilter = () => {
    setIsLoading(true)
    setTimeout(() => {
      let productsCopy = products.slice()

      if (showSearch && search) {
        productsCopy = productsCopy.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (category.length > 0) {
        productsCopy = productsCopy.filter(item =>
          category.includes(item.category)
        )
      }

      if (subCategory.length > 0) {
        productsCopy = productsCopy.filter(item =>
          subCategory.includes(item.subCategory)
        )
      }

      setFilterProducts(productsCopy)
      setIsLoading(false)
    }, 300)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
        break
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
        break
      case 'newest':
        setFilterProducts(fpCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        break
      case 'popular':
        setFilterProducts(fpCopy.sort((a, b) => (b.sold || 0) - (a.sold || 0)))
        break
      default:
        applyFilter()
        break
    }
  }

  const removeFilter = (filterType, value) => {
    if (filterType === 'category') {
      setCategory(prev => prev.filter(item => item !== value))
    } else if (filterType === 'subCategory') {
      setSubCategory(prev => prev.filter(item => item !== value))
    }
  }

  const clearAllFilters = () => {
    setCategory([])
    setSubCategory([])
  }

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  useEffect(() => {
    const filters = []
    category.forEach(cat => filters.push({ type: 'category', value: cat }))
    subCategory.forEach(sub => filters.push({ type: 'subCategory', value: sub }))
    setActiveFilters(filters)
  }, [category, subCategory])

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900'>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay-1"></div>
      </div>

      <div className='relative z-10 flex flex-col lg:flex-row gap-8 pt-10 px-4 lg:px-8'>
        
        {/* FILTER SIDEBAR */}
        <div className={`lg:w-80 transition-all duration-500 ${showFilter ? 'block' : 'hidden lg:block'}`}>
          <div className='sticky top-4'>
            {/* Filter Header */}
            <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center'>
                    <FiSliders className='text-gray-200' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-200'>Filters</h3>
                </div>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className='lg:hidden text-gray-400 hover:text-gray-200'
                >
                  <FiX className='text-xl' />
                </button>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className='mb-6'>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-sm text-gray-500'>Active Filters</p>
                    <button
                      onClick={clearAllFilters}
                      className='text-xs text-purple-400 hover:text-purple-300'
                    >
                      Clear All
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className='inline-flex items-center gap-1 px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-gray-300'
                      >
                        {filter.value}
                        <button
                          onClick={() => removeFilter(filter.type, filter.value)}
                          className='ml-1 hover:text-gray-200'
                        >
                          <FiX className='text-xs' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <FiTag className='text-purple-400' />
                <h4 className='font-semibold text-gray-200'>Categories</h4>
              </div>
              <div className='space-y-3'>
                {['Men', 'Women', 'Kids'].map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      category.includes(cat) 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30' 
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                      checked={category.includes(cat)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className='text-gray-300'>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <FiGrid className='text-purple-400' />
                <h4 className='font-semibold text-gray-200'>Product Type</h4>
              </div>
              <div className='space-y-3'>
                {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      subCategory.includes(type) 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30' 
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={type}
                      onChange={toggleSubCategory}
                      checked={subCategory.includes(type)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className='text-gray-300'>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT SECTION */}
        <div className='flex-1'>
          {/* Header */}
          <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-200 mb-2'>
                  All <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>Collections</span>
                </h1>
                <p className='text-gray-500'>
                  {filterProducts.length} products found
                </p>
              </div>
              
              <div className='flex items-center gap-3'>
                {/* View Mode Toggle */}
                <div className='flex items-center bg-slate-700/50 border border-slate-600 rounded-xl p-1'>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-slate-600 text-gray-200' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <FiGrid className='text-lg' />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-slate-600 text-gray-200' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <FiList className='text-lg' />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className='relative'>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className='appearance-none bg-slate-700/50 border border-slate-600 text-gray-200 px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer'
                  >
                    <option value="relevant" className='bg-slate-800'>Sort: Relevant</option>
                    <option value="low-high" className='bg-slate-800'>Price: Low to High</option>
                    <option value="high-low" className='bg-slate-800'>Price: High to Low</option>
                    <option value="newest" className='bg-slate-800'>Newest First</option>
                    <option value="popular" className='bg-slate-800'>Most Popular</option>
                  </select>
                  <FiChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none' />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className='lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-200 rounded-xl'
                >
                  <FiFilter />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className='bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden animate-pulse'
                >
                  <div className='aspect-square bg-slate-700/50'></div>
                  <div className='p-4'>
                    <div className='h-4 bg-slate-700/50 rounded mb-2'></div>
                    <div className='h-4 bg-slate-700/50 rounded w-1/2 mb-2'></div>
                    <div className='h-6 bg-slate-700/50 rounded w-1/3'></div>
                  </div>
                </div>
              ))
            ) : (
              filterProducts.map((item, index) => (
                <div
                  key={index}
                  className='transform transition-all duration-500 hover:scale-105'
                  style={{
                    animationDelay: `₹ {index * 100}ms`
                  }}
                >
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                  />
                </div>
              ))
            )}
          </div>

          {/* No Products Found */}
          {filterProducts.length === 0 && !isLoading && (
            <div className='text-center py-20'>
              <div className='w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiSearch className='text-4xl text-gray-500' />
              </div>
              <h3 className='text-xl font-semibold text-gray-300 mb-2'>No products found</h3>
              <p className='text-gray-500 mb-6'>Try adjusting your filters or search terms</p>
              <button
                onClick={clearAllFilters}
                className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-200 rounded-xl hover:shadow-lg transition-all'
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default Collection