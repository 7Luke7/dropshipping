const exntendedError = require("../errors/ExtendedError");
const { User } = require("../models")

const add_address = async (req, res, next) => {
    try {
        const {state, city, street} = req.body
        if (!state || !city || !street) {
            throw new exntendedError("გთხოვთ შეავსოთ ველები.", 500)
        }
        const check_addresses = await User.findById(req.session.user)
        if (check_addresses.addresses.length === 5) {
            throw new exntendedError("მაქსიმუმი მისამართების რაოდენობა მიღწეულია.", 500)
        } else {
            check_addresses.addresses.push({
                state,
                city,
                street
            })
            await check_addresses.save()
        }

        const addresses = check_addresses.addresses
        res.status(200).json({addresses})
    } catch (error) {
        next(error)
    }
}

module.exports = add_address