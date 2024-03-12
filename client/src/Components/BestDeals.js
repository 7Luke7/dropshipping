import { useEffect, useState } from "react";
import {ProductListings} from "./ProductListings.js"
import { translate } from "./Translate.js";

const BestDeals = () => {
  const [products, setProducts] = useState([])
  useEffect(() => {
    const fetch_best_deals = async () => {
      try {
        const request = await fetch("https://cjdropshipping.com/elastic-api/cj/homePage/getTop5UnsoldProduct", {
          method: "POST",
          credentials: "omit",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })
        
        const data = await request.json()

        if (!request.ok) {
          throw new Error(request.data);
        }
        const titles_to_translate = []

        for (let i = 0; i < data.result.length; i++) {
          titles_to_translate.push(data.result[i].nameEn)
        }

        const translated_product = await translate(titles_to_translate)
        for (let i = 0; i < data.result.length; i++) {
          data.result[i]["nameEn"] = translated_product[0][i]
        }

        setProducts(data.result)
      } catch (error) {
        console.log(error);
      }
    }
    fetch_best_deals()
  }, [])

  return <div id="best_deals" className="relative mt-14 w-[100%] m-auto">
  <div className="bg-[rgb(230,230,230,.2)] p-4 rounded-2xl">
  <div className="md:mx-5 lg:mx-2 xl:mx-5">
  <h1 className="xxs:text-md md:text-lg text-gray-900 font-bold">
   საუკეთესო შეთავაზებები
</h1>
  </div>
    <ProductListings products={products}></ProductListings>
  </div>  
</div>
}

export default BestDeals
BestDeals.displayName = 'BestDeals';