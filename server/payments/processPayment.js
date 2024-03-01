const processPayment = (req, res, next) => {
    try {
        
        res.status(200).json({payment: "success"})
    } catch (error) {
        next(error)
    }
}

module.exports = processPayment