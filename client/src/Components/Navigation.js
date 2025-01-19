import { useEffect, useState } from "react";
import {LandingCarousel} from "./LandingCarousel"
import {ChildCats} from "./ChildCats"
import {MainSearchNav} from "./MainSearchNav"

export const Navigation = () => {
  const [catChild, setCatChild] = useState([])
  const [carousel, setCarousel] = useState([])

    useEffect(() => {
      const link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.type = 'text/css';
      link1.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css';

      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.type = 'text/css';
      link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css';

      document.head.appendChild(link1);
      document.head.appendChild(link2);
    const get_carousel_products = async () => {
        try {
          const request = await fetch("https://m.cjdropshipping.com/cj/banner/getWebHomeBannerInfo", {
            method: "POST",
            credentials: "omit",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                setValue: "",
                platformType: "1"
            })
        })

        const data = await request.json()
      
        const validArr = data.result.reduce((accumulator, currentObject) => {
          if (currentObject.urlOrSku.includes("boards.html?id")) {
            return [...accumulator, { ...currentObject }];
          }
          return accumulator;
      }, [])

        setCarousel(validArr)
        } catch (error) {
        console.log(error); 
        }
    } 

    get_carousel_products()
    }, [])


  return (
    <menu onMouseLeave={() => catChild.length > 0 && setCatChild([])} className="flex xxs:h-[200px] w-full xs:h-[220px] sm:h-[240px] lg:justify-center m-auto lg:h-full sm:mt-10">
      <div className="lg:block xxs:hidden xl:h-[480px]">
        <div className="bg-[rgb(251,77,1)] rounded-b-0 p-2 rounded-tl-lg h-[30px] text-white font-normal">
          <div className="flex items-center justify-between">
          <h1 className="text-xs">პროდუქტთა მენიუ</h1>
          <a className="text-slate-100 text-[9px]" href="/category">
             ყველა
          </a>
          </div>
        </div>
        <MainSearchNav setCatChild={setCatChild}></MainSearchNav>
      </div>
      <div className='w-full sm:rounded-lg lg:rounded-bl-none lg:h-[474px] lg:rounded-tl-none overflow-x-hidden overflow-y-hidden relative'>
        <LandingCarousel carousel={carousel}></LandingCarousel> 
        <ChildCats catChild={catChild}></ChildCats>
     </div>
    </menu>
  );
};