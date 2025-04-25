import express from "express"
import {addEmployee,getAllEmployees,updateEmployee,getEmployeeById,deleteEmployee} from "../controller/adminStaffController.js"

const router = express.Router();

// Route to add a new employee
router.post("/add-employee", addEmployee);
router.get("/getallemployees", getAllEmployees);
router.get("/getemployee/:id", getEmployeeById);
router.put("/updateEmployee/:id", updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);

// router.post("/login", employeeLogin);
// router.post("/logout", employeeLogout);

export default router;