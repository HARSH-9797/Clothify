import { useState, useContext } from "react"
import { ShopContext } from "../components/context/ShopContext"

const AddProduct = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const token = localStorage.getItem("token")
    const formData = new FormData()

    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("category", category)
    formData.append("subCategory", subCategory)
    formData.append("image", image)

    try {
      const res = await fetch("http://localhost:4000/api/product/add", {
        method: "POST",
        headers: { token },
        body: formData  // FormData — DO NOT set Content-Type header
      })

      const data = await res.json()

      if (data.success) {
        setMessage("✅ Product added successfully!")
        setName(""); setDescription(""); setPrice("")
        setImage(null); setPreview(null)
      } else {
        setMessage("❌ " + data.message)
      }

    } catch (err) {
      setMessage("❌ Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-10 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">
          Add <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Product</span>
        </h1>

        {message && (
          <div className={`p-4 rounded-xl mb-6 ${message.startsWith("✅") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">

          {/* Image Upload */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Product Image</label>
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              {preview ? (
                <img src={preview} className="w-40 h-40 object-cover rounded-lg mx-auto" />
              ) : (
                <p className="text-gray-500">Click to upload image</p>
              )}
            </div>
            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Name */}
          <input
            type="text" placeholder="Product Name" value={name}
            onChange={e => setName(e.target.value)} required
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl"
          />

          {/* Description */}
          <textarea
            placeholder="Description" value={description}
            onChange={e => setDescription(e.target.value)} required rows={3}
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl"
          />

          {/* Price */}
          <input
            type="number" placeholder="Price (₹)" value={price}
            onChange={e => setPrice(e.target.value)} required
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl"
          />

          {/* Category */}
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          {/* SubCategory */}
          <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Dress">Dress</option>
          </select>

          <button
            type="submit" disabled={isLoading || !image}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {isLoading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct