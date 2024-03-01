const exntendedError = require("../errors/ExtendedError");
const { User } = require("../models")

const delete_address = async (req, res, next) => {
    try {
        const check_addresses = await User.findByIdAndUpdate(req.session.user, {
            $pull: {
                addresses: {
                    _id: req.params.id
                }
            },
            
        },
        {new: true}
        )

        res.status(200).json(check_addresses.addresses)
    } catch (error) {
        next(error)
    }
}

module.exports = delete_address