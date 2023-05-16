const router = require('express').Router()
const Message = require('../models/message')
const User = require('../models/user')
router.get('/',async(req,res)=>{
const {userdata} = await res.locals
    if(!userdata){
    return res.render('chat/chat_notlogedin', {layout:false})
} else {
    Message.find().sort({ _id: -1 }).limit(20).populate("user_id").lean().then(messages=>{
        messages = messages.reverse()
        return res.render('chat/chat', {messages,layout: false})
    
    })
}



})


module.exports = router


