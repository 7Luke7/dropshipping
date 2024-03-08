export const translate = async (translatedata) => {
    try {
        const translate_product_request = await fetch("https://translate-pa.googleapis.com/v1/translateHtml", {
            method: "POST",
            headers: {
                "Content-Type": "application/json+protobuf",    
                "X-Goog-Api-Key": "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520",
            },
            body: JSON.stringify([[translatedata,"en","ka"],"te"])
        })

        if (!translate_product_request.ok) {
            throw Error("გადათარგმნა ვერ მოხერხდა")
        }

        const product_translated = await translate_product_request.json()

        return product_translated
    } catch (error) {
        console.log(error)
    }
}