import { Fragment, memo, useEffect, useState } from "react";
import { translate } from "./Translate";

export const HotCategories = memo(({fourthLoad}) => {
  const [isLoading, setIsLoading] = useState(true)
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
      <h1 className="xxs:text-center sm:text-left sm:ml-7 text-gray-900 font-bold">
      გაყიდვადი კატეგორიები
    </h1>
      <div className="lg:hidden rounded-lg xl:grid xxs:grid place-items-center xxs:grid-cols-1 mobl:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 m-2">
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
          <div key={i} className="transition-transform duration-100 ease-out transform md:hover:scale-[1.02] md:hover:rounded-tr-lg md:hover:rounded-tl-lg md:hover:border-gray-300 md:hover:border mobl:w-full xs:w-[260px] xxs:w-[240px] sm:h-[350px] p-2">
            <a href={`search?category=${it.categoryId}&page=1`}>
                <img
                fetchpriority="high"
                className="object-cover rounded-tr-lg rounded-tl-lg mobl:w-full xxs:w-[260px] xxs:h-[300px] md:w-[260px] md:h-[320px]"
                src={`${it.bigImage}?x-oss-process=image/format,webp,image/resize,m_fill,w_30`}
                onLoad={(e) => e.currentTarget.src = `${it.bigImage}?x-oss-process=image/format,webp,image/resize,m_fill,w_280`}
                alt={`კატეგორია: ${it.categoryNameEn}`}
            ></img>
            <article itemScope itemType="https://schema.org/Product">
                <h2 
                className="text-md min-h-[60px] text-gray-600 font-bold"
                itemProp="name"
                >
                {it.categoryNameEn}
                </h2>
            </article>
            </a>
          </div>
        );
      })}
      </div>
      <div className="lg:grid xxs:hidden xl:hidden place-items-center grid-cols-3 m-2">
      {hotCategories.map((it, i) => {
        return (
          <div key={i} className="transition-transform duration-100 ease-out transform hover:scale-[1.02] hover:border-gray-300 hover:border h-[350px] p-2">
            <a href={`category/${it.categoryId}`}>
                <img
                fetchpriority="high"
                className="w-[260px] object-cover h-[320px]"
                src={isLoading ? `${it.bigImage}?x-oss-process=image/format,webp,image/resize,m_fill,w_30` : `${it.bigImage}?x-oss-process=image/format,webp,image/resize,m_fill,w_144`}
                onLoad={(e) => setIsLoading(false)}
                alt={`კატეგორია: ${it.categoryNameEn}`}
            ></img>
            <article itemScope itemType="https://schema.org/Product">
                <h2 
                className="text-gray-600 font-bold"
                itemProp="name"
                >
                {it.categoryNameEn}
                </h2>
            </article>
            </a>
          </div>
        );
      })}
      </div>
      </div>
    </div>
  );
})

HotCategories.displayName = 'HotCategories';