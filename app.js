const express = require("express");
const path = require("path");
const mongoose = require("mongoose")

require('dotenv').config({ path: './config/config.env' });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const formTitleRoutes = require("./routes/formTitleRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const publicRoutes = require("./routes/publicRoutes");



app.use('/api/auth',formTitleRoutes);
app.use('/api/auth', submissionRoutes);
app.use('/api/auth', publicRoutes);


const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const port = process.env.port || 3000;
connectDB()
    .then(() => {
        console.log("Database connected successfully...")
        app.listen(port,()=>{
       console.log(`server is running on the ${process.env.mode} mode on Poert ${process.env.port}`)
    })
    })
    .catch(() => {
        console.log("Data connection error!!")
    })




// app.listen(port,()=>{
//     console.log(`server is running on the ${process.env.mode} mode on Poert ${process.env.port}`)
// })

