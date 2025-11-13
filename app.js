const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const cors = require("cors");

require('dotenv').config({ path: './config.env' });
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'], // Common React/Vite ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

const port = process.env.PORT || 3000;
connectDB()
    .then(() => {
        console.log("Database connected successfully...")
        app.listen(port,()=>{
       console.log(`server is running on the ${process.env.MODE} mode on Port ${process.env.PORT}`)
    })
    })
    .catch((error) => {
        console.log("Data connection error!!", error.message)
    })




// app.listen(port,()=>{
//     console.log(`server is running on the ${process.env.mode} mode on Poert ${process.env.port}`)
// })

