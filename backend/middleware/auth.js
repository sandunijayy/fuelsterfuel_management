import jwt from "jsonwebtoken"

export const authenticateUser = async (req, res, next) => {
  // Check for token in headers
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication invalid" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request object
    req.user = { userId: payload.userId, name: payload.name, role: payload.role }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Authentication invalid" })
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} is not authorized to access this route` })
    }
    next()
  }
}
