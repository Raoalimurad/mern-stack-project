const express = require('express')
const colors = require("colors")
const dotenv = require("dotenv")
const morgan =  require("morgan")
const connectDb =require("./config/db")
const authRoute = require("./routes/authRioute")
const categoryRoute = require("./routes/categoryRoutes")
const ProductRoute = require("./routes/ProductRoute")
const cors = require("cors")
const path = require("path")
const app = express()
dotenv.config()
app.get('/',(req,res)=>{
    res.send({message:"welcome to ecomerce website"})
})

// database config
connectDb()

// middleware
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())
app.use(express.static(path.join(__dirname,'../frontendEcomerce/dist')))

// routes
app.use("/api",authRoute)
app.use("/api/category",categoryRoute)
app.use("/api/product",ProductRoute)


app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontendEcomerce/dist/index.html'));
  });



const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`server runing on ${PORT} `.bgCyan.white)
})