const mongoose = require("mongoose");

exports.connect = async (url) => {

    await mongoose
        .connect(url)
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};