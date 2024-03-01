import { useState } from "react"

export const Variants = ({v, i, pv, changeVarientArr, warning}) => {
    const [isLoading, setIsLoading] = useState(false)
    return <>
        {pv.name === "ფერი" ? <button key={i} disabled={v.disable} onClick={() => changeVarientArr(v, i)} className={`border rounded ${v.disable ? "opacity-[0.5]" : "lg:hover:border-[rgb(251,77,1)]"} rounded"} ${warning === "image" ? "animate-pulse" : "animate-none"}`}>
            <img alt="ვარიანტი"
             disabled={v.disable}
              className="h-[50px] w-[50px] object-cover rounded"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              src={isLoading ? `${v.img}?x-oss-process=image/resize,m_fill,w_10,h_10` : `${v.img}?x-oss-process=image/resize,m_fill,w_80,h_80`}>
            </img>
            </button> : <button key={i} disabled={v.disable} onClick={() => changeVarientArr(v, i)} className={`border ${v.disable ? "opacity-[0.5]" : "lg:hover:border-[rgb(251,77,1)]"} rounded"} px-2 py-1 rounded`}>
        <p className="font-semibold text-gray-800 text-[13px]">{v.name}</p>
    </button>}
    </>
}