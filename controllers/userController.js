const Products = require("../models/productsModel");

const User = require("../models/userModel")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const paypal = require("paypal-rest-sdk")

const stripe = require('stripe')(process.env.SECRET_KEY)

const validation = require('../middlewares/schemaValidation')

paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': process.env.client_id, 
  'client_secret':process.env.client_secret_key
});



// register user


 const userRegister = async (req,res) => {


     const {value,error} = validation.userjoi.validate(req.body)
     if(error){
      return res.status(400).json({message:error.details[0].message});
     }

      const {username,password,email} = value;

      const hashedPassword = await bcrypt.hash(password,10)

      const user = new User({username:username,password:hashedPassword,email:email})

      await user.save()
  
       res.status(200).json({
        status:"success",
        message:"user account registered succesfully"})
    }
    
  
  //user login

  
 const userLogin =  async (req,res) => {

  const { error, value } = validateSchema.adschema.validate(req.body);
  if (error) {
    return res.status(400).json({message:error.details[0].message});
  }

  
      const {username,password} = value;
      const user = await User.findOne({username:username})
      if (!user ) {
        return res.status(401).json({ error: 'Invalid username ' });
      }
      if (!await bcrypt.compare(password, user.password)) {

        return res.status(401).json({ error: 'Invalid password' });
      }

     //generate the token

     const token = jwt.sign({username:user.username},'rahul',) //{expiresIn:500}//seconds

      res.json({ 
        status:"success",
        message: 'Login successful',
        data:token
      });
    }
   
  
  //view all users


 const viewUser = async (req,res) => {
  
      const users = await User.find();
      res.json({
        status:"success",
        data:users
      })
    
  }
  
  // //get a specific user details

  
  const getUserById = async (req,res) => {
 
      
      const user = await User.findById(req.params.id)
      if(!user){
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        status:"success",
        data:user,
      })
    } 
  
  //add product to cart

  const addToCart  = async (req,res) => {
    
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
    
     res.json({
                 status:"success",
                 message: 'Product added to cart successfully',
                 data: user
                 });
    }
   
  // show the cart

  const showCart = async (req,res) => {
 
    const user = await User.findById(req.params.id).populate('cart')
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
              status:"success",
              data:user.cart
            })
   }
   

  //add product to wishlist

  const addToWishlist = async (req,res) => {
     

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

      res.json({
                status:"success",
                 message: 'Product added to wishlist successfully',
                 data: user 
                });
     }
    
  //show wishlist

  const showWishlist = async (req,res) => {

    const user = await User.findById(req.params.id).populate('wishlist')

    if(!user)
    {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
         
         status:"success",
         data:user.wishlist
        })
  }


//delete from wishlist 

const removeFromWishlist =  async (req,res) => {

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

       res.status(200).json({
        status:"success",
        message:"product Removed From Wishlist"
       })

  }
 


// proceed to payment using stripe

const payment = async (req,res) => {
 
       const userId = req.params.id

       const user = await User.findById(userId).populate('cart')



       if(!user){
        return res.status(401).json({ error: 'Invalid user' });
       }

       if(user.cart.length === 0){
        return res.status(404).json({error:'your cart is empty'})
       }

     const totalSum = user.cart.reduce((sum,item) => {
      return sum + item.price
     },0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'INR',
            product_data: {
              name: 'Sample Product',
              description: 'This is a sample product',
            
            },
            unit_amount:totalSum * 100, // amount in rupees
          },
          quantity:1,
        },
      ],
      mode: 'payment',
      success_url: 'https://ruperhat.com/wp-content/uploads/2020/06/Paymentsuccessful21.png',
      cancel_url: 'https://media.licdn.com/dms/image/C5112AQGiR7AdalYNjg/article-cover_image-shrink_600_2000/0/1582176281444?e=2147483647&v=beta&t=QVzBFLJpbDlQMX_H5iKXr7Jr1w6Pm60tOJb47rjpX6Q',
      
    })
       
     user.orders.push({
      products:user.cart.length,
      orderId:session.id,
      totalAmount:totalSum
     })

     user.cart = [];

     await user.save()
  
    res.status(200).json({
      
       status:"success",
       message:"payment succesful",
       url: session.url,
       orderId: session.id,
       data: user
       });


     



  }
  

//proceed payment using paypal

const paymentByPaypal = async (req,res) => {
 

    const userId = req.params.id

    const user = await User.findById(userId).populate('cart')



    if(!user){
     return res.status(401).json({ error: 'Invalid user' });
    }

    if(user.cart.length === 0){
     return res.status(404).json({error:'your cart is empty'})
    }

  const totalSum = user.cart.reduce((sum,item) => {
   return sum + item.price
  },0);

    const createPayment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'https://ruperhat.com/wp-content/uploads/2020/06/Paymentsuccessful21.png', 
        cancel_url: 'https://media.licdn.com/dms/image/C5112AQGiR7AdalYNjg/article-cover_image-shrink_600_2000/0/1582176281444?e=2147483647&v=beta&t=QVzBFLJpbDlQMX_H5iKXr7Jr1w6Pm60tOJb47rjpX6Q' 
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: totalSum  
        },
       
      }]
    };

    paypal.payment.create(createPayment, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the PayPal checkout session' });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
        res.json({
          status:"success",
          message:"payment successful",
          url: approvalUrl,
          data:user 
        });

      }
    });

    user.orders.push({
      products:user.cart.length,
      orderId:paypal.id,
      totalAmount:totalSum
     })

     user.cart = [];

     await user.save()


 
  
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
    payment,
    paymentByPaypal,
  }

  