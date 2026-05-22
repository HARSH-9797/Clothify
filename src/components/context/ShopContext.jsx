import { createContext, useState, useEffect } from "react";
import { products as staticProducts } from "../../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {

  const currency = "₹";
  const delivery_fee = 10;

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const backendUrl = "http://127.0.0.1:4000";


  // ── FETCH PRODUCTS ───────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/product/list`);
      const data = await res.json();

      if (data.success) {
        const merged = data.products.map((dbProduct) => {
          const localMatch = staticProducts.find(
            (p) => p.name === dbProduct.name
          );
          return {
            ...dbProduct,
            image: localMatch ? localMatch.image : dbProduct.image,
          };
        });
        setProducts(merged);
      }

    } catch (error) {
      console.log("PRODUCTS ERROR:", error);
    }
  };


  // ── FETCH CART ───────────────────────────────────────────────
  const fetchCart = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const res = await fetch(`${backendUrl}/api/cart/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: storedToken,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCartItems(data.cartData || {});
      }

    } catch (error) {
      console.log("CART ERROR:", error);
    }
  };


  // ── ON APP LOAD ──────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchCart();
    }
  }, []);


  // ── ADD TO CART ──────────────────────────────────────────────
  const addToCart = async (itemId) => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: storedToken,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data.success) {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
        }));
      }

    } catch (error) {
      console.log("ADD TO CART ERROR:", error);
    }
  };


  // ── REMOVE FROM CART ─────────────────────────────────────────
  const removeFromCart = async (itemId) => {
    const storedToken = localStorage.getItem("token");

    try {
      const res = await fetch(`${backendUrl}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: storedToken,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data.success) {
        setCartItems(data.cartData);
      }

    } catch (error) {
      console.log("REMOVE FROM CART ERROR:", error);
    }
  };


  // ── UPDATE QUANTITY ──────────────────────────────────────────
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const storedToken = localStorage.getItem("token");

    try {
      await fetch(`${backendUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: storedToken,
        },
        body: JSON.stringify({ itemId }),
      });

      setCartItems((prev) => ({
        ...prev,
        [itemId]: quantity,
      }));

    } catch (error) {
      console.log("UPDATE QUANTITY ERROR:", error);
    }
  };


  // ── LOGOUT ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setCartItems({});
  };


  // ── CART TOTAL ───────────────────────────────────────────────
  const getCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      const product = products.find((p) => p._id === item);
      if (product) {
        total += product.price * cartItems[item];
      }
    }
    return total;
  };


  // ── CART COUNT ───────────────────────────────────────────────
  const getCartCount = () => {
    let count = 0;
    for (const item in cartItems) {
      count += cartItems[item];
    }
    return count;
  };


  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    getCartCount,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    fetchCart,
    token,       // ← navbar uses this to show login/logout
    setToken,    // ← login page calls this after successful login
    logout,      // ← navbar calls this on logout click
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );

};

export default ShopContextProvider;