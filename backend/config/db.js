import mongoose from "mongoose"


export async function connectToDB(){

    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is connected ",conn.connection.host)

    } catch (error) {
        console.log("Error connect to DB",error.message);
        process.exit(1);
    }
}