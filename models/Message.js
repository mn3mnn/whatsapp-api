const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const message_Mongoose = new Schema({
    "content": String,
    "to": String,
    "status": String,
    "addedAt": Date,
    "pendingAt": Date,
    "sentAt": Date,
    "sentFrom": String,
}, { collection: "messages" })

const Message = model("message_Mongoose", message_Mongoose);

module.exports = Message;