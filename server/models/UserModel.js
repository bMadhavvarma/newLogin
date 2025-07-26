const mongoose=require('mongoose');


const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    userName:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true
    }
}, { timestamps: true })
const UserModel=mongoose.model("user",userSchema);
module.exports={UserModel};
