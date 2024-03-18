import { Fragment, useEffect, useState } from "react";
import { translate } from "./Translate";
import { HotCategoriesList } from "./HotCategoriesList";
import HotCategoryIcon from "../public/category-svgrepo-com.svg"

const HotCategories = () => {
  const [hotCategories, setHotCategories] = useState([])
  useEffect(() => {
    const fetch_hot_categories = async () => {
      try {
        const request = await fetch("https://cjdropshipping.com/product-api/cj/homePage/getHotCategory", {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({size: 4}),
        })
        
        const data = await request.json()
  
        if (!request.ok) {
          throw Error(request.data);
        }
  
        const titles_to_translate = []
  
        for (let i = 0; i < data.data.length; i++) {
          titles_to_translate.push(data.data[i].categoryNameEn)
        }
  
        const translated_product = await translate(titles_to_translate)
        for (let i = 0; i < data.data.length; i++) {
          data.data[i]["categoryNameEn"] = translated_product[0][i]
        }
  
        setHotCategories(data.data)
      } catch (error) {
        console.log(error.status);
      }
    }

    fetch_hot_categories()
  }, [])
  return (
    <div className="relative xxs:mt-10 lg:mt-20 w-full m-auto">
      <div className="bg-[rgb(230,230,230,.2)] p-4 rounded-2xl xxs:h-full xl:h-[400px]">
      <div className="flex items-center gap-2">
        <h1 className="xxs:text-center sm:text-left sm:ml-7 text-gray-900 font-bold">
          გაყიდვადი კატეგორიები
        </h1>
        <img src={HotCategoryIcon} loading="lazy" alt="კატეგ"></img>
      </div>
      <div className="rounded-lg xl:grid xxs:grid place-items-center xxs:grid-cols-1 mobl:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 m-2">
      {!hotCategories.length ? [1,2,3,4].map((_, index) => {
        return <div key={index} className="animate-pulse mobl:w-full xs:w-[260px] xxs:w-[240px] sm:h-[350px] p-2">
        <Fragment>
        <div
        className="bg-gray-300 rounded-tr-lg rounded-tl-lg mobl:w-full xxs:w-[260px] xxs:h-[300px] md:w-[260px] md:h-[320px]"
      ></div>
        </Fragment>
          <div className="text-md mt-1 h-[20px] w-2/3 rounded bg-gray-600 font-bold">
          </div>
        </div>
      }): hotCategories.map((it, i) => {
        return (
          <Fragment key={i}>
            <HotCategoriesList it={it}></HotCategoriesList>
          </Fragment>
        );
      })}
      </div>
      </div>
    </div>
  );
}

export default HotCategories
HotCategories.displayName = 'HotCategories';