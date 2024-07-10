
const categoryModel = require("../models/CategoryModel")
const ProductModel = require("../models/ProductModel")
const orderModel = require("../models/OrderModel")
const fs = require("fs")
require('dotenv').config();
const slugify = require("slugify")
var braintree = require("braintree");

// payment method
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTEE_MERCHANT_ID,
    publicKey: process.env.BRAINTEE_PUBLIC_KEY,
    privateKey: process.env.BRAINTEE_PRIVATE_KEY,
});


const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        // validatin
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !description:
                return res.status(500).send({ error: "description is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case !shipping:
                return res.status(500).send({ error: "shipping is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and less then 1mb" })
        }

        const products = new ProductModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "product created successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in creating product",
            success: false,
            error
        })
    }
}

// get product
const getProductController = async (req, res) => {
    try {
        const product = await ProductModel.find({}).select("-photo").limit(12).sort({ createdAt: -1 }).populate("category")
        res.status(201).send({
            total: product.length,
            success: true,
            message: "A list of Product",
            product,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in while getting product",
            error: error.message
        })

    }
}
// get single 
const getSingleProductController = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(201).send({
            success: true,
            message: "A single product",
            product
        })

    } catch (error) {
        console.log(error)
        res.status(501).send({
            message: "error in single product",
            success: false,
            error: error.message
        })
    }
}

// get photo
const getProductPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("content-type", product.photo.contentType)
            return res.status(201).send(product.photo.data)
        }

    } catch (error) {
        console.log(error),
            res.status(501).send({
                success: false,
                message: "error in product photo",
                error: error.message
            })
    }
}

const deleteProductController = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id).select("-photo");
        res.status(201).send({
            success: true,
            message: "product deleted successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(501).send({
            success: false,
            message: "error in while deleting product",
            error: error.message
        })

    }
}

const updateProductController = async (req, res) => {

    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        // validatin
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !description:
                return res.status(500).send({ error: "description is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case !shipping:
                return res.status(500).send({ error: "shipping is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and less then 1mb" })
        }

        const products = await ProductModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "product updated successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in updating product",
            success: false,
            error
        })
    }

}

// filter of product
const ProductFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await ProductModel.find(args)
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "error in while filtering products",
            error: error.message
        })
    }
}

// product count 

const productCountController = async (req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in while count product"
        })
    }
}

// product list - page

const productListController = async (req, res) => {
    try {
        const perPage = 1;
        const page = req.params.page ? req.params.page : 1;
        const products = await ProductModel.find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in while getting page",
            error: error.message,
        });
    }
};

//   search controller
const productSearchController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Error in while searching products",
            error: error.message
        })
    }
}
//   similar product controller
const similarProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await ProductModel.find({
            category: cid,
            _id: { $ne: pid },
        }).select("-photo").limit(3).populate("category");

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in similar product",
            error: error.message,
        });
    }
};


//   product category
const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await ProductModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "error in product category",
            errror: error.message
        })
    }
}

// token

const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// payment
const braintreePaymentController = async (req, res) => {
    try {
        const { nonce, carts } = req.body;
        let total = 0;
        carts.map((i) => {
          total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
          {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: true,
            },
          },
          function (error, result) {
            if (result) {
              const order = new orderModel({
                products: carts,
                payment: result,
                buyer: req.user._id,
              }).save();
              res.json({ ok: true });
            } else {
              res.status(500).send(error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
}






module.exports = { createProductController, getProductController, getSingleProductController, getProductPhotoController, deleteProductController, updateProductController, ProductFilterController, productCountController, productListController, productSearchController, similarProductController, productCategoryController, braintreeTokenController, braintreePaymentController }