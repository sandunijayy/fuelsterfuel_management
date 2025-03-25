import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import { connectToDB } from "./config/db.js";
import employeeRouter from "./routes/adminStaffRoute.js"
import reservationRouter from "./routes/reservationRoute.js"


dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use("/api", userRoute)
app.use("/api", employeeRouter)
app.use("/api", reservationRouter);
//app.use('/api/v1/getcontact', reservationRouter);

console.log("port is ", process.env.PORT)
app.use(express.json({ limit: "20mb" }));

console.log("MONGO_URI from env:", process.env.MONGO_URI);


app.listen(PORT, async () => {
    await connectToDB()
    console.log("Server started at PORT: ", PORT)
})