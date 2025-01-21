import Product from "../models/Product.js";

export const addProduct = async (req,res)=>{
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

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductById = async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product) return res.status(404).json("product not found");
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({error:err.message})

    }
}


export const updateProduct = async(req,res)=>{
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

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};