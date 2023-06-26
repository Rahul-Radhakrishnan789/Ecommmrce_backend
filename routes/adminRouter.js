const express = require("express")

const tryCatch = require('../middlewares/tryCatch')



const router = express.Router()

const {loginAdmin,adminRegister} = require("../controllers/adminController")

router.post("/api/admin/register",tryCatch(adminRegister));

router.post("/api/admin/login",tryCatch(loginAdmin))


module.exports = router