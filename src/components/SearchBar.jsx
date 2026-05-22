import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from './context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const{search,setSearch,showSearch,setShowSearch}=useContext(ShopContext);
    const [visible,setVisible]=useState(false)
    const location=useLocation();

    useEffect(()=>{
        if(location.pathname.includes('collection')){
            setVisible(true);
        }else{
            setVisible(false);
        }
    },[location])

return showSearch && visible ? (
  <div className="w-full flex justify-center py-4 bg-white shadow-sm">
    <div className="flex items-center w-3/4 sm:w-1/2 border border-gray-300 rounded-full px-4 py-2 bg-white">
      
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 outline-none text-sm"
        type="text"
        placeholder="Search products..."
      />

      <img
        className="w-4 mr-3 cursor-pointer opacity-70"
        src={assets.search_icon}
        alt=""
      />

      <img
        onClick={() => setShowSearch(false)}
        className="w-3 cursor-pointer opacity-70"
        src={assets.cross_icon}
        alt=""
      />
    </div>
  </div>
) : null;
}

export default SearchBar
