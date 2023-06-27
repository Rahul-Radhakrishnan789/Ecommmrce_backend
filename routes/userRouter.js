const express = require("express")

const router = express.Router()

const userAuth = require('../middlewares/userAuth')

const adminAuth = require('../middlewares/adminAuth')

const tryCatch = require("../middlewares/tryCatch")

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
    paymentByPaypal,
    findOrderDetails,
     totalRevenue} = require("../controllers/userController")


router.post('/api/users/register',tryCatch(userRegister));

router.post('/api/users/login',tryCatch(userLogin));



router.get('/api/admin/users',adminAuth,tryCatch(viewUser));

router.get('/api/admin/users/:id',adminAuth,tryCatch(getUserById))

router.post('/api/users/:id/cart',userAuth,tryCatch(addToCart))

router.get('/api/users/:id/showcart',userAuth,tryCatch(showCart))

router.post('/api/users/:id/wishlist',userAuth,tryCatch(addToWishlist))

router.get('/api/users/:id/wishlist',userAuth,tryCatch(showWishlist))

router.delete('/api/users/:id/wishlist',userAuth,tryCatch(removeFromWishlist))

router.post('/api/users/payment/:id',userAuth,tryCatch(payment))

router.post("/api/users/payment/paypal/:id",userAuth,tryCatch(paymentByPaypal))

router.get('/api/admin/vieworder/:id',adminAuth,tryCatch(findOrderDetails))

router.get('/api/admin/totalrevenue',tryCatch(totalRevenue))


module.exports = router