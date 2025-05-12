import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwtToken from "../utils/jwtToken.js"

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "email in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hash
        });

        const token = jwtToken({ id: newUser._id, role: user.role });

        res.status(201).json({
            message: "User Created successfully",
            user:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if( !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if(!user){
            res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({ message: "Invalid Password" });
        }
        const token = jwtToken({ id: user._id, role: "user" });

        res.status(200).json({
            message: "Login successfully",
            user: {
                id: user._id,
                email: user._id
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message:"Server Error",
            error: error.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message:"Server Error",
            error: error.message
        });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 