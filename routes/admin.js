
const router = require('express').Router()
const Product = require('../models/product')
const Payment = require('../models/payment')
const User = require("../models/user")
const Ship = require('../models/ship')
const redirectIndex = (req,res)=>{
    if (!res.locals.isadmin & !res.locals.ismod){
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Admin değilsiniz."
        }
        return res.redirect("/")
        
    }
}


router.get('/', async (req,res)=>{

    redirectIndex(req,res)
const admin = res.locals.userdata

    Product.find({}).lean().then(products=>{
        return res.render("admin/admin", {products,admin})

    })
})


router.get("/new-product", (req,res)=>{
    redirectIndex(req,res)

    return res.render('admin/new-product')
})

router.get("/ships", async(req,res)=>{
    redirectIndex(req,res)

        var ships = await Ship.find().populate('product_id').populate('user_id').lean()
        ships = ships.reverse()
        return res.render("admin/ships",{ships})



})



router.get('/product/:id',async(req,res)=>{
    redirectIndex(req,res)
    const pro= await Product.findById(req.params.id).lean().then(pro=>{
        return res.render('admin/product', {pro})

    }).catch(err=>{
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Ürün bulunamadı."
        }
        return res.redirect('/admin')

    })



})


router.post("/new-product", async (req,res)=>{
    redirectIndex(req,res)

    const {name,details,price} = req.body
    const {banner} = req.files
    await banner.mv(`${__dirname.slice(0,-7)}/views/img/banner/${banner.name}`) //callback, 2ci arguman
    
    const newProduct = new Product({
        name:name,
        details:details,
        price:price,
        banner:banner.name,
    })
    newProduct.save().then(pro =>{

        return res.redirect(`/product/${pro._id}`)
    })

})


router.get("/ship/:id/no-stock",(req,res)=>{


    redirectIndex(req,res)

        const ship_id = req.params.id
        Ship.findById(ship_id).populate("user_id").populate('product_id').then(ship=>{
            User.findById(ship.user_id._id).then(user=>{
                user.balance = user.balance + ship.product_id.price
                user.save()
                Ship.findOneAndDelete({_id:ship._id}).then(delship=>{
                    return res.redirect("/admin/ships")
                })
            })
        })



})

router.get("/ship/:id",(req,res)=>{

    redirectIndex(req,res)


        const ship_id = req.params.id
    
        Ship.findById(ship_id).populate("user_id").populate('product_id').lean().then(ship=>{
            return res.render("admin/order", {ship})
        }).catch(err=>{
            req.session.flashmsg = {
                type: "alert alert-danger",
                msg: "Sifariş bulunamadı."
            }
        return res.redirect('/admin/ships')
            
        })

    
})
router.post('/ship/:id',(req,res)=>{
    redirectIndex(req,res)


        const ship_id = req.params.id
        Ship.findById(ship_id).populate("user_id").populate('product_id').then(ship=>{
            ship.product=req.body.product
            ship.arrived = true
            ship.save().then(updatedShip=>{
            return res.redirect('/admin/ships')
                
            })
    
        })
})

router.post('/product/:id/banner', async(req,res)=>{
    redirectIndex(req,res)
    const product_id = req.params.id
    const {banner} = req.files || ''
    await banner.mv(`${__dirname.slice(0,-7)}/views/img/banner/${banner.name}`) //callback, 2ci arguman

    Product.findById(req.params.id).then(pro=>{
        pro.banner = banner.name
        pro.save().then((updatedPro)=>{
         return res.redirect(`/admin/product/${pro._id}`)
        })
    }).catch(err=>{
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Değişiklik yapılmadı."
        }
        
     return res.redirect(`/admin/product/${pro._id}`)
        
    })
})

router.post('/product/:id/texts',(req,res)=>{
    redirectIndex(req,res)
    const product_id = req.params.id
    const {name,details,price} = req.body
    Product.findById(req.params.id).then(pro=>{
        pro.name = name
        pro.details = details
        pro.price = price
        pro.save().then((updatedPro)=>{
            return res.redirect(`/admin/product/${pro._id}`)
        })
    }).catch(err=>{
        req.session.flashmsg = {
            type: "alert alert-danger",
            msg: "Değişiklik yapılmadı."
        }
        
        return res.redirect(`/admin/product/${pro._id}`)
        
    })

})


router.get("/check", (req,res)=>{
    redirectIndex(req,res)

    Payment.find({looked:false}).populate("user").lean().then(payments=>{
        return res.render("admin/check",{payments})
    })
})
router.get("/balance", (req,res)=>{
    redirectIndex(req,res)
res.render('admin/balance')
})

router.post("/balance",(req,res)=>{
    redirectIndex(req,res)
    const {username, balance} = req.body

    User.findOne({username}).then(myuser=>{
        if(!myuser){
            req.session.flashmsg = {
                type: "alert alert-danger",
                msg: "Kullanici bulunamadi"
            }
            return res.redirect('/admin/balance')
        }
        User.findByIdAndUpdate(myuser._id, {balance:myuser.balance+parseInt(balance)}).then(()=>{
            req.session.flashmsg = {
                type: "alert alert-success",
                msg:   `<b>${username}</b> kullanıcıına <b>${balance}</b> bakiye eklendi`
            }
            return res.redirect('/admin/balance')
        }).catch(err=>{
            req.session.flashmsg = {
                type: "alert alert-danger",
                msg: "Kullanici bulunamadi"
            }
            return res.redirect('/admin/balance')
        })
    })
})


module.exports = router


