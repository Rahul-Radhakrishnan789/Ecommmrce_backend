const express = require("express")
const app = express();
const mongoose = require("mongoose")


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1/mongoconnection', { useNewUrlParser: true, useUnifiedTopology: true });
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

 