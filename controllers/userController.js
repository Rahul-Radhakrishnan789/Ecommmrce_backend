const Products = require("../models/productsModel");
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const paypal = require("paypal-rest-sdk")

const stripe = require('stripe')(process.env.SECRET_KEY)


paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': "AXBT51O6K6MpWQbv2zC30pxKyzPIUFBAp7wCP7amXWbdi_Vq7lscj5UbnpZkyHu2MrEYH0USz-WMhiQ0", 
  'client_secret':'EFqw5vL3UEnOYQnXHkRgw3SvbODdBb0tKj2BwLa6OP8bJ-wZZDkrUtIIBiQIt3JbtBHEfXa8C1mu-aGn' 
});



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


// proceed to payment using stripe

const payment = async (req,res) => {
  try{
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

     await user.save()
  
    res.json({ url: session.url, orderId: session.id, user });


     



  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred ' });

  }
}


const paymentByPaypal = async (req,res) => {
  try{

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
        return_url: 'https://ruperhat.com/wp-content/uploads/2020/06/Paymentsuccessful21.png', // Replace with your success URL
        cancel_url: 'https://media.licdn.com/dms/image/C5112AQGiR7AdalYNjg/article-cover_image-shrink_600_2000/0/1582176281444?e=2147483647&v=beta&t=QVzBFLJpbDlQMX_H5iKXr7Jr1w6Pm60tOJb47rjpX6Q' // Replace with your cancel URL
      },
      transactions: [{
        // item_list: {
        //   items: [{
        //     name: 'Product Name', // Replace with your product name
        //     sku: 'PRODUCT_SKU', // Replace with your product SKU
        //     price: '100.00', // Replace with your product price
        //     currency: 'USD',
        //     quantity: 1
        //   }]
        // },
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
        res.json({url: approvalUrl,user });

      }
    });

    user.orders.push({
      products:user.cart.length,
      orderId:paypal.id,
      totalAmount:totalSum
     })

     await user.save()


  
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while payment process' });
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
    payment,
    paymentByPaypal,
  }

  