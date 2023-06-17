const express = require("express")



const router = express.Router()

const {loginAdmin,adminRegister} = require("../controllers/adminController")

router.post("/api/admin/register",adminRegister);

router.post("/api/admin/login",loginAdmin)


module.exports = router