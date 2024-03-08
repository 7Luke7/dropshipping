export const Variants = ({v, i, pv, index, changeVarientArr, setVarientList, warning}) => {
    
    return <>
        {pv.name === "ფერი" ? <button key={i} disabled={v.disable} onClick={() => changeVarientArr(v, i, pv, setVarientList, index)} className={`border rounded ${v.disable ? "opacity-[0.5]" : "lg:hover:border-[rgb(251,77,1)]"} rounded"} ${warning === "image" ? "animate-pulse" : "animate-none"}`}>
            <img alt="ვარიანტი"
              disabled={v.disable}
              className="h-[50px] w-[50px] object-cover rounded"
              loading="lazy"
              src={`${v.img}?x-oss-process=image/resize,m_fill,w_80,h_80`}>
            </img>
            </button> : <button key={i} disabled={v.disable} onClick={() => changeVarientArr(v, i, pv, setVarientList, index)} className={`border ${v.disable ? "opacity-[0.5]" : "lg:hover:border-[rgb(251,77,1)]"} rounded"} px-2 py-1 rounded`}>
        <p className="font-semibold text-gray-800 text-[13px]">{v.name}</p>
    </button>}
    </>
}