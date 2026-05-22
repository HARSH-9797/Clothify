import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from './context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

  const { products } = useContext(ShopContext)

  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 10))
  }, [products])

  return (
    <div className='my-16'>

      <div className='text-center mb-10'>

        <Title text1={'LATEST'} text2={'COLLECTIONS'} />

        <p className='w-2/3 m-auto text-sm md:text-base text-gray-600 mt-3'>
          Discover the newest arrivals in fashion. Handpicked styles designed to keep you ahead of the trend.
        </p>

      </div>

      {/* Product Grid */}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>

        {
          latestProducts.map((item, index) => (

            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />

          ))
        }

      </div>

    </div>
  )
}

export default LatestCollection