const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
      members : {
          type : Array
      }
  },  
  {
    timestamps: true,
  }
);

const ConversationModal = mongoose.model("Conversation", ConversationSchema);
module.exports = ConversationModal;
