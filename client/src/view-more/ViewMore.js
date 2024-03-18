import { Fragment, useEffect, useState } from "react"
import { Header } from "../Components/Header"
import { Footer } from "../Components/Footer"
import { MoreProducts } from "./Components/MoreProducts"
import { translate } from "../Components/Translate"
import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"

const Page = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])

    const params_id = useParams()
    const id = Number(params_id.id)

    useEffect(() => {
      const get_activities = async () => {
        try {
            const head_url = {url: "", body: null}

            if (id === 1) {
                head_url.url += "https://cjdropshipping.com/elastic-api/cj/homePage/v2/selectNewProductList"
                head_url.body = JSON.stringify({timeFlag: "month", "pageSize": 50})
            } 
            if (id === 2) {
                head_url.url += "https://cjdropshipping.com/elastic-api/cj/homePage/v2/selectNewProductList"
                head_url.body = JSON.stringify({"pageSize": 50, timeFlag: "Dropshipping"})
            }
            if (id === 4) {
                head_url.url += "https://cjdropshipping.com/elastic-api/cj/homePage/v2/selectNewProductList"
                head_url.body = JSON.stringify({"timeFlag": "video", "pageSize": 50})
            }
            console.log(head_url.url)
            const request = await fetch(head_url.url, {
                method: "POST",
                credentials: "omit",
                headers: {
                    "Content-Type": "application/json"
                },
                body: head_url.body
            })

            if (!request.ok) {
                throw Error(`Fetching error ${request.status}`)
            }

            const data = await request.json()

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
        setIsLoading(false)
    }
    
    get_activities()
    }, [id])

    const title = id === 1 ? "ახალი პროდუქცია" : id === 2 ? "ტრენდული პროდუქცია" : "ვიდეო პროდუქცია"

    return <Fragment>
      <Helmet>
        <meta
          name="description"
          content={`გთავაზობთ 50 ${title}ს - Slash.ge`}
        />
        <meta
          name="keywords"
          content={`Slash, Slash.ge, ${title}, ტიკტოკ პროდუქცია`}
        />
        <link rel="canonical" href={window.location.href} />
        <title>მოძებნე {title} - Slash</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`მოძებნე - ${title} - Slash.ge`}/>
        <meta
          property="og:description"
          content={`გთავაზობთ 50 ${title}ს - Slash.ge`}
        />
        {/*<meta
          property="og:image"
          content={}
  /> უნდა იყოს ლოგო წესით */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content={window.location.href} />
    </Helmet>
    <div id="closeScroll" className="bg-[rgb(251,77,1)]">
        <Header></Header>
        {
          isLoading ? <div className="m-auto w-[80%]">  

          <div className="bg-white rounded-lg pb-20 relative mt-20 w-full">
          <div className="absolute left-1/2 xxs:w-full sm:w-1/2 flex items-center justify-center rounded-lg -translate-x-1/2 -translate-y-[80%] right-1/2 z-10 h-[50px] bg-white">
            <div className="w-1/2 h-6 bg-[rgb(251,77,1)] rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap w-[95%] gap-5 m-auto xxs:pt-5 sm:pt-14 sm:justify-evenly xxs:justify-center">
            {Array.from({length: 18}).map((_, index) => {
                return <div key={index} className="animate-pulse xxs:w-[200px] lg:w-[200px] xs:w-[180px] mobl:w-[200px] xl:w-[180px]">
                <div className="relative">
                  <div className="bg-gray-300 rounded-t w-full xxs:h-[220px] sm:h-[180px]"></div>
                </div>
                <Fragment>
                  <Fragment>
                    <div className="h-[22px] mt-1 mb-3 rounded bg-[rgb(251,77,1)] w-1/2"></div>
                    <div className="h-[30px] mt-4 mb-2 bg-gray-400 rounded w-full"></div>
                  </Fragment>
                </Fragment>
              </div>
            })}
        </div>
      </div>
      </div>
        : products.length === 0 ? <div>ცარიელია</div> : <div className="m-auto w-[80%]">  

        <div className="bg-white rounded-lg pb-20 relative mt-20 w-full">
          <div className="absolute left-1/2 xxs:w-full sm:w-[50%] flex items-center justify-center rounded-tr-lg rounded-tl-lg -translate-x-1/2 -translate-y-[80%] right-1/2 z-10 h-[50px] bg-white">
              <h1 className="xxs:text-lg text-[rgb(251,77,1)] font-semibold md:text-2xl">{title}</h1>
          </div>
        <div className="flex flex-wrap w-[95%] gap-5 m-auto xxs:pt-5 sm:pt-14 sm:justify-evenly xxs:justify-center">
          <MoreProducts products={products}></MoreProducts>
      </div>
    </div>
    </div>}
    <div className="mt-20">
    <Footer></Footer>
    </div>

    </div>
    </Fragment>
}

export default Page