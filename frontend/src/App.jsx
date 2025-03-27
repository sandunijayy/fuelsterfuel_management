import React, { useEffect } from 'react'
import { Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import Features from './pages/Features'
import Services from './pages/Services'
import Aboutus from './pages/Aboutus'
import { Toaster } from "react-hot-toast"
import Customer from './pages/Customer'
import AdminDashboard from './admin/AdminDashboard'
import { userAuth } from './store/userAuth'
import AdminNavbar from './components/AdminNavbar'
import AdminStaff from './admin/AdminStaff'
import FuelReservationForm from "./components/FuelReservationForm"
import Supplier from './admin/Supplier';
import InventoryPage from './admin/Inventorypage';
import PlaceOrder from './pages/PlaceOrder'
import AdminReservation from "./admin/AdminReservation";
import Profile from "./pages/Profile"
import CustomerDetails from './admin/CustomerDetails'
import Sales from './staff/Sales'
import StaffProfile from './staff/StaffProfile'


function App() {

  const { fetchUser, fetchingUser, user } = userAuth();

  useEffect(() => {
    fetchUser(); // Fetch user data when app loads
  }, []);

  // If the user data is still being fetched, show loading state
  if (fetchingUser) {
    return <p>Loading...</p>;
  }


  return (
    <>
      <Toaster />

      {/* {user && user.email === "admin@gmail.com" ? <AdminNavbar /> : <Navbar />} */}

      {/* <Navbar/> */}


      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<SignIn />} />
        <Route path={"/"} element={<Home />} />
        <Route path={"/features"} element={<Features />} />
        <Route path={"/services"} element={<Services />} />
        <Route path={"/about"} element={<Aboutus />} />
        <Route path={"/customer"} element={<Customer />} />
        <Route path={"/admindash"} element={<AdminDashboard />} />
        <Route path={"/staff"} element={<AdminStaff />} />
        <Route path={"/resevation"} element={<FuelReservationForm />} />
        <Route path={"/inventory"} element={<InventoryPage />} />
        <Route path={"/suppliers"} element={<Supplier />} />
        <Route path={"/place-order/:supplierId"} element={<PlaceOrder />} />
        <Route path={"/AdminReservation"} element={<AdminReservation />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/customerdetails"} element={<CustomerDetails />} />
        <Route path={"/salespage"} element={<Sales />} />
        <Route path={"/staffprofile"} element={<StaffProfile />} />


      </Routes>

    </>
  )
}

export default App
