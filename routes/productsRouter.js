const express = require("express")

const adminAuth = require("../middlewares/adminAuth")

const userAuth =require("../middlewares/userAuth")

const router = express.Router()

const tryCatch = require('../middlewares/tryCatch')

const {productUpdate,productDelete,productCreate, viewProduct,productByCategory,productByCategoryForAdmin,viewProductForAdmin} = require("../controllers/productsController")

router.put('/api/admin/products/:id',adminAuth,tryCatch(productUpdate));

router.delete('/api/admin/products/:id',adminAuth,tryCatch(productDelete))

router.post('/api/admin/products',adminAuth,tryCatch(productCreate))

router.get('/api/users/products/:id',userAuth,tryCatch(viewProduct))

router.get('/api/users/products/category',userAuth,tryCatch(productByCategory))

router.get('/api/admin/products/category',adminAuth,tryCatch(productByCategoryForAdmin))

router.get('/api/admin/products/:id',adminAuth,tryCatch(viewProductForAdmin))


module.exports = router