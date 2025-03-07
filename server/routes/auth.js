import express from "express";
import User from "../models/user.model.js";
import validateSignupData from "../utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const app = express();
app.use(cookieParser());
app.use(express.json());

let activeUser = null;

authRouter.post("/login", async (req, res) => {
    try {


        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials!"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_PASSWORD, { expiresIn: '1h' });
            
            res.cookie("token", token);
            
            return res.json({ message: "Login successful", data: { emailId: user.emailId } });

        } else {
            return res.status(400).json({message:"Invalid Credentials!"})
        }

    } catch (err) {
        return res.status(400).json({
            message:"Server Error " + err.message
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(0),
    });
    activeUser = null;
    
    res.json({
        message: "Logged out Successfully"});
})

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_PASSWORD);
        req.userId = decoded._id;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};

const checkActiveUser = (req, res, next) => {
    if (activeUser && activeUser !== req.userId) {
        return res.status(403).json({ occupied: true, message: "Another user is already in edit mode." });
    }
    next();
};

authRouter.post("/enter-allTanks", authenticateUser, checkActiveUser, async(req, res) => {
    const { emailId } = req.body;  // Get the user who clicked the button
    if (!emailId) {
        return res.status(400).json({ message: "User email is required." });
    }
    const user = await User.findOne({ emailId }).select("emailId");

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    if (activeUser) {
        const activeUserData = await User.findById(activeUser).select("emailId");
        return res.status(403).json({
            occupied: true, message: `Another user is already in edit mode.`,
            activeUser: activeUserData.emailId
         });
    }

    activeUser = req.userId;
    return res.json({ success: true, message: "Access granted." , user: user ? user.emailId : "Unknown"});

});

authRouter.post("/exit-allTanks", authenticateUser, async (req, res) => {
    
    const user = await User.findById(req.userId).select("emailId");
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (activeUser === req.userId) {
        const user = await User.findById(req.userId).select("emailId");
        activeUser = null;
        return res.status(200).json({ success: true, message: `${user.emailId} exited successfully.`   });
    }
    return res.status(403).json({ message: `You are not the active user. Active user is ${user.emailId} `  });
});

authRouter.get("/check-allTanks", async(req, res) => {
    if (activeUser) {

        const user = await User.findById(activeUser).select("emailId");

        if (user) {
            return res.status(403).json({
                occupied: true,
                message: `Edit Mode is currently occupied by ${user.emailId}.`,
                activeUser: user.emailId
            });
        }
    }
    res.status(200).json({ occupied: false, message:"No user in Edit Mode" });
});

export default authRouter;
