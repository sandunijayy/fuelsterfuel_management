import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  joinDate: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //imageUrl: { type: String }, // This will store the image URL uploaded by the staff member
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;