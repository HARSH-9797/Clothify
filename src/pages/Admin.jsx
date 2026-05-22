import React, { useEffect, useState } from "react";

const Admin = () => {

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const backendUrl = "http://127.0.0.1:4000";


  // 🔹 FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await fetch(`${backendUrl}/api/product/list`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }

    } catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {
    fetchProducts();
  }, []);


  // 🔹 ADD PRODUCT
  const addProduct = async () => {

    try {

      const res = await fetch(`${backendUrl}/api/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price, image })
      });

      const data = await res.json();

      if (data.success) {
        alert("Product Added ✅");

        setName("");
        setPrice("");
        setImage("");

        fetchProducts(); // refresh
      }

    } catch (error) {
      console.log(error);
    }

  };


  // 🔹 DELETE PRODUCT
  const deleteProduct = async (id) => {

    try {

      const res = await fetch(`${backendUrl}/api/product/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.success) {
        alert("Deleted ❌");
        fetchProducts();
      }

    } catch (error) {
      console.log(error);
    }

  };


  return (

    <div className="min-h-screen p-10">

      <h1 className="text-3xl mb-8 font-bold">ADMIN PANEL</h1>

      {/* ADD PRODUCT */}

      <div className="flex flex-col gap-3 max-w-md mb-10">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={addProduct}
          className="bg-black text-white py-2"
        >
          ADD PRODUCT
        </button>

      </div>


      {/* PRODUCT LIST */}

      <h2 className="text-2xl mb-4">ALL PRODUCTS</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

        {products.map((item) => (

          <div key={item._id} className="border p-3 rounded">

            <img src={item.image} className="w-full h-40 object-cover" alt="" />

            <p className="mt-2 font-medium">{item.name}</p>

            <p>₹{item.price}</p>

            <button
              onClick={() => deleteProduct(item._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1"
            >
              DELETE
            </button>

          </div>

        ))}

      </div>

    </div>

  );
};

export default Admin;