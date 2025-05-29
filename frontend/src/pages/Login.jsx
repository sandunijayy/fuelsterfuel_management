import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { userAuth } from '../store/userAuth';
import toast from 'react-hot-toast';


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = userAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { user, message } = await login(email, password);

      if (email == 'admin@gmail.com' && password == '1111') {
        navigate("/admindash")
      } else {

        navigate("/customer")
      }
      toast.success(message);


    } catch (error) {

      console.log(error)
    }
  }


  return (

    <div className='min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-14'>

      <h1 className='text-center font-semibold pt-18 md:text-2xl w-full max-w-xl mx-auto'>Login page</h1>

      <form action="" className='flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-8 mt-12' onSubmit={handleLogin} >

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Email</label>
          <input type="text" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={email} onChange={(e) => setEmail(e.target.value)} />

        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Password</label>
          <input type="password" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={password} onChange={(e) => setPassword(e.target.value)} />

        </div>

        {error && <p className='text-red-500'>{error}</p>}
        <button className='w-full bg-[#00BFFF] text-[#FFFCF2] py-2 font-medium rounded-lg' type='submit' disabled={isLoading} >{isLoading ? "Please wait..." : "Login"}</button>


        <p>Don't have an account ? <Link to={"/signup"} className='text-[#1E90FF]'>Sign up</Link> </p>

      </form>
    </div>

  )
}

export default Login