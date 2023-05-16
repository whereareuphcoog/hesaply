const router = require('express').Router()
const Product = require('../models/product')
const User = require("../models/user")
const Ship = require("../models/ship")


function generateRandomLetters(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      let randomCharCode = Math.floor(Math.random() * 26) + 97; // generate a random number between 97 and 122, which correspond to the ASCII codes for lowercase letters
      let randomLetter = String.fromCharCode(randomCharCode); // convert the ASCII code to a letter
      result += randomLetter;
    }
    return result;
  }
  



router.get('/product/:id', async(req,res)=>{


    const pro =  await Product.findById(req.params.id).lean().then(pro=>{
        res.locals.title = `${pro.name} - FreeShop`
        res.render('product', {pro})

    }).catch(err=>{
        req.session.flashmsg = {
            type: "alert alert-warning",
            msg: "Ürün bulunamadı."
        }
        res.redirect("/filter")
    })
})

// buying something - on test
router.post("/product/:id", async (req,res)=>{
    const product_id = req.params.id
    const {user_id} = req.session

    if(!user_id){
        return res.redirect("/user/login")
    }


    
    const product = await Product.findById(product_id).lean()
    var cari = product.sellcount || 0
    var sell_count = cari + 1
    Product.findByIdAndUpdate(product_id,{sell_count:sell_count}).catch(err=>{
        console.log(err)
    })

    User.findById(user_id).then(user=>{

        if(user.balance<product.price){
            req.session.flashmsg = {
                type: "alert alert-danger",
                msg: "Yeterli bakiyeniz yok."
            }
            
            return res.redirect(`/product/${product_id}`)
        }
    user.balance = user.balance - product.price

    const newShip = new Ship({
        product_id:product_id,
        user_id:user_id,
        meta:generateRandomLetters(10)
    })
    newShip.save()

        user.save().then(updatedUser=>{
            req.session.flashmsg = {
                type: "alert alert-success",
                msg: "Sifarişiniz başarıyla alındı. Bir kaç saat içerisinde ulaştırılacaktır."
            }

            

            return res.redirect('/user/dashboard/ships')
        })
    })




})

module.exports = router