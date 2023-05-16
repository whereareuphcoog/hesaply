const express = require("express")
const router = express.Router()
const Payment = require("../models/payment")

const redirect = (req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/user/login')
    }
}

router.get('/check', (req,res)=>{
    redirect(req,res)
    return res.render('balance/check')
})
router.post('/check', async (req,res)=>{
    const {check} = req.files
    await check.mv(`${__dirname.slice(0,-7)}/views/img/check/${check.name}`)
    const newPayment = new Payment({
        check:check.name,
        user: req.session.user_id,
        date: Date.now()
    })
    
    newPayment.save().then(()=>{
        req.session.flashmsg = {
            type: "alert alert-success",
            msg: "Bildiriş göndərildi."
        }
        return res.redirect("/check")
    })
    

})


module.exports = router