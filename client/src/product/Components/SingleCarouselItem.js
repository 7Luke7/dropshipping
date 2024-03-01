import { memo } from "react";
import smallVideoPlayIcon from "../../public/smallVideoPlayIcon.svg" 

export const SingleCarouselItem = memo(({image, i, setIsMainLoading, setCurr, curr}) => {
    return <div onClick={() => {
        setCurr(() => {
            if (typeof image === "object" && image.video) {
                return { imageURL: image.video, index: i };
            } else {
                setIsMainLoading(true)
                return { imageURL: image, index: i };
            }
        });
    }} className="p-1 lg:h-[60px] xxs:h-[90px] relative w-full outline-none" >
        {image.video && <button className="w-7 h-7 rounded-full bg-[rgb(251,77,1)] z-50 opacity-50 flex justify-center items-center absolute top-1/2 bottom-1/2 left-1/2 right-1/2 -translate-y-1/2 -translate-x-1/2" onClick={() => setCurr({imageURL: image, index: i})} >
            <img src={smallVideoPlayIcon} width={5} height={5} className="h-[24px] w-[24px]" alt="ჩართვა"></img>
        </button>}
        <img
            loading="lazy"
            className={`${i === curr.index && "outline outline-1 outline-[rgb(251,77,1)]"} xxs:border rounded object-cover h-full w-full`}
            src={image.image ? image.image : `${image}?x-oss-process=image/resize,m_pad,w_80,h_80`}
            alt={image.video ? "ვიდეო" : "ფოტო"}
        />
    </div>
})