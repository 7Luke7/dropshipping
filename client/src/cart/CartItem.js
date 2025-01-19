import { useState } from "react"

export const CartItem = ({v, i, cartItemDelete}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [quantity, setQuantity] = useState(v.quantity)

    return <div key={i} className="lg:w-[300px] lg:h-[560px] xxs:w-[250px] sm:w-[250px] md:w-[250px] md:h-[550px] xs:w-[300px] flex flex-col m-auto">
    <a href={`/product/${v.PID}`}>
      <img
      loading="lazy"
      src={isLoading ? `${v.IMG}?x-oss-process=image/format,webp,image/resize,m_fill,w_25,h_25` : `${v.IMG}?x-oss-process=image/format,webp,image/resize,m_fill,w_179,h_190`}
      onLoad={(e) => setIsLoading(false)}
      className="object-cover border aspect-square lg:w-[300px] xs:w-[300px] md:h-[250px] md:w-[250px] xxs:w-[250px] xxs:h-[250px] lg:h-[300px]"
      alt={v.NAMEEN}
    ></img>
    </a>
      <article className="flex flex-col justify-start h-full" itemScope itemType="https://schema.org/Product">
      <a href={`/product/${v.PID}`}>
              <h1
              className="xxs:text-[11px] min-h-[58px] xs:text-[14px] md:text-[12px] md:w-full text-gray-800 font-bold"
              itemProp="name"
              >
                  {v.NAMEEN ? v.NAMEEN.slice(0, 100) + "..." : "სათაური არ აქვს."}
              </h1>
        </a>

        <div className="flex flex-col gap-3 justify-center">
          <p className="xs:mt-3">ამანათის სპეციფიკაცია</p>
          <div className="flex xxs:items-start xxs:flex-col xs:flex-row xs:flex xs:items-between flex-wrap justify-between w-full bg-gray-100 p-2">
              <div className="flex-col items-center justify-center">
                  <p
                  className="text-sm text-gray-800 font-normal"
                  itemProp="name"
                  >
                  წონა 
                  </p>
                  <p className="text-xs">{v.WEIGHT}გ</p>
              </div> 
              <div className="flex-col flex justify-center">
                  <p
                  className="text-sm text-gray-800 font-normal"
                  itemProp="name"
                  >
                      ზომა
                  </p> 
                  <p className="text-xs">{v.STANDARD}მმ</p>
              </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
              <span itemProp="price" className="text-[rgb(251,77,1)] font-bold text-base">ფასი: ${Number(v.SELLPRICE * quantity).toFixed(2)}</span>
              <div className="flex mt-2 items-center">
                  <button onClick={() => setQuantity(q => q - 1)} disabled={quantity === 1} className="border px-5 flex items-center justify-center border-gray-200 w-8 cursor-pointer outline-none">
                      <span className="font-thin">−</span>
                  </button>
                      <input onChange={(e) => setQuantity(e.target.value)} type="number" readOnly className="outline-none w-8 border text-center focus:outline-none text-gray-700 outline-none"
                      name="custom-input-number" value={quantity}></input>
                  <button onClick={() => setQuantity(q => q + 1)} className="border px-5 flex items-center justify-center border-gray-200 w-8 cursor-pointer outline-none">
                      <span className="font-thin">+</span>
                  </button>
              </div>
          </div>
              <button className="bg-red-500 justify-center rounded gap-3 w-full font-normal text-white flex items-center p-2 space-3" onClick={() => cartItemDelete(v.ID, i)}>წაშლა</button>
        </div>

      </article>
    </div>
}