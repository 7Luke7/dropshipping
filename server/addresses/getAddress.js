const exntendedError = require("../errors/ExtendedError")
const { User } = require("../models")

const get_address = async (req, res, next) => {
    try {
        const check_addresses = await User.findById(req.session.user)

        if (!check_addresses.addresses.length) {
            throw new exntendedError("მისამართები ცარიელია", 500)
        }

        const addresses = check_addresses.addresses
        res.status(200).json({addresses})
    } catch (error) {
        next(error)
    }
}

module.exports = get_address