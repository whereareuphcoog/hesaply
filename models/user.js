const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
username: {type: String},
password: {type:String},
email:{type:String},
balance:{type:Number, default: 0},
ships: {type: Array, default: []},
date: { type: Date, default: Date.now },
online: {type: Boolean, default: false},
role:{type:String, default:"user"},
color: {type:String}

})

const User = mongoose.model('user', UserSchema)

module.exports = User