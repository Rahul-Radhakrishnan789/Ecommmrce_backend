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
    removeFromWishlist} = require("../controllers/userController")


router.post('/api/users/register',userRegister);

router.post('/api/users/login',userLogin);




router.get('/api/admin/users',adminAuth,viewUser);

router.get('/api/admin/users/:id',adminAuth,getUserById)

router.post('/api/users/:id/cart',addToCart)

router.get('/api/users/:id/cart',showCart)

router.post('/api/users/:id/wishlist',addToWishlist)

router.get('/api/users/:id/wishlist',showWishlist)

router.delete('/api/users/:id/wishlist',removeFromWishlist)


module.exports = router