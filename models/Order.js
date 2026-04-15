import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  user :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
  totalAmount : {type : Number, required : true},
  address : Object,
  status: {
    type : String,
    enum : ['pending', 'shipped', 'delivered'],
    default : 'delivered'
  }
},{timestamps : true});

const Order = mongoose.model('Order', orderSchema);

export default Order;