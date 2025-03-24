import express from"express"
import dotenv from "dotenv"
import { connectToDB } from "./config/db.js";
import cors from "cors"
import InventoryRoute from "./router/InventoryRoute.js"


dotenv.config()

const app = express()
//app.use(cors())
//app.use(express.json())

const PORT=process.env.PORT || 5000;

// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));

app.use(
    cors({
        origin: "http://localhost:5173", // Allow only frontend
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow cookies, authentication headers
    })
);

console.log("port is ",process.env.PORT)
app.use(express.json({limit:"20mb"}));

app.use("/api",InventoryRoute);

app.listen(PORT,async ()=>{
    await connectToDB()
    console.log("Server started at PORT: ",PORT)
 })