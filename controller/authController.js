import User from "../model/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// generate token
const generateToken = user => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15d" }
    );
};


export const registerUser = async (req, res) => {
    const { username, email, password ,dob} = req.body;
    console.log(username, email,password,dob)
    try {        
        let user = await User.findOne({ email });
    
        if(user){
            return res.status(400).json({success: false,  message: "User with this email already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const formattedDob = new Date(dob).toISOString().split('T')[0];
        user = new User({
            username,
            email,
            dob: formattedDob,
            password : hashedPassword
        })
            
        await user.save();
        const token = generateToken(user);
        res
            .status(200)
            .json({ 
                success: true, 
                token,
                message: "user successfully created" 
            });
    } catch (err) {
        console.log(err)
        res
        .status(500)
        .json({ success: false, message: "Internal server error! Try again later" });
    }
};


export const login = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res
            .status(400)
            .json({ success: false, message: "User does not exist !" });
        }
    
        const isPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordMatch) {
            return res
            .status(400)
            .json({ success: false, message: "Invalid Password" });
        }
    
        const { password, role, appointments, ...rest } = user._doc;

        const token = generateToken(user);
    
        res.status(200).json({
            success: true,
            message: "Successfully login",
            token,
            data: { ...rest },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to login" });
    }

};