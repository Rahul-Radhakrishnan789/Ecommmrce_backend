const Products  = require("../models/productsModel")


 //update a product


  const productUpdate = async (req, res) => {
    try {
      const product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the product' });
    }
  };
  
  //delete a product

 const productDelete = async (req, res) => {
    try {
      const productId = req.params.id.trim()
      const deletedProduct = await Products.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
  };

    
//create a product


const productCreate =  async (req,res) =>{
    try{
    const {title,description,price,image,category} = req.body;
    
    const product = new Products({title,description,price,image,category})
    await product.save()
    res.json("product added succesfully")
    
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while adding the product' });
    }
    }

    //view a specific product for user

    const viewProduct = async (req,res) => {
        try{
            const specificProduct = await Products.findById(req.params.id)
            if(!specificProduct){
                return res.status(404).json({ error: 'product not found' });
              }
              res.json(specificProduct)
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Couldnt find the product' });
          }
    }

    //view product by category for user

    const productByCategory = async (req,res) => {
        try{
              const {category} = req.body;
              const categoryProducts = await Products.find({category:category})
              if(!categoryProducts){
                return res.status(404).json({ error: 'category not found' });
              }
              res.json(categoryProducts)

        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: ' internal server error' });
          }
    }

    //view product by category for admin

    const productByCategoryForAdmin = async (req,res) => {
        try{
              const {category} = req.body;
              const categoryProducts1 = await Products.find({category:category})
              if(!categoryProducts1){
                return res.status(404).json({ error: 'category not found' });
              }
              res.json(categoryProducts1)

        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: ' internal server error' });
          }
    }

       //view a specific product for admin

       
    const viewProductForAdmin = async (req,res) => {
        try{
            const specificProduct = await Products.findById(req.params.id)
            if(!specificProduct){
                return res.status(404).json({ error: 'product not found' });
              }
              res.json(specificProduct)
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Couldnt find the product' });
          }
    }

    



  module.exports = {productUpdate,
    productDelete,
    productCreate,
    viewProduct,
    productByCategory,
    productByCategoryForAdmin,
    viewProductForAdmin,
  }

