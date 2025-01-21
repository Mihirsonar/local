import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    customer:{
        name:   {type:String,required:true}, 
        email:  {type:String,required:true},  
        phone:  {type:String},
        address:{type:String,required:true},  
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
        },
        quantity:{type:Number,required:true},
        price:{type:Number,required:true}
    }],
    orderStatus:{
        type:String,
        enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
        default:'Pending'
    },
    paymentStatus:{
        type:String,
        enum:['Paid','Pending'],
        default:'Pending'
    },
    totalAmount:{type:Number,required:true},
    paymentInfo:{type:Object},
    createdAt: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', orderSchema);

export default Order;