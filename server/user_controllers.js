const exntendedError = require("./errors/ExtendedError");
const { User } = require("./models");

const user_profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user)

        const {phone, email, addresses} = user

        res.status(200).json({
            phone,
            email,
            addresses
        })
    } catch (error) {
        next(error)
    }
}

const logout_user = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw new exntendedError("ვერ მოხდა თქვენი სისტემიდან გასვლა სცადეთ თავიდან.", 500)
            }
        })

        res.cookie('connect.sid', '', { expires: new Date(0), httpOnly: true });
        res.status(200).json({message: "Authed"})
    } catch (error) {
        next(error)
    }
}

const addToCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user);
        if (user) {
            const cartItem = user.cart.find(item => item.ID === req.body.ID);
            if (cartItem) {
                throw new exntendedError("მოცემული პროდუქტი უკვე კალათაშია.", 400)
            } else {
                if (!req.body) {
                    throw new exntendedError("წარმოიშვა შეცდომა სცადეთ თავიდან.", 400)
                }
        
                user.cart.push({
                    PID: req.body.PID,
                    STANDARD: req.body.STANDARD,
                    IMG: req.body.IMG,
                    VARIANTKEY: req.body.VARIANTKEY,
                    NAMEEN: req.body.NAMEEN,
                    SELLPRICE: req.body.SELLPRICE,
                    SKU: req.body.SKU, 
                    quantity: req.body.quantity,
                    WEIGHT: req.body.WEIGHT,
                    ID: req.body.ID,
                    PACKWEIGHT: req.body.PACKWEIGHT
                });
        
                const totalPrice = user.cart.reduce((sum, item) => sum + item.SELLPRICE, 0);
        
                await User.findByIdAndUpdate(req.session.user, { $set: { totalSellPrice: totalPrice } });
        
                user.save();
                res.status(200).json({message: "დამატებულია"})
            }
        } else {
            throw new exntendedError("სისტემაში წარმოიშვა შეცდომა ცადეთ მოგვიანებით.", 500)
        }
    } catch (error) {
        next(error)
    }
}

const getCart = async (req, res, next) => {
    try {
        const get_user = await User.findById(req.session.user)

        if (!get_user) {
            throw exntendedError("სისტემაში წარმოიშვა შეცდომა ცადეთ მოგვიანებით.", 500)
        }
        
        res.status(200).json(get_user.cart)
    } catch (error) {
        next(error)
    }
}

const deleteCart = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.session.user, {
            $pull: {
                cart: {
                    "ID": req.params.id
                }
            }
        },
        {new: true}
        )

        res.status(200).json(user.cart)
    } catch (error) {
        next(error)
    }
}

const clearCart = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate({_id: req.session.user}, {
            $unset: {
                cart: ""
            }
        }, {new: true})

        if (user.cart.length) {
            throw exntendedError("სისტემაში წარმოიშვა შეცდომა ცადეთ მოგვიანებით.", 500)
        }

        res.status(200).json({message: "cart cleared."})
    } catch (error) {
        next(error)
    }
}


// Even tho this has a little security its not really secured
const update_user_email = async (req, res, next) => {
    try {   
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.emailInput)) {
            throw new exntendedError("გთხოვთ შეიყვანოთ სწორი მონაცემები.", 400)
        }
        
        const exists = await User.findOne({email: req.body.emailInput });
        if (exists) {
            throw new exntendedError("მომხმარებელი მეილით უკვე არსებობს", 400)
        }

        const user = await User.findOneAndUpdate(
            {_id: req.session.user}, 
            {$set: {email: req.body.emailInput}},
            {new: true}
        )

        const {email} = user
        res.status(200).json({
            email,
        })
    } catch (error) {
        next(error)
    }
}

const update_user_phone = async (req, res, next) => {
    try {   
        const phoneRegex = /^\d{9}$/;

        const phone_number = Number(req.body.phoneInput)
        
        if (!phoneRegex.test(phone_number)) {
            throw new exntendedError("გთხოვთ შეიყვანოთ სწორი მონაცემები.", 400)
        }
        
        const exists = await User.findOne({ phone: phone_number });

        if (exists) {
            throw new exntendedError("მომხმარებელი ტელეფონის ნომრით უკვე არსებობს", 400)
        }

        const user = await User.findOneAndUpdate(
            {_id: req.session.user}, 
            {$set: {phone: phone_number}},
            {new: true}
        )

        const {phone} = user

        res.status(200).json({
            phone,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {user_profile, update_user_phone, update_user_email, logout_user, clearCart, addToCart, deleteCart, getCart}