import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: null },

    googleId: { type: String, default: null },
    picture: { type: String, default: null },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    addresses: { type: [addressSchema], default: [] },
    pushSubscriptions: [{
      endpoint: { type: String, required: true },
      expirationTime: { type: Number, default: null },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
      createdAt: { type: Date, default: Date.now },
    }],
    defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: "User.addresses", default: null },
  },
  { timestamps: true }
);

// Only hash password if it exists and was modified
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default mongoose.model("User", userSchema);
