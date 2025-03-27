import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from '../store/userAuth';
import { employeeAuth } from '../store/employeeAuth';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

function Login() {
   const [email, setEmail] = useState(""); // Ensure email is initially empty
   const [password, setPassword] = useState(""); // Ensure password is initially empty
   const { login, isLoading, error } = userAuth();
   const { employees, fetchEmployees } = employeeAuth();
   const navigate = useNavigate();

   useEffect(() => {
      fetchEmployees(); // Ensure employee data is loaded
   }, [fetchEmployees]);

   const handleLogin = async (e) => {
      e.preventDefault();

      // Admin Login Check (static)
      if (email === 'admin@gmail.com' && password === '1111') {
         toast.success("Admin login successful");
         navigate("/admindash");
         // Clear state after login
         setEmail("");
         setPassword("");
         return;
      }

      // Ensure employee data is loaded
      if (!employees || employees.length === 0) {
         toast.error("Loading employee data, please try again.");
         return;
      }

      // Staff Login Check (against employees list)
      const staffMember = employees.find(emp => emp.username === email && emp.password === password);
      if (staffMember) {
         toast.success(`Welcome, ${staffMember.fullName}!`);
         navigate("/salespage"); // Redirect to staff dashboard
         // Clear state after login
         setEmail("");
         setPassword("");
         return;
      }

      // Customer Login (via API)
      try {
         const { user, message } = await login(email, password);
         toast.success(message);
         navigate("/profile");
         // Clear state after login
         setEmail("");
         setPassword("");
      } catch (err) {
         console.error(err);
         toast.error("Login failed. Please check your credentials.");
         // Reset fields on error
         setEmail("");
         setPassword("");
      }
   }

   return (
      <>
         <Navbar />
         <div className='min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-14'>
            <h1 className='text-center font-semibold pt-18 md:text-2xl w-full max-w-xl mx-auto'>Login page</h1>

            <form className='flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-8 mt-12' onSubmit={handleLogin}>
               <div className='flex flex-col w-full'>
                  <label htmlFor="email" className='md:text-lg'>Email</label>
                  <input
                     type="email" // Use type="email" for validation
                     id="email"
                     className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Enter your email"
                     autoComplete="off" // Disable autocomplete
                     required
                  />
               </div>

               <div className='flex flex-col w-full'>
                  <label htmlFor="password" className='md:text-lg'>Password</label>
                  <input
                     type="password"
                     id="password"
                     className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter your password"
                     autoComplete="off" // Disable autocomplete
                     required
                  />
               </div>

               {error && <p className='text-red-500'>{error}</p>}
               <button
                  className='w-full bg-[#00BFFF] text-[#FFFCF2] py-2 font-medium rounded-lg'
                  type='submit'
                  disabled={isLoading}>
                  {isLoading ? "Please wait..." : "Login"}
               </button>

               <p>Don't have an account? <Link to={"/signup"} className='text-[#1E90FF]'>Sign up</Link></p>
            </form>
         </div>
      </>
   );
}

export default Login;
