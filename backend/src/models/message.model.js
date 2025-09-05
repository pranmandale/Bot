import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: String,
        required: true,
        enum:["user",  "bot"]
    },
    text: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message ;
