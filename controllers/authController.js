import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = async (user) => {
  try {
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.AccessToken = accessToken;
    user.RefreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };

  } catch (error) {
    throw new Error("Token generation failed: " + error.message);
  }
};


 const register = async (req, res) => {

  try {
    const { name, email, password } = req.body;

 if(!name || !email || !password){
    return res.status(400).json({ message: "All fields are required!" });
 }

 const existingUser = await User.findOne({ email });
 if (existingUser) {
   return res.status(400).json({ message: "Email already in use!" });
 }

 const user = await User.create({
   name,
   email,
   password: await bcrypt.hash(password, 10),
 });

 res.status(201).json({
   message: "User registered successfully!",
   user: {
     id: user._id,
     name: user.name,
     email: user.email,
   },
 });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {

const { email, password } = req.body;

if(!email || !password){
    return res.status(400).json({ message: "Email and password are required!" }); 
};

const user = await User.findOne({ email });
if (!user) {
  return res.status(404).json({ message: "User not found!" });
}

 const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

const { accessToken, refreshToken } = await generateToken(user);

res.status(200).json({
  message: "Login successful!",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  accessToken,
  refreshToken,
});
}

const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:""
      }
    },{
      new: true,
    }
  );
  return res
  .status(200)
  .json({ message: "Logout successful!" });
}

const getCurrentUser = async(req,res)=>{
  return res.status(200).json(
    new ApiResponse(200,req.user,"Current User")
  )
};

export { register, login, logout, getCurrentUser };