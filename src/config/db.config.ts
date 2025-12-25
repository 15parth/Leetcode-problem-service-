import mongoose from "mongoose";
import { serverConfig } from ".";
import logger from "./logger.config";

export const connectDB= async()=>{
    try {
        const DB_URL = serverConfig.DB_URL;

        await mongoose.connect(DB_URL);

        logger.info("Database connected successfully");

         mongoose.connection.on("error",(error)=>{
            logger.error("Error occured after connecting to mongoDb", error);
         });

         mongoose.connection.on("disconnected",()=>{
            logger.warn("Disconnected from database");
         });

         process.on("SIGINT",async()=>{
            await mongoose.connection.close();

            logger.info("Database disconnected ");

            process.exit(0);
         })

    } catch (error) {
        console.error('DB Connection failed');

        logger.error("DB Connection failed", error);
        
        process.exit(1);
    }
}