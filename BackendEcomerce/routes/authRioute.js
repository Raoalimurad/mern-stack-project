const express = require("express")
const {registerController,loginController,forgotPassController, updateProfileController, getOrderController, getAllOrderController, orderStatusController} = require('../controller/authController')
const {isAdmin,requireSignIn} = require("../middleware/authMiddleware")
const router  = express.Router()

// register post method
router.post("/register",registerController)
router.post('/login',loginController)
router.post("/forgotPassword",forgotPassController)
router.get("/user",requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    })
} )
router.get("/admin",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
} )

router.put("/profile",requireSignIn,updateProfileController)

router.get("/orders",requireSignIn,getOrderController)
router.get("/all-orders",requireSignIn,isAdmin,getAllOrderController)
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController)

module.exports = router