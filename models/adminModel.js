const mongoose = require("mongoose")

 //create schema for Admin

  
 const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    username:{ 
       type: String,
    required: true,
    },
    password:{ 
      type: String,
   required: true,
   },
  });
  
  const Admin = mongoose.model('Admin', adminSchema);

  module.exports = Admin;
