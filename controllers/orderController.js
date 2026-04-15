import Order from "../models/Order.js";
import mongoose from "mongoose";
export const createOrder = async (req,res)=>{
try {
    const { Items, totalAmount, address } = req.body;

if(!Items || !totalAmount || !address){
    return res.status(400).json({ error: 'Items, totalAmount, and address are required' });
}   

    const order = new Order({
        user: req.user._id,
        Items,
        totalAmount,
        address
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
} catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
}
};

export const getMyOrders = async (req, res) => {
    try { 
       const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
       res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }

  
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};  

