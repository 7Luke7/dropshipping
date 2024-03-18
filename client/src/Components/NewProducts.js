import { useEffect, useState } from "react";
import { ProductListings } from "./ProductListings";
import { translate } from "./Translate";
import NewIcon from "../public/new-item-shopping-label-svgrepo-com.svg"

const NewProducts = () => {
  const [newProducts, setNewProducts] = useState([])
  useEffect(() => {
    const fetch_new_products = async () => {
      try {
        const request = await fetch("https://cjdropshipping.com/elastic-api/cj/homePage/v2/selectNewProductList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pageSize: "10",
              timeFlag: "month"
            }),
            credentials: "omit",
    
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
    
        setNewProducts(data.result)
      } catch(error){
        console.log(error)
      }
    }
    fetch_new_products()
  }, [])
  return <div id="new_products" className="relative mt-14 w-[100%] m-auto">
    <div className="bg-[rgb(230,230,230,.2)] p-4 rounded-2xl">
      <div className="md:mx-5 lg:mx-2 xl:mx-5 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1 className="xxs:text-md md:text-lg text-gray-900 font-bold">
            ახალი პროდუქცია
          </h1>
          <img loading="lazy" className="xxs:hidden xs:block" src={NewIcon} alt="ახალი"></img>
      </div>
      <a href="/view-more/1" className="text-blue-500 underline text-xs">ნახე მეტი</a>
    </div>
      <ProductListings products={newProducts}></ProductListings>
    </div>  
</div>
}

export default NewProducts
NewProducts.displayName = 'NewProducts';