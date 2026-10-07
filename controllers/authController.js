import User from "../models/User.js";

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = user.generateToken();

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please sign in with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateToken();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GOOGLE LOGIN / REGISTER
const googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google credentials" });
    }

    // Find existing user by email
    let user = await User.findOne({ email });

    if (user) {
      // If found but no googleId, link the Google account
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      }
    } else {
      // Create new user without password
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        password: null,
      });
    }

    const token = user.generateToken();

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT (client-side mainly)
const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export { register, login, logout, getCurrentUser, googleLogin };
