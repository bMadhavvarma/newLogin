const jwt=require('jsonwebtoken');
require('dotenv').config();
const AuthUser= ((req,res,next)=>{
    const token = req.headers['authorization'];
    try {  
        if(!token){
           return res.status(403).json({
                message:"token invalid",
                success:false
            })
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(403).json({
            message:error.message,
            success:false
        })
    }
})
module.exports={AuthUser};