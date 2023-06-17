const mongoose = require("mongoose")

 //create schema for Admin

  
 const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String
  });
  
  const Admin = mongoose.model('Admin', adminSchema);

  module.exports = Admin;
