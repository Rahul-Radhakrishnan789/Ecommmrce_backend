const mongoose = require("mongoose")



//create schema for user
 
const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
   
  cart:  [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  orders: [
    {
      products: [
        {
          type: Number,
          default: 0,
        },
      ],
      orderId: {
        type: String,
        default: "",
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
      
    },
  ],
});

 
  
  const User = mongoose.model('User', userSchema);

  module.exports = User;