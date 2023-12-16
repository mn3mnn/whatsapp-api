const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const model = mongoose.model;

const waClient_Mongoose = new Schema({
    "mobileNumber": String,
    "name": String,
}, { collection: "waClients" })

const Client = model("waClient_Mongoose", waClient_Mongoose);

module.exports = Client;