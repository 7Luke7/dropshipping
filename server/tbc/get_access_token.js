require("dotenv").config()

// try to use web_workers as auth0 recommends
// check if we are always creating new access tokens

class TBC_SKELETON {
    constructor() {
        get_access_token()
    }

    async get_access_token() {
        try {
            const options = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  apikey: process.env.TBC_API_KEY,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'client_Id': process.env.TBC_APP_ID,
                    'client_secret': process.env.TBC_SECRET
                })
              }
            
              
            const request_token = await fetch('https://api.tbcbank.ge/v1/tpay/access-token', options)

            if (!request_token.ok) {
                throw new Error("ვერ მოხერხდა ტოკენზე წვდომა.")
            }
            
            const data = await request_token.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    
    async exchange_currencies() {
        try {
            const options = {
                method: 'GET',
                headers: {Accept: 'application/json', apikey: process.env.TBC_API_KEY}
              };
              
              const request_currencies = await fetch('https://api.tbcbank.ge/v1/exchange-rates/commercial/convert?amount=100&from=usd&to=eur', options)
                
              if (!request_currencies.ok) {
                throw new Error("ვერ მოხერხდა კურსის გადაცვლა.")
              }

              const data = await request_currencies.json()

              return data
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = TBC_SKELETON