require("dotenv").config()
const extendedError = require("./errors/ExtendedError");
const sharp = require("sharp")

const get_inventory = async (req, res, next) => {
    const supportedCountries = ['CN', 'US', 'DE', 'GB']
    const demo_products = {
        count: 1,
        id: "1731593752067710976",
        productId: '1731593751648280576'
    }
    const demo_logisticPayload = {
        addressId: "1702750960981647360",
        areaId: 1,
        type: 1,
        productList: [
            {
                count: 1,
                id: "1731593752067710976",
                productId: '1731593751648280576'
            },
            {
                count: 2,
                id: "1684089881070411776",
                productId: '1684089880936194048'
            }
        ]
    }
    try {
        const request = await fetch("https://cjdropshipping.com/cjorder-web/directOrder/getCreateConfirmProductV2", {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                addressId: process.env.US,
                type: 1,
                variants: [
                    demo_products
                ]
            })
        })

        if (!request.ok) {
            throw new extendedError("დაფიქსირდა მოულოდნელი შეცდომა.", 500)
        }

        const orders = await request.json()
    
        // შეამოწმე ნივთის რაოდენობა
        const country = warehouse_data.data.filter((warehouse) => supportedCountries.includes(warehouse.countryCode))

        let ship

        if (country.length === 0) {
            throw new extendedError("არ ვაგზავნით მოცემულ ქვეყანაში", 400)
        }

        const checkUS = country.filter((c) => c.countryCode === "US")
        const checkGB = country.filter((c) => c.countryCode === "GB")
        const checkDE = country.filter((c) => c.countryCode === "DE")

        const weight = Math.ceil(req.query.variantWeight / 100) * 100
        const length = req.query.variantLength / 10
        const height = req.query.variantHeight / 10
        const width = req.query.variantWidth / 10
        const volumeWeight = length * width * height / 6000

        let isAragabarituli = false
        if (length > 150 || height > 150 || width > 150 || weight * 2 < volumeWeight ) {
            isAragabarituli = true
        }

        let gramPrice
        let droOnex

        if (checkUS.length !== 0 ) {
            ship = "US"
            if (isAragabarituli) {
                gramPrice = 0.483 * volumeWeight
            } else {
                gramPrice = 0.86 * (weight / 100)
            }
            droOnex = "4-8"  
        } else if(checkGB.length !== 0) {
            ship = "GB"
            if (isAragabarituli) {
                gramPrice = 0.483 * volumeWeight
            } else {
                gramPrice = 0.86 * (weight / 100)  
            }
            droOnex = "4-8"
        } else if(checkDE.length !== 0) {
            ship = "DE"
            if (isAragabarituli) {
                gramPrice = 0.595 * volumeWeight
            } else {
                gramPrice = 0.86 * (weight / 100)  
            }
            droOnex = "5-10"
        } else {
            ship = "CN"
            if (isAragabarituli) {
                gramPrice = 0.669 * volumeWeight
            } else {
                gramPrice = 1.19 * (weight / 100)  
            }
            droOnex = "5-10"  
        }

        const calculate_freight = await fetch("https://cjdropshipping.com/cjorder-web/directOrder/getLogisticListV3", {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(demo_logisticPayload)
        })

        if (!calculate_freight.ok) {
            throw new extendedError("დაფიქსირდა მოულოდნელი შეცდომა.", 500)
        }

        const freight_data = await calculate_freight.json()
                
        const subPriceInventory = freight_data.data.map((shipping) => {
            shipping.logisticPrice += gramPrice
            const onexStartAge = droOnex.split("-")[0]
            const onexEndAge = droOnex.split("-")[1]
            const startAgeCJ = shipping.logisticAging.split("-")[0]
            const endAgeCJ = shipping.logisticAging.split("-")[1]

            const resultStart = Number(onexStartAge) + Number(startAgeCJ);
            const resultEnd = Number(onexEndAge) + Number(endAgeCJ) + 3;

            shipping.logisticAging = `${resultStart}-${resultEnd}`
            return shipping
        })

        res.status(200).json({
            freight_data: subPriceInventory,
            warehouse_data: warehouse_data.data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    get_inventory,
}