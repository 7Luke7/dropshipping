import { Fragment, useMemo, useEffect, useState, memo } from "react"
import { translate } from "../../Components/Translate"
import { RecomProducts } from "./RecomProducts"

const RecommendedProducts = memo(({id}) => {
    const [recommendedProducts, setRecommendedProducts] = useState()

    useEffect(() => {
        const get_recommended_products = async () => {
            try {
              const request = await fetch("https://m.cjdropshipping.com/elastic-api/recommend/search/productDetail/queryPage", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  credentials: "omit",
                  body: JSON.stringify(
                      {
                        page: 1, 
                        size: "12",
                        versionNum: null,
                        productId: id
                      },
                  )
                })
              
                if (!request.ok) {
                  console.log(request.status);
                }

                const data = await request.json()
                const titles_to_translate = []

                for (let i = 0; i < data.data.content.length; i++) {
                  titles_to_translate.push(data.data.content[i].nameEn)
                }

                const translated_product = await translate(titles_to_translate)

                for (let i = 0; i < data.data.content.length; i++) {
                  data.data.content[i]["nameEn"] = translated_product[0][i]
                }

                setRecommendedProducts(data.data.content)
            } catch (error) {
                console.log(error);
            }
            
        }   
        get_recommended_products()
    }, [id])

    const render = useMemo(() => {
      if (!recommendedProducts) { 
        return <section className="mt-10">
        <div className="flex xxs:justify-center lg:justify-start">
            <div className="w-[200px] h-[25px] rounded bg-gray-200 animate-pulse"></div>          
        </div>
            <div className="lg:grid-cols-4 xl:grid-cols-5 w-full gap-2 place-items-center xxs:grid mt-5 md:grid-cols-3 mobl:grid-cols-2">
                {Array.from({length: 12 }).map((_, index) => {
                    return <div key={index} className="animate-pulse xxs:w-[200px] lg:w-[200px] mobl:w-[170px] xs:w-[230px] xl:w-[200px]">
                    <Fragment>
                    <div
                    className="bg-gray-300 w-full h-[200px]"
                ></div>
                    </Fragment>
                    <Fragment>
                    <Fragment>
                    <div className="h-[22px] mt-1 mb-3 rounded w-1/2 bg-[rgb(251,77,1)]"></div>
                    <div
                        className="h-[30px] mt-4 mb-2 w-full bg-gray-400 rounded"
                    >
                    </div>
                    </Fragment>
                    </Fragment>
                </div>
                })}      
            </div>
        </section>
      } else {
        return <section className="mt-10">
    <p className="text-lg xxs:text-center lg:text-start">რეკომენდირებული პროდუქტები</p>
    <div className="lg:justify-between xxs:justify-evenly gap-y-4 flex-grow flex flex-wrap mt-5">
      {recommendedProducts && recommendedProducts.map((product, i) => {
          return <Fragment key={i}><RecomProducts product={product} i={i}></RecomProducts></Fragment>
        })}
    </div>
    </section>
      }
    }, [recommendedProducts])

    return render
})

export default RecommendedProducts
RecommendedProducts.displayName = "RecommendedProducts"