const express = require("express")

const router = express.Router()

const userAuth = require('../middlewares/userAuth')

const adminAuth = require('../middlewares/adminAuth')

const {userRegister,
    userLogin,
    viewUser,
    getUserById,
    addToCart,
    showCart,
    addToWishlist,
    showWishlist,
    removeFromWishlist,
    payment,
    paymentByPaypal} = require("../controllers/userController")


router.post('/api/users/register',userRegister);

router.post('/api/users/login',userLogin);




router.get('/api/admin/users',adminAuth,viewUser);

router.get('/api/admin/users/:id',adminAuth,getUserById)

router.post('/api/users/:id/cart',userAuth,addToCart)

router.get('/api/users/:id/showcart',userAuth,showCart)

router.post('/api/users/:id/wishlist',userAuth,addToWishlist)

router.get('/api/users/:id/wishlist',userAuth,showWishlist)

router.delete('/api/users/:id/wishlist',userAuth,removeFromWishlist)

router.post('/api/users/payment/:id',userAuth,payment)

router.get("/api/users/payment/paypal/:id",paymentByPaypal)


module.exports = router