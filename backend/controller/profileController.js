import Profile from "../model/profileModel.js"
import cloudinary from "cloudinary"

export const addProfile = async (req, res) => {
    const { fullName, email, city, mobile, profileImage } = req.body;
  
    try {
      if (!fullName || !email || !city || !mobile) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }
  
      // Handle image upload if profileImage is provided
      let uploadedImage = ""
      if (profileImage) {
        const imageResponse = await cloudinary.uploader.upload(profileImage, {
          folder: 'fuel', // You can specify a folder name
        });
        uploadedImage = imageResponse.secure_url; // Get the secure URL of the uploaded image
      }
  
      // Create the profile document
      const profileDocument = await Profile.create({
        fullName,
        email,
        city,
        mobile,
        profileImage: uploadedImage,
      });
  
      return res.status(201).json({
        profile: profileDocument,
        message: "Profile added successfully.",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Fetch all profiles
  export const getAllProfiles = async (req, res) => {
    try {
      const profiles = await Profile.find().sort({ createdAt: -1 });
      if (!profiles || profiles.length === 0) {
        return res.status(404).json({ message: "No profiles found." });
      }
      res.status(200).json({ profiles });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Fetch a profile by ID
  export const getProfileById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found." });
      }
  
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  