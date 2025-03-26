import express from"express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import { connectToDB } from "./config/db.js";
import employeeRouter  from "./routes/adminStaffRoute.js"
import salesRouter from "./routes/salesRoute.js"
import profileRoute from "./routes/profileRoute.js"
import cloudinary from 'cloudinary';

dotenv.config()


const app=express();
const PORT=process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use("/api",userRoute)
app.use("/api",employeeRouter)
app.use("/api",salesRouter)
app.use("/api",profileRoute)

console.log("port is ",process.env.PORT)
app.use(express.json({limit:"20mb"}));


app.listen(PORT,async ()=>{
    await connectToDB()
    console.log("Server started at PORT: ",PORT)
 })