const mongoose = require('mongoose')


const ShipSchema = new mongoose.Schema({
    product_id: {type: mongoose.Types.ObjectId, ref:"product"},
    user_id: {type: mongoose.Types.ObjectId, ref:"user"},
    product: {type:String},
    date: { type: Date, default: Date.now },
    arrived: {type:Boolean, default: false},
    meta: {type:String}
})


const Ship = mongoose.model('ship', ShipSchema)

module.exports = Ship