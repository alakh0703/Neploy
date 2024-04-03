import { MongooseError } from "mongoose";

let mongoose = require("mongoose");

exports.connect = async (mongo_url:string) => {

    await mongoose
        .connect(mongo_url)
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error: MongooseError) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};