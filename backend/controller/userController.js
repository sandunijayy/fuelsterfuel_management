import User from "../model/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        if (!username || !email || !password) {
            throw new Error("Please fill in all fields.");
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: "Email is already used." });

        const usernameExists = await User.findOne({ username });
        if (usernameExists) return res.status(400).json({ message: "Username is already used." });

        const hashedPassword = await bcryptjs.hash(password, 10);

        const userDocument = await User.create({ username, email, password: hashedPassword });

        if (userDocument) {
            const token = jwt.sign({ id: userDocument._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                user: { id: userDocument._id, username: userDocument.username, email: userDocument.email },
                message: "User created successfully."
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDocument = await User.findOne({ email });
        if (!userDocument) return res.status(400).json({ message: "Invalid credentials." });

        const isPasswordValid = await bcryptjs.compare(password, userDocument.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: userDocument._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            user: { id: userDocument._id, username: userDocument.username, email: userDocument.email },
            message: "Logged in successfully."
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchUser = async (req, res) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userDocument = await User.findById(decoded.id).select("-password");
        if (!userDocument) return res.status(400).json({ message: "User not found." });

        res.status(200).json({ user: userDocument });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
};