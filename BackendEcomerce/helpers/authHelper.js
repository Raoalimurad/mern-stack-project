const byrcpt = require("bcrypt")
const { model } = require("mongoose")

const hashPassword = async (password)=>{
    try {
        const roundes = 10
        const hashPass = await byrcpt.hash(password,roundes)
        return hashPass
    } catch (error) {
        console.log(error)
    }
}


const comparePass =async (password,hashedPassword)=>{
   return  byrcpt.compare(password,hashedPassword)
   
}
module.exports = {hashPassword,comparePass}