import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const register = async(req,res,next)=>{
    try{
    const {name,email,password}=req.body;
    
    let user = await User.findOne({email})

    if(user)
    {
        // return res.status(401).json({
        //     success: false,
        //     message: "User Already Exist"
        // });
        return next(new ErrorHandler("USer already exist",400))
    }
    
    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({name,email,password: hashedPassword});
    
    console.log(user)

    sendCookie(user,res,"Registered Successfully",201);
}
catch(error)
{
    next(error);
}

}

export const login= async(req,res,next)=>{
    try{
    const {email,password}=req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user)
    {
        // return res.status(400).json({
        //     success: false,
        //     message: "invalid Email or Password"
        // });
        return next(new ErrorHandler("Invlaid Email or Password",400))
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch)
    {
        // return res.status(400).json({
        //     success: false,
        //     message: "invalid Email or Password"
        // });
        return next(new ErrorHandler("Inavalid Email or password",400))
    }
    console.log(user);
    sendCookie(user,res,`Welcome back ${user.name}`,200);
}catch(error){
    next(error);
}
}

export const getMyProfile = (req,res) =>{
    res.status(200).json({
        success:true,
        user:req.user,
    })
}

export const logout = (req,res)=>{
    res
       .status(200)
       .cookie("token", "" , {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Develpoment" ? false : true,
       })
       .json({
        success:true,
       })

}