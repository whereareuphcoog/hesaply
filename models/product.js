const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {type: String},
    details: {type: String},
    price: {type: Number},
    banner: {type: String},
    date: { type: Date, default: Date.now }

})

const Product = mongoose.model('product', ProductSchema)

module.exports = Product