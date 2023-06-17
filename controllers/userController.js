const Products = require("../models/productsModel");
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



// register user
// app.post('/api/users/register',

 const userRegister = async (req,res) => {
    try{
      const {username,password,email} = req.body;

      const hashedPassword = await bcrypt.hash(password,10)

      const user = new User({username:username,password:hashedPassword,email:email})

      await user.save()
  
       res.json({message:"user account registered succesfully"})
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while registering the user account' });
    }
  
  }
  
  
  //user login
//   app.post('/api/users/login',
  
 const userLogin =  async (req,res) => {
    try{
      const {username,password} = req.body;
      const user = await User.findOne({username:username})
      if (!user ) {
        return res.status(401).json({ error: 'Invalid username ' });
      }
      if (!await bcrypt.compare(password, user.password)) {

        return res.status(401).json({ error: 'Invalid password' });
      }
     //generate the token

     const token = jwt.sign({username:user.username},'rahul',) //{expiresIn:500}//seconds

      res.json({ message: 'Login successful',token});
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  }
  
  //view all users


 const viewUser = async (req,res) => {
    try{
      const users = await User.find();
      res.json(users)
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the users' });
    }
  }
  
  // //get a specific user details

  
  const getUserById = async (req,res) => {
    try{
      
      const user = await User.findById(req.params.id)
      if(!user){
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
  };
  
  //add product to cart

  const addToCart  = async (req,res) => {
    try{
     const user = await User.findById(req.params.id);

     if(!user){
      return res.status(404).json({ error: 'User not found' });
     }
         
     const product = await Products.findById(req.body.productId)

     if(!product){
      return res.status(404).json({ error: 'Product not found' });
     }
     user.cart.push(product)
     await user.save()
    
     res.json({ message: 'Product added to cart successfully', user });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while adding to cart' });
    }
  }

  // show the cart

  const showCart = async (req,res) => {
   try{ 
    const user = await User.findById(req.params.id).populate('cart')
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.cart)
   }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while showing the cart' });
  }
}

  //add product to wishlist

  const addToWishlist = async (req,res) => {
     try{

      const user = await User.findById(req.params.id);

      if(!user){
        return res.status(404).json({ error: 'User not found' });
      }

      const product = await Products.findById(req.body.productId)

      if(!product){
        return res.status(404).json({ error: 'Product not found' });
       }

       user.wishlist.push(product)
      await user.save()

      res.json({ message: 'Product added to wishlist successfully', user });
     }
     catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while showing the wishlist' });
    }

  }

  //show wishlist

  const showWishlist = async (req,res) => {
    try{
    const user = await User.findById(req.params.id).populate('wishlist')

    if(!user)
    {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.wishlist)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while showing the wishlist' });

  }
}

//delete from wishlist 

const removeFromWishlist =  async (req,res) => {
  try{
     const {productid} = req.body;
       const user  = await User.findById(req.params.id)
       if(!user){
        return res.status(404).json({error:"user not found"})
       }
       const productIndex = user.wishlist.findIndex((productId) => productId.toString() === productid)

       if(productIndex === -1){
        return res.status(404).json({ error: 'Product not found in wishlist' });
       }

       user.wishlist.splice(productIndex,1)

       await user.save()

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while showing the wishlist' });

  }
}



  module.exports = {getUserById,
    viewUser,
    userLogin,
    userRegister,
    addToCart,
    showCart,
    addToWishlist,
    showWishlist,
    removeFromWishlist,
  }

  