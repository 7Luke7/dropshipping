require("dotenv").config()
const CJClient = require("./cj_authentication/cj_authentication");
const extendedError = require("./errors/ExtendedError");

const get_inventory = async (req, res, next) => {
    try {
        // use the api of the onex for getting the prices so it will be up to data
        // use TBC API for the currency exchanges
        // put everything for GEL

        const supportedCountries = ["US", "CN", "FR", "GB", "DE"]

        const freight_data = req.body.areas.data

        const country = freight_data.filter((freight) => supportedCountries.includes(freight.countryCode))

        let ship

        if (country.length === 0) {
            throw new extendedError("არ ვაგზავნით მოცემულ ქვეყანაში", 400)
        }

        const checkUS = country.find((c) => c.countryCode === "US")
        const checkGB = country.find((c) => c.countryCode === "GB")
        const checkFR = country.find((c) => c.countryCode === "FR")   
        const checkDE = country.find((c) => c.countryCode === "DE")   

        const variant = req.body.purchase

        const standards_with_equal = variant.STANDARD.match(/\d+/g);
        const length = standards_with_equal[0]
        const width = standards_with_equal[1]
        const height = standards_with_equal[2]

        const weight = Math.ceil(variant.PACKWEIGHT / 100) * 100
        
        const volumeWeight = ((length / 10) * (width / 10) * (height / 10)) / 6000

        let isAragabarituli = false
        if (length / 10 > 150 || height / 10 > 150 || width / 10 > 150 || weight * 2 < volumeWeight ) {
            isAragabarituli = true
        }

        let hundredGramPrice
        let droOnex

        if(checkUS) {
            ship = "US"
            if (isAragabarituli) {
                hundredGramPrice = 0.491 * volumeWeight
            } else {
                hundredGramPrice = 0.86 * (weight / 100)
            }
            droOnex = "4-8" 
        } else if(checkDE) {
            ship = "DE"
            if (isAragabarituli) {
                hundredGramPrice = 0.604 * volumeWeight
            } else {
                hundredGramPrice = 0.86 * (weight / 100)  
            }
            droOnex = "5-10"
        } else if (checkGB) {
            ship = "GB"
            if (isAragabarituli) {
                hundredGramPrice = 0.491 * volumeWeight
            } else {
                hundredGramPrice = 0.86 * (weight / 100)  
            }
            droOnex = "4-8"
        } else if (checkFR) {
            ship = "FR"
            hundredGramPrice = 3.77 * (weight / 100)  
            
            droOnex = "5-10"  
        } else {
            ship = "CN"
            if (isAragabarituli) {
                hundredGramPrice = 0.679 * volumeWeight
            } else {
                hundredGramPrice = 1.208 * (weight / 100)  
            }
            droOnex = "5-10" 
        }

        const request_logistics = await new CJClient().createRequest("https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate", "POST", {
            "startCountryCode": ship,
            "endCountryCode": ship,
            "products": [
                {
                    "quantity": variant.quantity,
                    "vid": variant.ID
                }
            ]
        })

        const subPriceInventory = request_logistics.data.map((shipping) => {
            shipping.logisticPrice += hundredGramPrice
            const onexStartAge = droOnex.split("-")[0]
            const onexEndAge = droOnex.split("-")[1]
            const startAgeCJ = shipping.logisticAging.split("-")[0]
            const endAgeCJ = shipping.logisticAging.split("-")[1]

            const resultStart = Number(onexStartAge) + Number(startAgeCJ);
            const resultEnd = Number(onexEndAge) + Number(endAgeCJ) + 3;

            shipping.logisticAging = `${resultStart}-${resultEnd}`
            return shipping
        })

        const filtered_sub_price = subPriceInventory.filter((a, index, self) => {
            return index === self.findIndex(b => b.logisticName === a.logisticName)
        })
        
        res.status(200).json({
            freight_data: filtered_sub_price,
            warehouse_data: freight_data
        })
    } catch (error) {
        next(error)
    }
}

const make_order = async (req, res, next) => {
    try {
        const make_order_request = await fetch("https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "CJ-Access-Token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMTQ1MSIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnlqZ3dvVTdmekhwbUV4LysxS2tkUVUwRFF6Y3BBbDljSVZyMGxnYWVEQjJLcGlLL1BDTklzN1N4aHNrbkpNOHpySmUrWkRBL3Z5N2xMN0NwWWZrU0hUcnBLTm9RejhESVNITEV6UUU1aTZFd3kzQnQ2cHl3aXkwUlp3bEtTV3pHVS8ySVdlb2lZSFlVMUpEKzBxRHBhWWRCQ3hhYnd6N1U1MmFRSE9TNnV2bDFQNm1icDlYdGxDRVFTcVlnNW9saDEwTUV1Y05LVnJ3NWcyMU9SaERZbEYydnpKbUZHS3F1bUJoUndqWjk3UklUdmpMSkNUdWJvSTJqNTIzbVptQ1V1aitwbTZmVjdaUWhFRXFtSU9hSllkZVdiUHFnT0VWUTNva3RjZ0ZKVWdkaSJ9.DavISNdRzw4SL_bVZVLCfOUuCGy1oXSpNja8rwTth8I"
            },
            body: JSON.stringify({
                "orderNumber": process.env.ORDER_NUMBER,
                "shippingZip": "123",
                "shippingCountryCode": "US",
                "shippingCountry": "123",
                "shippingProvince": "123",
                "shippingCity": "132",
                "shippingAddress": "123213",
                "shippingCustomerName": "123213",
                "shippingPhone": "111",
                "remark": "note",
                "fromCountryCode": "CN",
                "logisticName": "PostNL",
                "houseNumber": "123",
                "email": process.env.EMAIL,
                "products": [
                    {
                        "vid": "92511400-C758-4474-93CA-66D442F5F787",
                        "quantity": 1
                    }
                ]
            })
        })

        if (!request.ok) {
            throw new extendedError("დაფიქსირდა მოულოდნელი შეცდომა.", 500)
        }

        const orders = await request.json()

        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    get_inventory,
    make_order
}