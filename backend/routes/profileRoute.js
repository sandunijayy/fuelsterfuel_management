import express from "express";
import { addProfile, getAllProfiles,  getProfileById } from "../controller/profileController.js";  

const router = express.Router();

// Route to add a new profile
router.post("/add-profile", addProfile);

// Route to fetch all profiles
router.get("/profiles", getAllProfiles);

// Route to fetch a single profile by ID
router.get("/profile/:id", getProfileById);

// // Route to update a profile
// router.put("/update-profile/:id", updateProfile);

// // Route to delete a profile
// router.delete("/delete-profile/:id", deleteProfile);

export default router;