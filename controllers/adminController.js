const Admin = require("../models/adminModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




  //register admin

  const adminRegister = async (req,res) => {
    try{
         const {username,password,name,email}= req.body;

         const hashedPassword =  await bcrypt.hash(password,10)

         const admin = new Admin({ username:username,password:hashedPassword,name:name,email:email });

         await admin.save()

         res.json({ message: 'Admin account registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the admin account' });
      }

}

//admin login


const loginAdmin = async (req,res) => {
    try{
        const {username,password} = req.body;

        const admin = await Admin.findOne({username:username})
        if (!admin ) {
          return res.status(401).json({ error: 'Invalid username ' });
        }
        if(!await bcrypt.compare(password, admin.password)) {

          return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({username:admin.username}, 'rahul',);  //{expiresIn:1000}--to set timeout

          res.json({ message: 'Login successful' , token});
    }
   
    catch (error) { 
      console.error(error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
}



module.exports = {loginAdmin,
  adminRegister}