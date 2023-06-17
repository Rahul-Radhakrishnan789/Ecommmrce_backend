const express = require("express")

const adminAuth = require("../middlewares/adminAuth")

const userAuth =require("../middlewares/userAuth")

const router = express.Router()

const {productUpdate,productDelete,productCreate, viewProduct,productByCategory,productByCategoryForAdmin,viewProductForAdmin} = require("../controllers/productsController")

router.put('/api/admin/products/:id',adminAuth,productUpdate);

router.delete('/api/admin/products/:id',adminAuth,productDelete)

router.post('/api/admin/products',adminAuth,productCreate)

router.get('/api/users/products/:id',userAuth,viewProduct)

router.get('/api/users/products/category',userAuth,productByCategory)

router.get('/api/admin/products/category',adminAuth,productByCategoryForAdmin)

router.get('/api/admin/products/:id',adminAuth,viewProductForAdmin)


module.exports = router