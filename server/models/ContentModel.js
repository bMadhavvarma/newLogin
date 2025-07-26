const mongoose=require('mongoose');

const ContentSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }
    }, { timestamps: true });

const ContentModel=mongoose.model("content",ContentSchema);
module.exports={ContentModel};
