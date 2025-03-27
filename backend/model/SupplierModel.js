import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNo: { type: Number, required: true },
  address: { type: String, required: true },
  fuelType: { type: String },

}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;