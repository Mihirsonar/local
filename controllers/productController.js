import Product from "../models/Product.js";
import XLSX from "xlsx";

 const addProduct = async (req,res)=>{
    const {name,description,price,image,category,quantity}=req.body;

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            image,
            category,
            quantity,
        });
        res.status(201).json({message:"product added succesfully",product:newProduct})
    } catch (err) {
        res.status (400).json({error :err.message})
    }
} ;

 const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 const getProductById = async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product) return res.status(404).json("product not found");
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({error:err.message})

    }
}


 const updateProduct = async(req,res)=>{
    const {id} = req.params;
    const {name,description,price,image,category,quantity}=req.body;


    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {name,description,price,image,category,quantity},
            {new:true}
        );

        if(!updatedProduct) return res.status(404).json({message:"product not found!!!"});
        res.status(200).json({message:"product updated Successfully",product:updatedProduct})
    } catch (err) {
        res.status(400).json({error:err.message})

    }
};

 const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const bulkAddProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an Excel file",
      });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const products = XLSX.utils.sheet_to_json(sheet);

    const formattedProducts = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      quantity: Number(product.quantity),
    }));

    const insertedProducts = await Product.insertMany(
      formattedProducts
    );

    res.status(201).json({
      message: "Products added successfully",
      totalProducts: insertedProducts.length,
      products: insertedProducts,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export { addProduct, getProducts, getProductById, updateProduct, deleteProduct, bulkAddProducts };