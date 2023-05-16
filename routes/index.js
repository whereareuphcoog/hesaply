const router = require('express').Router()
const Product = require('../models/product')
const User = require("../models/user")



router.get('/',async (req,res)=>{
const admins = await User.find({role:"admin",online:true}).lean()
const mods =await  User.find({role:"mod",online:true}).lean()
const users = await User.find().lean()
const products = await Product.find().lean()


    res.render("index",{admins,mods,user_count:users.length,pro_count:products.length})})
            

        

module.exports = router