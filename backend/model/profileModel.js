import mongoose from "mongoose";

// Define the Profile schema
const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    city: { type: String },
    mobile: { type: String },
    profileImage: { type: String }, // Default image URL
  },
  { timestamps: true }
);

// Create the Profile model using the schema
const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;