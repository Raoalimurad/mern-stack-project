const { hashPassword, comparePass } = require("../helpers/authHelper")
const userModel = require("../models/userModel")
const orderModel = require("../models/OrderModel")
const Jwt = require("jsonwebtoken")

const registerController = async (req,res)=>{
try {
    const {name,email,password,phone,address,answer} = req.body
    if(!name){
        return res.send({message:'name is Required'})
    }
    if(!email){
        return res.send({message:'email is Required'})
    }
    if(!password){
        return res.send({message:'password is Required'})
    }
    if(!address){
        return res.send({message:'address is Required'})
    }
    if(!answer){
        return res.send({message:'answer is Required'})
    }
    if(!phone){
        return res.send({message:'phone is Required'})
    }
    

//  existing user
const existingUser =await userModel.findOne({email})

// check user
if(existingUser){
    return res.status(200).send({
        success:false,
        message:"user already exist please login"
    })
}
// hash password 
const hashedPassword = await hashPassword(password)
 const user =await new userModel({name,email,password:hashedPassword,phone,address,answer}).save()
 res.status(201).send({
    success:true,
    message:"user register successfully",
    user
 })



} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in Registartion",
        error
    })
}
    
}


// LOGIN API
const loginController = async (req,res)=>{
    
    try {
        
        const {email,password} = req.body
        if(!email || !password){
           return res.status(404).send({
            success:false,
            message:"Invalid email or password"
           })
        }

        // check user 
        const user = await userModel.findOne({email})
        if(!user){
           return res.status(404).send({
            success:false,
            message:"email is not register"
           })
        }
        const match = await comparePass(password,user.password)
       if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid password'

        })
       }


       const token = await Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"5d"})
       res.status(200).send({
        success:true,
        message:"login successfully",
        user:{
           name:user.name,
           email:user.email,
           role:user.role,
           address:user.address,
           phone:user.phone
        },
        token
       })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}





const forgotPassController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
      if (!answer) {
        return res.status(400).send({ message: "Answer is required" });
      }
      if (!newPassword) {
        return res.status(400).send({ message: "New password is required" });
      }
  
      // Check user existence and verify answer
      const user = await userModel.findOne({ email, answer });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong email or answer",
        });
      }
  
      // Hash the new password
      const hashed =   await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password:hashed });
  
      return res.status(200).send({
        success: true,
        message: "Password updated successfully",
      });
  
    } catch (error) {
      console.error('Error in forgotPassController:', error);
      if (!res.headersSent) {
        return res.status(500).send({
          success: false,
          message: "Something went wrong",
          error,
        });
      }
    }
  }
  





  const updateProfileController = async (req, res) => {
    try {
      const { name, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (password && password.length < 6) {
        return res.status(400).json({ error: "Password should be at least 6 characters long" });
      }
  
      const hashedPassword = password ? await hashPassword(password) : undefined;
  
      const updateData = {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      };
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true } // Return the updated document
      );
  
      res.status(200).send({
        success: true,
        message: "User updated successfully",
        updatedUser,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in user update",
        error: error.message,
      });
    }
  };
  


const getOrderController = async (req,res)=>{
  try {
    
    const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
    res.json(orders)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"error in while getting orders",
      error:error.message
    })
  }
}


const getAllOrderController = async (req,res)=>{
  try {
    
    const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:-1})

    res.json(orders)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"error in while getting all orders",
      error:error.message
    })
  }
}

const orderStatusController = async (req,res)=>{
  try {
    
    const {orderId} = req.params
    const {status} = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"error in update order",
      success:false,
      error:error.message

    })
  }
}


module.exports = {registerController,loginController,forgotPassController,updateProfileController,getOrderController,getAllOrderController,orderStatusController}