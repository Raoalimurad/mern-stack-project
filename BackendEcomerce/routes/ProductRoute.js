const express = require("express")
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware")
const { createProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, ProductFilterController, productCountController, productListController, productSearchController, similarProductController, productCategoryController, braintreeTokenController, braintreePaymentController } = require("../controller/ProductController")
const formidable = require("express-formidable")
const router = express.Router()


// routes
// create
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController)
// update

router.put("/update-product/:id",requireSignIn,isAdmin,formidable(),updateProductController)
  
// get all products
router.get("/get-product",getProductController)

// get single
router.get("/one-product/:slug",getSingleProductController)

// get photo
router.get("/product-photo/:pid",getProductPhotoController)

// delete
router.delete("/delete-product/:id",deleteProductController)

// filter route
router.post("/product-filter",ProductFilterController)

// product count
router.get("/product-count",productCountController)

// product per-page
router.get("/product-list/:page",productListController)

// search product
router.get("/search/:keyword",productSearchController)

// similar product
router.get("/related-product/:pid/:cid",similarProductController)

// category wise product
router.get("/product-category/:slug",productCategoryController)

// payment method 

router.get("/braintree/token",braintreeTokenController)
router.post("/braintree/payment",requireSignIn,braintreePaymentController)
module.exports = router