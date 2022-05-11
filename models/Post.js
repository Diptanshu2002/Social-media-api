const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
      userId : {
          type : String,
          required : true
      },
      desc : {
          type : String,
          max : 500
      },
      img :{
          type : String,
          max : 500
      },
      type:{
        type : String,
      },
      likes :{
        type : Array,
        default : []
      },
      comments : {
        type : Array,
        default : {}
      }
  },  
  {
    timestamps: true,
  }
);

const PostModal = mongoose.model("Post", PostSchema);
module.exports = PostModal;
