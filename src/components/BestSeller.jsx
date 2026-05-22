import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from './context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { FiTrendingUp } from 'react-icons/fi'; // Importing an icon

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a slight delay for a smoother loading experience
        const timer = setTimeout(() => {
            const bestProduct = products.filter((item) => (item.bestseller));
            setBestSeller(bestProduct.slice(0, 5));
            setIsLoading(false);
        }, 500); // 500ms delay

        return () => clearTimeout(timer); // Cleanup the timer
    }, [products]); // Added products as a dependency

    return (
        <div className='relative py-20 bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900'>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay-1"></div>
            </div>

            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <div className='inline-flex items-center gap-2 mb-4'>
                        <FiTrendingUp className='text-3xl text-purple-400' />
                        <Title text1={'BEST'} text2={'SELLERS'} />
                    </div>
                    <p className='w-full sm:w-3/4 m-auto text-sm sm:text-base text-gray-400'>
                        Discover our most-loved pieces, chosen by you. These are the trending styles that are flying off the shelves.
                    </p>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    // Loading Skeleton
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className='bg-slate-700/50 border border-slate-600 rounded-2xl overflow-hidden animate-pulse'>
                                <div className='aspect-square bg-slate-600/50'></div>
                                <div className='p-4'>
                                    <div className='h-4 bg-slate-600/50 rounded mb-2'></div>
                                    <div className='h-4 bg-slate-600/50 rounded w-1/2'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                        {
                            bestSeller.map((item, index) => (
                                <div
                                    key={index}
                                    className='transform transition-all duration-500 hover:scale-105'
                                    style={{
                                        animationDelay: `₹ {index * 100}ms`
                                    }}
                                >
                                    <ProductItem
                                        id={item._id}
                                        image={item.image}
                                        name={item.name}
                                        price={item.price}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Call to Action Button */}
                {!isLoading && bestSeller.length > 0 && (
                    <div className='text-center mt-12'>
                        <Link
                            to="/collection"
                            className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                        >
                            View All Products
                            <FiTrendingUp className='text-xl' />
                        </Link>
                    </div>
                )}

                {/* Empty State (if no bestsellers exist) */}
                {!isLoading && bestSeller.length === 0 && (
                    <div className='text-center py-20'>
                        <p className='text-gray-500 text-lg'>No best-selling products to show at the moment.</p>
                        <Link to="/collection" className='inline-block mt-4 text-purple-400 hover:text-purple-300'>
                            Browse all products
                        </Link>
                    </div>
                )}
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

export default BestSeller