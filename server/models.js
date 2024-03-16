const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    PID: String,
    STANDARD: String,
    IMG: String,
    VARIANTKEY: String,
    NAMEEN: String,
    SELLPRICE: String,
    SKU: String, 
    quantity: Number,
    WEIGHT: Number,
    ID: String,
    PACKWEIGHT: String
})

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    cart: [cartSchema],
    addresses: [addressSchema],
    salt: {
        type: String,
        required: true,
    },
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = {User}