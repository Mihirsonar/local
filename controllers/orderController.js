import Order from "../models/Order.js";
import mongoose from "mongoose";
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    console.log("REQ BODY:", req.body);

    const mappedProducts = items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    console.log("MAPPED PRODUCTS:", mappedProducts);

    const order = new Order({
      user: req.user._id,
      products: mappedProducts,
      totalAmount,
      address,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product", "name image price");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

  


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
       .populate("user", "name")
      .populate("products.product", "name");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};


