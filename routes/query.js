const router = require('express').Router()
const Product = require('../models/product')




router.get('/filter',async(req,res)=>{
    const products = await Product.find().lean()
    const products_count = products.length
return res.render('filter', {products, products_count})    
})
router.get('/search',  (req,res)=>{
    const {q} = req.query





    Product.find({ $text:{$search:q} }).lean().then(products=>{
        const products_count = products.length
        return res.render("filter", {products, products_count})

    }).catch(err=>{
        return res.redirect("/")
    })


})

router.get("/category/all",async (req,res)=>{
    const {category} = req.params

    const {userdata} = res.locals
    const products = await Product.find().lean()
    
    return res.render("listing", {products,userdata})
})

router.get("/category/:category",async (req,res)=>{
    const {category} = req.params

    const {userdata} = res.locals
    res.locals.title = `${category} Kategorisi - FreeShop`
    const products = await Product.find({ $text:{$search:category} }).lean()
    
    return res.render("listing", {products,userdata})
})



module.exports = router