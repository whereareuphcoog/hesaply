const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    content: {type:String},
    user_id: {type: mongoose.Types.ObjectId, ref:"user"},
    date: {type:Date}
})

const Message = mongoose.model('message', MessageSchema)

module.exports = Message