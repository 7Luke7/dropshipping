const authenticationError = (err, req, res, next) => {
    if (err.status !== 401) {
        return next(err)
    }

    return res.status(err.status).json({
        message: err.message,
        status: err.status
    })
}

const globalError = (err, req, res, next) => {
    if (err.reason) {
        return res.status(400).json({
            message: "გთხოვთ შეიყვანოთ სწორი მონაცემები",
            status: 400
        })
    }
    return res.status(err.status).json({
        message: err.message,
        status: err.status
    })
}

module.exports = {
    globalError,
    authenticationError,
}