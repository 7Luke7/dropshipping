import Slider from "react-slick";
import LeftArrow from "../../public/arrow-left.svg" 
import RightArrow from "../../public/arrow-right.svg" 
import { Fragment, memo, useEffect, useRef, useState } from "react";
import {SingleCarouselItem} from "./SingleCarouselItem"

export const MediaCarousel = memo(({productImage, product}) => {
    const [curr, setCurr] = useState({})
    const [isMainLoading, setIsMainLoading] = useState(true)
    const slider = useRef(null);    

    useEffect(() => {
        if (productImage.length === 0) {
            return
        }

        if (product.isHaveVideo === "HAVE_VIDEO") {
            setCurr({
                imageURL: productImage[0].video,
                index: 0
            })
        } else {
            setCurr({
                imageURL: productImage[0],
                index: 0
            })
        }

    }, [product.isHaveVideo, productImage])

    const settings = {
        speed: 200,
        slidesToShow: 7,
        slidesToScroll: 1,
        arrows: false,
        swipe: true,
        lazyLoad: true,
    }
    
    return <Fragment>
        <div className="xxs:w-full lg:w-full h-full">
        {curr && curr.imageURL && curr.imageURL.includes(".mp4") ? <div className="relative outline-none w-full h-full">
            <video src={curr.imageURL} playsInline width={1280} height={720} preload="auto" alt="მთავარი ვიდეო" controls autoPlay muted className="w-full xxs:h-[400px] lg:h-[450px] aspect-[16/9] object-contain object-center">
            </video>
        </div> 
        : Object.keys(curr).length > 0 && <img 
            fetchpriority="high"
            alt="მთავარი ფოტო"
            src={isMainLoading ? `${curr.imageURL}?x-oss-process=image/resize,m_pad,w_120,h_100` : `${curr.imageURL}?x-oss-process=image/resize,m_pad,w_800,h_600`}
            onLoad={() => setIsMainLoading(false)}  
            className="w-full xxs:h-[400px] lg:h-[450px] object-contain">
        </img>}
        </div>
        <div className="relative xxs:min-h-[100px] border-b-0 border-l-0 border-r-0 border lg:min-h-[60px] w-full">
            <button onClick={() =>  slider.current.slickPrev()} className="absolute xxs:p-3 z-50 bg-[rgb(255,255,255,.9)] top-[1%] bottom-0 left-0 lg:p-1 sm:p-3">
                <img src={LeftArrow} width={14} height={14} alt="წინა" loading="lazy"></img>
                </button>
                <button className="absolute z-50 p-1 bg-[rgb(255,255,255,.9)] top-0 bottom-0 xxs:p-3 sm:p-3 lg:p-1 right-0" onClick={() => slider.current.slickNext()}>
                    <img src={RightArrow} width={14} height={14} alt="შემდეგი" loading="lazy"></img>
                </button>
                <Slider {...settings} ref={slider}>
                {productImage &&
                productImage.map((image, i) => (
                    <Fragment key={i}>
                    <SingleCarouselItem
                        image={image}
                        i={i}
                        setIsMainLoading={setIsMainLoading}
                        setCurr={setCurr}
                        curr={curr}
                    />
                    </Fragment>
                ))}
            </Slider>

        </div>
    </Fragment>
})

MediaCarousel.displayName = "MediaCarousel"