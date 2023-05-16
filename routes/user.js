const router = require("express").Router()
const User = require('../models/user')
const Ship = require("../models/ship")
const emailvalidator = require("email-validator")

//name regexp
function onlyLettersAndNumbers(str) {
    return /^[A-Za-z0-9]*$/.test(str);
  }

  
function colorPicker() {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//register
router.get('/register', (req,res)=>{
    if(req.session.user_id){
        return res.redirect('/')
    }else{
        res.locals.title = 'Kayıt Ol - FreeShop'
        return res.render("user/register")
    }

})


router.post("/register", async (req,res)=>{

    const {username,password,email} = req.body
    var is_username_unique = await User.findOne({username})
    var is_email_unique = await User.findOne({email})

    if(!onlyLettersAndNumbers(username)){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "İsim formatı düzgün değil."
        }
        
        return res.redirect('/user/register')
        
    }


    if(is_username_unique){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Kullanıcı adı önceden kullanılmış."
        }
        
        return res.redirect('/user/register')
        
    }


    if(is_email_unique){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "E-posta önceden kullanılmış."
        }
        
        return res.redirect('/user/register')
        
    }

    if(!emailvalidator.validate(email)){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Hatalı değerler tespit edildi."
        }
        
        return res.redirect('/user/register')
        
    }

    if(password.length >16  || email.length>60 || username.length>16){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Hatalı değerler tespit edildi."
        }
        
        return res.redirect('/user/register')
        
    }
    const color = colorPicker()
    const newUser = await new User({username,password,email,color})
    req.session.user_id = await newUser._id


    await newUser.save()
    return res.redirect('/')


})

router.get('/login', (req,res)=>{
    if(req.session.user_id){
        return res.redirect('/')
    }
    res.locals.title = 'Giriş Yap - FreeShop'

    return res.render("user/login")
})


router.post("/login", async (req,res)=>{


    const {password,email} = req.body

    if(password.length >16  || email.length>60 ){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Hatalı değerler tespit edildi."
        }
        
        return res.redirect('/user/login')
        
    }

     const user = await User.findOne({email,password}).lean()
    if (user){
        req.session.user_id = user._id
req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
        return res.redirect('/')

    } else{
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Dahil ettiğiniz e-posta ve ya şifre yanlış."
        }
        
        return res.redirect('/user/login')

    }

})  

//dashboard

router.get("/dashboard", async(req,res)=>{
    if(res.locals.loggedin){
        const {user_id} = req.session
        const user = await User.findById(user_id).lean()
    res.locals.title = 'Hesap Bilgileri- FreeShop'

    return res.render('user/dashboard', {user})
    } else{
        return res.redirect('/')
    }
})

router.get('/dashboard/ships', async (req,res)=>{
    if(res.locals.loggedin){
        const {user_id} = req.session
        var ships = await Ship.find({user_id}).populate('user_id').populate('product_id').lean()
        ships = ships.reverse()
        res.locals.title = 'Alımlar- FreeShop'
    
        return res.render("user/ships", {ships})
    } else{
        return res.redirect('/')
    }


})


router.get('/logout', (req,res)=>{
    if(req.session.user_id){
        const filter = {_id:req.session.user_id}
        const update = {online:false}
        User.findOneAndUpdate(filter,update).then(async (offlineuser)=>{
            await req.session.destroy()
            res.locals.userdata = undefined
            return res.redirect('/')
            
        })
    } else {

        req.session.flashmsg = {
            type: "alert alert-warning",
            msg: "Lütfen giriş yapın."
        }
        
        return res.redirect('/user/login')
    }


})


module.exports = router