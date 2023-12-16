const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const model = mongoose.model;

const apiUser_Mongoose = new Schema({
    "name": String,
    "userKey": String,
}, { collection: "apiUsers" })

const APIUser = model("apiUser_Mongoose", apiUser_Mongoose);

module.exports = APIUser;
