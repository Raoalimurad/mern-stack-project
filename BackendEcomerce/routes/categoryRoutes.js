const express = require("express")
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware")
const {createCategoryController, updateCategoryController, getAllCategoryController, singleCategoryController, deleteCategoryController} = require("../controller/CategoryController")
const router = express.Router()


router.post("/create-category",requireSignIn,isAdmin,createCategoryController)


// for update 
router.put("/update/:id",requireSignIn,isAdmin,updateCategoryController)


// get all category
router.get("/all-category",getAllCategoryController)

// get one category
router.get("/category/:slug",singleCategoryController)

// delete category
router.delete("/delete/:id",requireSignIn,isAdmin,deleteCategoryController)

module.exports = router