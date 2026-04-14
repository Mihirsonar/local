import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor", "delivery"], default: "customer" },
    AccessToken: { type: String },
    RefreshToken: { type: String },
        avatar:{
        type:{
            url : String,
           localpath : String,
        },
        default: {
            url: 'https://placehold.co/200x200',
            localpath: '',
        }
    },
    // cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
},{ timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next;
    }   
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next;
    }
    catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
 process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
}

userSchema.methods.generateRefreshToken = function() {   
    const refreshToken = jwt.sign({ id: this._id,email: this.email, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
    return refreshToken;
};
const User = mongoose.model("User", userSchema);

export default User;