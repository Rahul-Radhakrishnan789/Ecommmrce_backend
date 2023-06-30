const Admin = require("../models/adminModel")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const validation = require('../middlewares/schemaValidation')





  //register admin

  const adminRegister = async (req,res) => {

    const {error,value} = validation.adminJoi.validate(req.body)
    if(error){
      return res.status(400).json({message:error.details[0].message});
    }
    
         const {username,password,name,email}= value;

         const hashedPassword =  await bcrypt.hash(password,10)

         const admin = new Admin({ username:username,password:hashedPassword,name:name,email:email });

         await admin.save()

         res.json({ 
                     message: 'Admin account registered successfully',
                     status:"success",
                   });
  

}

//admin login


const loginAdmin = async (req,res) => {

  
  const {error,value} = validation.adminJoi.validate(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message});
  }
  
        const {username,password} = value;
 
        const admin = await Admin.findOne({username:username})
        if (!admin ) {
          return res.status(401).json({ error: 'Invalid username ' });
        }
        if(!await bcrypt.compare(password, admin.password)) {

          return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({username:admin.username}, 'rahul',);  //{expiresIn:1000}--to set timeout

          res.json({ status:"success",
                message: 'Login successful' ,
                data:  token});
    }
   
    



module.exports = {loginAdmin,
  adminRegister}