const express=require('express');
const app=express();
const cors=require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mongoDb } = require('./models/DB');
const { UserModel } = require('./models/UserModel');
const { AuthUser } = require('./middleWares/AuthUser');
const { ContentModel } = require('./models/ContentModel');
require('dotenv').config();
app.use(express.json());
app.use(cors());

app.get("/home",(req,res)=>{
    res.json("home page loaded ");
})
mongoDb();
app.post("/api/v1/signup",async(req,res)=>{
    const {email,userName,password}=req.body;
    if(!email || !userName || !password){
      return  res.status(403).json({
        success:false,
            message:"email,username,pasword required"
        });   
    }
  
    const user=await UserModel.findOne({email});
    if(user){
       return res.status(403).json({
        success:false,
            message:"user already exist"
        });  
    }
    try {
        const hashPassword=await bcrypt.hash(password,10);
        const userDetails=await UserModel.create({
            email,
            userName,
            password:hashPassword
        });
        return res.status(200).json({
            success:true,
            message:"user created sucessfully",
            userDetails
        })
        
    } catch (error) {
        return res.status(403).json({
            success:false,
            message:error.message
        });  
    }
})
app.post("/api/v1/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
      return  res.status(403).json({
        success:false,
            message:"email,username,pasword required"
        });   
    }
  
    const user=await UserModel.findOne({email});
    if(!user){
       return res.status(403).json({
        success:false,
            message:"user don't already exist"
        });  
    }
    try {
        const verifyPassword=await bcrypt.compare(password,user.password);
        if(!verifyPassword){
            return res.status(403).json({
                success:false,
                    message:"Invalid Pasword"
                }); 
        }
        const token = jwt.sign(
            {
              id: user._id,
              email: user.email
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '7h'
            }
          );
          
        return res.status(200).json({
            success:true,
            message:"user signin sucessfully",
            token
        })
        
    } catch (error) {
        return res.status(403).json({
            success:false,
            message:error.message
        });  
    }
})



const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})