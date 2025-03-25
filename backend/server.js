import express from"express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import { connectToDB } from "./config/db.js";
import employeeRouter  from "./routes/adminStaffRoute.js"
import supplierRouter from "./routes/SupplierRoute.js"
import placeOrderRouter from "./router/PlaceOrderRoute.js"; 
dotenv.config()



const app=express();
const PORT=process.env.PORT || 5002;

app.use(cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use("/api",userRoute)
app.use("/api",employeeRouter)
app.use("/api",supplierRouter);
app.use("/api", placeOrderRouter); 

console.log("port is ",process.env.PORT)
app.use(express.json({limit:"20mb"}));


app.listen(PORT,async ()=>{
    await connectToDB()
    console.log("Server started at PORT: ",PORT)
 })