import React from 'react'
import {Link} from "react-router-dom"
import { userAuth } from '../store/userAuth';
import toast from "react-hot-toast";

function CustomerNavbar() {

    const{user,logout}=userAuth();

    console.log("user : ",user)

    const handleLogout=async()=>{

      const{message}=await logout()
      toast.success(message)
    }

  return (

    <nav className="bg-[#1F134A] flex justify-between items-center text-white px-4 md:px-12 md:py-4">

    {/* Logo Section */}
    <Link to={"/"}>
      <label className="font-bold tracking-wider md:text-lg lg:text-2xl cursor-pointer text-[#87CEEB]">
        Logo Here
      </label>
    </Link>
    

    
      <div className="flex items-center space-x-5 md:text-lg cursor-pointer">

      <Link to={"/customer"}><p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Customer</p></Link>

      <Link to={"/"}><p onClick={handleLogout} className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Logout ({user.username})</p></Link>

    </div>

   
 
  </nav>
  )
}

export default CustomerNavbar
