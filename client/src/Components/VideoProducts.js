import { ProductListings } from "./ProductListings";
import { memo, useEffect, useState } from "react";
import { translate } from "./Translate";

export const VideoProducts = memo(() => {
  const [videoProducts, setVideoProducts] = useState([])
  useEffect(() => {
    const fetch_new_products = async () => {
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

        setVideoProducts(data.result)
      } catch (error) {
        console.log(error);
      }
    }
    fetch_new_products()
  }, [])
  return <div id="video_products" className="relative mt-14 w-[100%] m-auto">
  <div className="bg-[rgb(230,230,230,.2)] p-4 rounded-2xl">
  <div className="md:mx-5 lg:mx-2 xl:mx-5 flex justify-between items-center">
  <h1 className="xxs:text-md md:text-lg text-gray-900 font-bold">
   ვიდეო პროდუქცია
</h1>
<a href="/view-more/4" className="text-blue-500 underline text-xs">ნახე მეტი</a>
  </div>
    <ProductListings products={videoProducts}></ProductListings>
  </div>  
</div>
})

VideoProducts.displayName = 'VideoProducts';