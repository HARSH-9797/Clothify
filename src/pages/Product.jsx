import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../components/context/ShopContext'

const BACKEND_URL = "http://localhost:4000"

const Product = () => {
    const { productId } = useParams()
    const { products, addToCart, token } = useContext(ShopContext)

    const [productData, setProductData] = useState(null)
    const [image, setImage] = useState('')

    // Reviews state
    const [reviews, setReviews] = useState([])
    const [avgRating, setAvgRating] = useState(0)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [reviewLoading, setReviewLoading] = useState(false)
    const [reviewMessage, setReviewMessage] = useState('')

    useEffect(() => {
        const product = products.find(item => item._id === productId)
        if (product) {
            setProductData(product)
            setImage(Array.isArray(product.image) ? product.image[0] : product.image)
        }
    }, [productId, products])

    // Fetch reviews from PostgreSQL via Prisma
    useEffect(() => {
        if (productId) fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/reviews/${productId}`)
            const data = await res.json()
            if (data.success) {
                setReviews(data.reviews)
                setAvgRating(data.avgRating)
            }
        } catch (error) {
            console.log("REVIEWS ERROR:", error)
        }
    }

    const submitReview = async (e) => {
        e.preventDefault()
        if (!token) {
            setReviewMessage("Please login to submit a review")
            return
        }
        setReviewLoading(true)
        setReviewMessage("")

        try {
            const res = await fetch(`${BACKEND_URL}/api/reviews/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                    username: localStorage.getItem("username") || "User"
                })
            })
            const data = await res.json()
            if (data.success) {
                setComment("")
                setRating(5)
                setReviewMessage("Review submitted! ✅")
                fetchReviews() // refresh reviews
            } else {
                setReviewMessage(data.message)
            }
        } catch (error) {
            setReviewMessage("Something went wrong")
        } finally {
            setReviewLoading(false)
        }
    }

    const deleteReview = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
                method: "DELETE",
                headers: { token }
            })
            const data = await res.json()
            if (data.success) fetchReviews()
        } catch (error) {
            console.log(error)
        }
    }

    if (!productData) return <div className='opacity-0'></div>

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

            {/* Product Info */}
            <div className='flex gap-12 flex-col sm:flex-row'>

                {/* LEFT — Images */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:w-[18%] w-full'>
                        {Array.isArray(productData.image) &&
                            productData.image.map((item, index) => (
                                <img key={index} src={item} onClick={() => setImage(item)}
                                    className='w-[24%] sm:w-full sm:mb-3 cursor-pointer' alt="" />
                            ))
                        }
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img src={image} className='w-full h-auto' alt="" />
                    </div>
                </div>

                {/* RIGHT — Details */}
                <div className='flex-1'>
                    <h1 className='text-2xl font-medium text-gray-200'>{productData.name}</h1>

                    {/* Average rating */}
                    <div className='flex items-center gap-2 mt-2'>
                        {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-lg ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                        ))}
                        <span className='text-gray-400 text-sm'>({reviews.length} reviews) · {avgRating}/5</span>
                    </div>

                    <p className='mt-2 text-xl text-gray-200'>₹{productData.price}</p>
                    <p className='mt-4 text-gray-400'>{productData.description}</p>

                    <button
                        onClick={() => addToCart(productData._id)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 mt-6 rounded-xl hover:shadow-lg transition-all"
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>

            {/* ── REVIEWS SECTION ─────────────────────────────── */}
            {/* Data stored in PostgreSQL via Prisma — not MongoDB */}
            <div className='mt-16'>
                <h2 className='text-2xl font-bold text-gray-200 mb-6'>
                    Customer <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>Reviews</span>
                    <span className='text-sm font-normal text-gray-500 ml-2'>(stored in PostgreSQL)</span>
                </h2>

                {/* Existing Reviews */}
                {reviews.length === 0 ? (
                    <p className='text-gray-500 mb-6'>No reviews yet. Be the first!</p>
                ) : (
                    <div className='space-y-4 mb-8'>
                        {reviews.map((review) => (
                            <div key={review.id} className='bg-slate-800/50 border border-slate-700 rounded-xl p-4'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <p className='text-white font-medium'>{review.username}</p>
                                        <div className='flex gap-1 mt-1'>
                                            {[1,2,3,4,5].map(star => (
                                                <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-gray-500 text-xs'>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        {/* Delete own review */}
                                        {review.userId === localStorage.getItem("userId") && (
                                            <button onClick={() => deleteReview(review.id)}
                                                className='text-red-400 text-xs hover:text-red-300'>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className='text-gray-300 mt-2 text-sm'>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Review Form */}
                {token ? (
                    <div className='bg-slate-800/50 border border-slate-700 rounded-2xl p-6'>
                        <h3 className='text-gray-200 font-semibold mb-4'>Write a Review</h3>

                        {reviewMessage && (
                            <div className={`p-3 rounded-xl mb-4 text-sm ${reviewMessage.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {reviewMessage}
                            </div>
                        )}

                        <form onSubmit={submitReview} className='space-y-4'>
                            {/* Star Rating */}
                            <div>
                                <label className='text-gray-400 text-sm mb-2 block'>Rating</label>
                                <div className='flex gap-2'>
                                    {[1,2,3,4,5].map(star => (
                                        <button key={star} type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}>
                                            ★
                                        </button>
                                    ))}
                                    <span className='text-gray-400 text-sm self-center ml-2'>{rating}/5</span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className='text-gray-400 text-sm mb-2 block'>Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    rows={3} required
                                    className='w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500'
                                />
                            </div>

                            <button type="submit" disabled={reviewLoading}
                                className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-50'>
                                {reviewLoading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center'>
                        <p className='text-gray-400'>Please <a href="/login" className='text-purple-400'>login</a> to write a review</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Product