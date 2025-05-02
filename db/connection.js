// /db/connection.js

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log("Error connecting to DB", err);
})