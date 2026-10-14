import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

let storeSettings = {
  storeName: "Kirana+",
  storeSubtitle: "All grocereis and daily needs at your doorstep!",
  phone: "+919876543210",
  address: "Near Tilak Global School, Navi Mumbai, Maharashtra",
  deliveryFee: 20,
  freeDeliveryThreshold: 500,
  minOrderValue: 99,
  isOpen: true,
};

export const getDashboardStats = async (req, res) => {
  try {
    const { date } = req.query;
    const allOrders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image");

    let filteredOrders = allOrders;
    if (date) {
      filteredOrders = allOrders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        return orderDate === date;
      });
    }

    const totalOrders = filteredOrders.length;
    const completedOrdersList = filteredOrders.filter(
      (o) => (o.status || "").toLowerCase() === "delivered"
    );
    const completedOrders = completedOrdersList.length;

    const netSales = completedOrdersList.reduce(
      (sum, o) => sum + (Number(o.totalAmount) || 0),
      0
    );

    const aov = completedOrders > 0 ? Math.round(netSales / completedOrders) : 0;

    const statusCounts = {
      Placed: 0,
      Confirmed: 0,
      Packing: 0,
      "Out for delivery": 0,
      "Ready for pickup": 0,
      Delivered: 0,
    };

    filteredOrders.forEach((o) => {
      const s = o.status || "Placed";
      if (s.toLowerCase() === "pending" || s.toLowerCase() === "placed") {
        statusCounts.Placed++;
      } else if (s.toLowerCase() === "confirmed") {
        statusCounts.Confirmed++;
      } else if (s.toLowerCase() === "packing" || s.toLowerCase() === "processing") {
        statusCounts.Packing++;
      } else if (s.toLowerCase().includes("out")) {
        statusCounts["Out for delivery"]++;
      } else if (s.toLowerCase().includes("pickup")) {
        statusCounts["Ready for pickup"]++;
      } else if (s.toLowerCase() === "delivered") {
        statusCounts.Delivered++;
      } else {
        statusCounts.Placed++;
      }
    });

    const ordersByStatus = Object.keys(statusCounts).map((key) => {
      const count = statusCounts[key];
      const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
      return { status: key, count, percentage };
    });

    let homeDelivery = 0;
    let storePickup = 0;
    filteredOrders.forEach((o) => {
      if ((o.address?.label || "").toLowerCase().includes("pickup")) {
        storePickup++;
      } else {
        homeDelivery++;
      }
    });

    let codTotal = 0;
    let onlineTotal = 0;
    filteredOrders.forEach((o) => {
      const amt = Number(o.totalAmount) || 0;
      if (o.razorpayOrderId || o.razorpayPaymentId) {
        onlineTotal += amt;
      } else {
        codTotal += amt;
      }
    });
    const totalRevenue = codTotal + onlineTotal;

    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });

    return res.status(200).json({
      success: true,
      storeSettings,
      date: date || new Date().toISOString().split("T")[0],
      totalOrders,
      completedOrders,
      netSales,
      aov,
      ordersByStatus,
      fulfilment: { homeDelivery, storePickup },
      paymentSplit: {
        total: totalRevenue,
        cod: codTotal,
        online: onlineTotal,
        codPercentage: totalRevenue > 0 ? Math.round((codTotal / totalRevenue) * 100) : 50,
        onlinePercentage: totalRevenue > 0 ? Math.round((onlineTotal / totalRevenue) * 100) : 50,
      },
      totalProducts,
      totalCustomers,
      recentOrders: allOrders.slice(0, 10),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ message: "Failed to generate dashboard statistics" });
  }
};

export const getAdminCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    const customerList = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ user: c._id });
        const orders = await Order.find({ user: c._id }).select("totalAmount createdAt");
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return {
          ...c.toObject(),
          orderCount,
          totalSpent,
        };
      })
    );
    return res.status(200).json({ success: true, customers: customerList });
  } catch (error) {
    console.error("Get customers error:", error);
    return res.status(500).json({ message: "Failed to fetch customers" });
  }
};

export const updateStockAndPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, quantity, category, name } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = String(quantity);
    if (category !== undefined) product.category = category;
    if (name !== undefined) product.name = name;

    await product.save();
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Update stock/price error:", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const categoriesWithCount = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      categories: categoriesWithCount.map((c) => ({
        name: c._id || "General",
        productCount: c.count,
        avgPrice: Math.round(c.avgPrice || 0),
      })),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getStoreSettings = (req, res) => {
  return res.status(200).json({ success: true, settings: storeSettings });
};

export const updateStoreSettings = (req, res) => {
  storeSettings = { ...storeSettings, ...req.body };
  return res.status(200).json({ success: true, settings: storeSettings });
};
