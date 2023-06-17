const mongoose = require("mongoose")



  //create schema for product

  const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    category: String


  })
  
const Products = mongoose.model('Products' , productSchema)

module.exports = Products;