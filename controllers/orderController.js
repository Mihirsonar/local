import Order from "../models/Order.js";
import mongoose from "mongoose";
export const createOrder = async (req,res)=>{
    const{customer,products,paymentStatus,totalAmount,paymentInfo}= req.body;

    try {
        const order = new Order({
          customer,
          products,
          paymentStatus,
          totalAmount,
          paymentInfo
        });
        await order.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    }catch(error){
        console.error("Error placing order:",error);
        res.status(500).json({ error: 'Server error. Failed to place order.' });
    }
};

export const updateOrderStatus = async (req,res)=>{

    const { id } = req.params;

    const {orderStatus}=req.query;
    console.log("Request Body:", req.body);
    console.log("Request Params:", req.params);

    if (!['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].includes(orderStatus)) {
        return res.status(400).json({ error: 'Invalid order status' });
      }

    
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid or missing order ID' });
    }

    try {
        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({ error: 'Order not found' });
        }
        order.orderStatus= orderStatus;
        await order.save();
        res.status(200).json({ message: `Order status updated to ${orderStatus}`, order });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}

export const getOrders = async (req,res)=>{
    const {status,customerId }= req.query;

    try {
        const filter ={};

        if(status){
            filter.orderStatus= status;
        }

        if(customerId){
            filter['customer._id']=customerId;
        }

        const orders = await Order.find(filter).populate('products.productId')
        res.status(200).json({ orders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }

}