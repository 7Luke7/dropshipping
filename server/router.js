const router = require("express").Router()
const { get_inventory, compress_image} = require("./cj_product_controller")
const {register_user, login_user, isAuthenticated} = require("./authentication")
const { user_profile, logout_user, addToCart, getCart, deleteCart, clearCart, update_user_phone, update_user_email } = require("./user_controllers")
const get_address = require("./addresses/getAddress")
const add_address = require("./addresses/addAddress")
const delete_address = require("./addresses/deleteAddress")
const processPayment = require("./payments/processPayment")

router.post("/register_user", register_user)
router.post("/login_user", login_user)
router.get("/profile", isAuthenticated, user_profile)
router.delete("/logout", isAuthenticated, logout_user)
router.get("/address", isAuthenticated, get_address)
router.post("/address", isAuthenticated, add_address)
router.delete("/address/:id", isAuthenticated, delete_address)
router.post("/tocart", isAuthenticated, addToCart)
router.get("/getcart", isAuthenticated, getCart)
router.delete("/deletecart/:id", isAuthenticated, deleteCart)
router.delete("/clear", isAuthenticated, clearCart)
router.get("/get_inventory/:id", isAuthenticated, get_inventory)
router.post("/processPayment", isAuthenticated, processPayment)
router.patch("/update_user_email", isAuthenticated, update_user_email)
router.patch("/update_user_phone", isAuthenticated, update_user_phone)

module.exports = router