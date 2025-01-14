const categoryModel = require("../models/CategoryModel")
const slugify = require("slugify")

const createCategoryController = async (req,res)=>{
 try {
    const {name} = req.body
    if(!name){
      return  res.status(401).send({
        message:"name is required"
      })
    }
    const existingCategory = await categoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category Already exist"
        })
    }
    const category = await new categoryModel({ name, slug:slugify(name)}).save()
     res.status(201).send({
        success:true,
        message:"new category created",
        category
     })

 } catch (error) {
    console.log(error)
    res.status(501).send({
        success:false,
        error,
        message:"error in category"
    })
 }
}


// update 
const updateCategoryController = async (req,res)=>{
try {
   const {name} = req.body
   const {id} = req.params
   const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({
      success:true,
      message:"category updated successfully",
      category
    })


} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"errror while updating category",
    error
  })
}
}
// get all category
const getAllCategoryController = async(req,res)=>{
try {
  const category = await categoryModel.find({})
  res.status(200).send({
    success:true,
    message:"All category list",
    category
  })

} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"error while getting all category",
    error
  })
}
}
 const singleCategoryController = async (req,res)=>{
   try {
    
    const category = await categoryModel.findOne({slug: req.params.slug})
    res.status(200).send({
      success:true,
      message:"A single category ",
      category
    })

   } catch (error) {
    console.log(error),
    res.status(500).send({
      success:false,
      message:'error while getting single category',
      error
    })

   }
 }
const deleteCategoryController =async (req,res)=>{
try {
  const {id} = req.params
  const category = await categoryModel.findByIdAndDelete(id)
  res.status(200).send({
    success:true,
    message:"user deleted successfully"
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"erorr while deleting category",
    error
  })
}
}






module.exports = {createCategoryController,updateCategoryController,getAllCategoryController,singleCategoryController,deleteCategoryController}