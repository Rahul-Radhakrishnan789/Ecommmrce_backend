const jwt = require("jsonwebtoken")

const adminAuth = (req,res,next) => {
    let authHeader = req.headers.authorization;
   if(authHeader===undefined){
      res.status(401).json({error:"token is not provided for admin"})
   }
   let token = authHeader.split(" ").pop()

   jwt.verify(token,'rahul' , (err,decoded) => {
    if(err){
        res.status(500).json({error:"authentication failed"})
    }
    else{
          next()
    }
   })

}

module.exports = adminAuth;