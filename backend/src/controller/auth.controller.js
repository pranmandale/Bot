import User from "../models/auth.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        const accessToken = newUser.generateAuthToken();
        const refreshToken = newUser.generateRefreshToken();

        // send refreshtoken in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully",
            accessToken
        });

    } catch (error) {
        console.error("Error in Register Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // send refreshtoken in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken
        });

    } catch (error) {
        console.log("Error in Login Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const fetchProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch(error) {
        console.log("Error in Fetch Profile Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        // Verify token
        const user = await User.findByRefreshToken(token);
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Generate new access token
        const accessToken = user.generateAuthToken();
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Error in Refresh Token Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in Logout Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}