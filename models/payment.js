const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref:"user"},
    date:{type:Date, default: Date.now},
    value:{type:Number},
    check: {type: String},
    looked: {type:Boolean, default:false}
})

const Payment = mongoose.model('payment', PaymentSchema)

module.exports = Payment