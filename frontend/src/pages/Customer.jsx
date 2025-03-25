import React from 'react'
import FuelReservationForm from '../components/FuelReservationForm';
import Viewreservation from './viewReservation';
import InventoryPage from './Inventorypage';
import CustomerNavbar from '../components/customerNavbar';
//import CustomerNavbar from '../components/customerNavbar';
// Import your existing form component


function Customer() {




    return (
        <div>
            <CustomerNavbar/>
            <h1> this is customer page</h1>
            <FuelReservationForm />
            <Viewreservation />
            <InventoryPage />


            {/* <button
            >
                Reservstion
            </button> */}




        </div>
    )
}



export default Customer