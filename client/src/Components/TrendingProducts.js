"use client";
import { memo, useEffect, useState } from "react";
import { ProductListings } from "./ProductListings";
import { translate } from "./Translate";
import Fire from "../public/fire-flame-curved.svg"

export const TrendingProducts = memo(() => {
  const [trendingProducts, setTrendingProducts] = useState([]) 

  useEffect(() => {
    const fetch_trending_products = async () => {
      try {
        const request = await fetch("https://cjdropshipping.com/elastic-api/cj/homePage/v2/selectNewProductList", {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "pageSize": 10,
                timeFlag: "Dropshipping"
            }),
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

        setTrendingProducts(data.result)
      } catch (error) {
        console.log(error);
      }
    }
    
    fetch_trending_products()
  }, [])

  return <div className="relative mt-14 w-full m-auto">
    <div className="bg-[rgb(230,230,230,.2)] p-4 rounded-2xl">
    <div className="md:mx-5 lg:mx-2 xl:mx-5 flex justify-between items-center">
    <div className="flex gap-2 items-center">
      <h1 className="xxs:text-md md:text-lg text-gray-900 font-bold">
        ტრენდული პროდუქცია
      </h1>
      <img loading="lazy" src={Fire} alt="ტრენდ"></img>
    </div>
  <a href="/view-more/2" className="text-blue-500 underline text-xs">ნახე მეტი</a>
    </div>
      <ProductListings products={trendingProducts}></ProductListings>
    </div>  
</div>
})

TrendingProducts.displayName = 'TrendingProducts';