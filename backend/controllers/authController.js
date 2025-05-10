import User from "../models/User.js"
import jwt from "jsonwebtoken"

// Generate JWT token
const createToken = (user) => {
  // Hardcoded expiresIn value for testing
  return jwt.sign(
    { userId: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET || "fallback_secret_key",
    { expiresIn: "30d" }, // Hardcoded to 30 days
  )
}

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if email already exists
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" })
    }

    // Create user (role defaults to 'customer')
    const user = await User.create({ name, email, password })

    // Generate token
    const token = createToken(user)

    res.status(201).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = createToken(user)

    res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: error.message })
  }
}
