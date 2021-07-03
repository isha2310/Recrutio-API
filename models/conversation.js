const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        counter: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Conversation", ConversationSchema);
