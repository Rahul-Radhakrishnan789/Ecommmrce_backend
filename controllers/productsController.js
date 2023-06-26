const Products  = require("../models/productsModel")


 //update a product


  const productUpdate = async (req, res) => {
   
      const product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ status:"success",
                 message: 'Product updated successfully',
                 data: product });
   
  };
  
  //delete a product

 const productDelete = async (req, res) => {

      const productId = req.params.id.trim()
      const deletedProduct = await Products.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      else{
        return res.json({
          status: "success",
          message:"product deleted"
        })
      }
 
  };

    
//create a product


const productCreate =  async (req,res) =>{
   
    const {title,description,price,image,category} = req.body;
    
    const product = new Products({title,description,price,image,category})
    await product.save()

    res.json({
      status:"success",
      message:"product created succesfully",
      data: product,
    })
    
   
    }

    //view a specific product for user

    const viewProduct = async (req,res) => {
       
            const specificProduct = await Products.findById(req.params.id)
            if(!specificProduct){
                return res.status(404).json({ error: 'product not found' });
              }

              res.json({
                status:"success",
                data:specificProduct
              })
       
    }

    //view product by category for user

    const productByCategory = async (req,res) => {
       
              const {category} = req.body;
              const categoryProducts = await Products.find({category:category})
              if(!categoryProducts){
                return res.status(404).json({ error: 'category not found' });
              }
              res.json({
                status:"success",
                data:categoryProducts
              })

       
    }

    //view product by category for admin

    const productByCategoryForAdmin = async (req,res) => {
    
              const {category} = req.body;
              const categoryProducts1 = await Products.find({category:category})

              if(!categoryProducts1){
                return res.status(404).json({ error: 'category not found' });
              }
              res.json({
                status:"success",
                data:categoryProducts1
              })

        }
      

       //view a specific product for admin

       
    const viewProductForAdmin = async (req,res) => {
        
            const specificProduct = await Products.findById(req.params.id)
            if(!specificProduct){
                return res.status(404).json({ error: 'product not found' });
              }
              res.json({
                        status:"success",
                         data:specificProduct
                        })
        }
      

    



  module.exports = {productUpdate,
    productDelete,
    productCreate,
    viewProduct,
    productByCategory,
    productByCategoryForAdmin,
    viewProductForAdmin,
  }

