const TBC_SKELETON = require("./get_access_token")

const exchange_currecny = async () => {
    try {
        const exchanges = await new TBC_SKELETON.exchange_currencies()

        console.log(exchanges)
    } catch (error) {
        
    }
}

module.exports = exchange_currecny