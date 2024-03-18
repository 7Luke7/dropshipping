import { Fragment } from "react"
import {Product} from "./Product"

export const ProductListings = ({products}) => {
    return <div className="grid lg:grid-cols-5 xl:grid-cols-5 mt-5 gap-y-7 sm:grid-cols-3 md:grid-cols-4 xs:grid-cols-2 xxs:place-items-center">
        {products.length === 0 ? [1,2,3,4,5,6,7,8,9,10].map((a, index) => {
            return <div key={index} className="animate-pulse xs:w-[150px] sm:w-[160px] md:w-[140px] mobl:w-[170px] xxs:w-[200px] lg:w-[140px] xl:w-[180px]">
            <Fragment>
            <div
            className="bg-gray-300 rounded-tr-lg rounded-tl-lg w-full xxs:h-[200px] xs:h-[180px]"
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
        }) : products.map((product, i) => {
            return <Fragment key={i}>
            <Product product={product}></Product>
            </Fragment>
        })}
    </div>
}