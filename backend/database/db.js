import mongoose from "mongoose";

const connectDB = async (req, res) => {
    try {
        const connect = await mongoose.connect(`${process.env.DATABASE}`)
        console.log(`Database is connected`);
    } catch (error) {
        console.log(`Mongodb connection error`, error);
        process.exit(1);
    }
}

export default connectDB;