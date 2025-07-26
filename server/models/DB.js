const mongoose=require('mongoose');
require('dotenv').config();

const mongoDb=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("connected Db")
    }
    catch(err){
        console.log("not connected due to ",err);
    }
}
module.exports={mongoDb};