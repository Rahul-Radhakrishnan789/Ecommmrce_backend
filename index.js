const express = require("express")
const app = express();
const mongoose = require("mongoose")
require('dotenv').config();
const cors = require('cors')

const morgan  = require('morgan')


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// mongoose.connect('mongodb://127.0.0.1/mongoconnection', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect('mongodb+srv://razzrahul789:gY0K4E5E97YzdNqg@cluster0.n1uxpxa.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


 const adminRoutes = require("./routes/adminRouter")
app.use(adminRoutes)

const userRoutes = require("./routes/userRouter")
app.use(userRoutes)

const productRoutes = require("./routes/productsRouter")
app.use(productRoutes)




app.listen(3007,() => {
    console.log("server created")
})

 