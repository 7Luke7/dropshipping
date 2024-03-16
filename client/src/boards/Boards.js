import { Fragment, useEffect, useState } from "react"
import { Header } from "../Components/Header"
import arrowLeft from "../public/arrow-left.svg"
import arrowRight from "../public/arrow-right.svg"
import { useParams } from "react-router-dom"
import {BoardProducts} from "./Components/BoardProducts"
import { translate } from "../Components/Translate"
import {Helmet} from "react-helmet-async"

const Page = () => {
    const [board, setBoard] = useState({})
    const [activities, setActivities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [chosen, setChosen] = useState(0)

    const params = useParams()

    useEffect(() => {
        const get_board = async () => {
            try {
                const request = await fetch("https://www.cjdropshipping.com/cj/activity/getActivityByIdV2", {
                    method: "POST",
                    credentials: "omit",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "id": params.id
                    }),
                    cache: "force-cache"
                })
                
                if (!request.ok) {
                    throw new Error("დაფიქსირდა შეცდომა")
                }
                
                const data = await request.json()
                const colors = JSON.parse(data.result.v3)
                
                const board_names_to_translate = []

                for (let i = 0; i < data.result.threeNames.length; i++) {
                    board_names_to_translate.push(data.result.threeNames[i].name)   
                }

                const translated_board_names = await translate([data.result.category, ...board_names_to_translate])

                for (let i = 0; i < data.result.threeNames.length; i++) {
                    let j = i + 1
                    data.result.threeNames[i].name = translated_board_names[0][j]
                }

                setBoard({...data.result, ...colors, title: translated_board_names[0][0]})
                get_activities_by_id({name: data.result.threeNames[0].name, id: params.id})
            } catch (error) {
                console.log(error);
            }
        }

        get_board()
    }, [])

    const get_activities_by_id = async ({id, index}) => {
        setIsLoading(true)
        setChosen(index)

        const request = await fetch("https://www.cjdropshipping.com/product-api/cj/activity/getProductList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            cache: "force-cache",
            body: JSON.stringify({"activityId": id}),
        })

        if (!request.ok) {
            throw new Error("დაფიქსირდა შეცდომა")
        }

        const data = await request.json()

        const titles_to_translate = []

        for (let i = 0; i < data.data.length; i++) {
            titles_to_translate.push(data.data[i].nameEn)
        }

        const translated_product = await translate(titles_to_translate)
        for (let i = 0; i < data.data.length; i++) {
            data.data[i]["nameEn"] = translated_product[0][i]
        }     

        setActivities(data.data)
        setIsLoading(false)
    }

      const prevBoard = () => {
        if (chosen === undefined) {
            get_activities_by_id({id: board.threeNames[board.threeNames.length - 1].id, index: board.threeNames.length - 1})
        } else {
            if (chosen === 0){
                return get_activities_by_id({id: board.threeNames[board.threeNames.length - 1].id, index: board.threeNames.length - 1})
            }
            get_activities_by_id({id: board.threeNames[chosen - 1].id, index: chosen - 1})
        }
      }
      const nextBoard = () => {
        if (chosen === undefined) {
            get_activities_by_id({id: board.threeNames[1].id, index: 1})
        } else {
            if (chosen === board.threeNames.length - 1){
                return get_activities_by_id({id: board.threeNames[0].id, index: 0})
            }
            get_activities_by_id({id: board.threeNames[chosen + 1].id, index: chosen + 1})
        }
      }

    return <>
        <div id="head">
        <Header></Header>
        {Object.keys(board).length > 0 && <Fragment>
            <Helmet>
        <meta
          name="description"
          content="უფასო მიწოდება უამრავ ნივთზე. მიიღეთ საუკეთესო შოპინგის გამოცდილება. ისარგებლეთ დაბალი ფასებით და დიდი შეთავაზებებით ყოველდღიური საჭირო ნივთების და სხვა პროდუქტების უდიდეს არჩევანზე, მათ შორის მოდაზე, სახლზე, სილამაზეზე, ელექტრონიკაზე, სპორტული, სათამაშოები, შინაური ცხოველები, ბავშვები, წიგნები, ვიდეო თამაშები, საოფისე მასალები და მეტი. - Slash.ge"
        />
        <meta
          name="keywords"
          content="Slash, Slash.ge, ჩინეთიდან, ამერიკიდან, გერმანიიდან, ინგლისიდან, ონლაინ შოპინგი, ონლაინ მაღაზია, დაბალი ფასი, წიგნები, წიგნის მაღაზია, ჟურნალი, გამოწერა, მუსიკა, CD, DVD, ვიდეო, ელექტრონიკა, ვიდეო თამაშები, კომპიუტერები, მობილური ტელეფონები, სათამაშოები, თამაშები, ტანსაცმელი, აქსესუარები, ფეხსაცმელი, სამკაულები, საათები, საოფისე პროდუქტები, სპორტი და ღია ცის ქვეშ, სპორტული საქონელი, ბავშვის პროდუქტები, ჯანმრთელობა, პირადი მოვლა, სილამაზე, სახლი, ბაღი, საწოლი და აბაზანა, ავეჯი, ხელსაწყოები, აპარატურა, მტვერსასრუტები, გარე საცხოვრებელი, ავტომობილების ნაწილები, შინაური ცხოველების მარაგი"
        />
        <link rel="canonical" href={window.location.href} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="პროდუქცია უცხოეთიდან - Slash.ge" />
        <meta
          property="og:description"
          content="ჩვენ გთავაზობთ შეიძინოთ უცხოეთში დამზადებული ნივთები დაბალ ფასად - Slash.ge"
        />
        {/*<meta
          property="og:image"
          content={}
  /> უნდა იყოს ლოგო წესით */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content={window.location.href} />
        <title>{board.title} - Slash</title>
    </Helmet>
    <div id="closeScroll" style={{ backgroundColor: board.backColor }} className="h-full min-h-screen w-full">
            <img src={board.activityImgUrl} loading="lazy" className="w-full xxs:h-[80px] xs:h-[120px] md:h-[260px] md:object-contain sm:h-[180px] mobl:h-[140px] object-cover object-top lg:h-[200px] xl:h-[450px]" alt="ბანერი"></img>
            <div id="start" className="sm:w-[80%] xxs:w-full m-auto">
                <ul style={{backgroundColor: board.allThreeBackColor}} id="activityBar" className="h-[70px] xxs:hidden right-0 gap-2 sm:sticky z-50 top-0 lg:-translate-y-[3%] lg:w-full sm:flex items-center justify-around">
                    {board.threeNames && board.threeNames.map((name, i) => {
                        return <button key={i} style={{color: board.allThreeFontColor}} onClick={() => get_activities_by_id({id: name.id, index: i})} className="relative outline-none h-full flex items-center">
                            <a href={"#start"}>
                                <p className="text-base">{name.name}</p>
                                <span className={`${chosen === i && "absolute bottom-0 translate-y-[1px] left-0 right-0 h-2 bg-white"}`}></span>
                            </a>
                        </button>
                    })}
                </ul>
                <div className="fixed justify-between w-full px-3 z-[50] bottom-[1%] sm:hidden xxs:flex">
                    <a href="#start" style={{backgroundColor: board.oneThreeBackColor}} onClick={prevBoard} className="shadow-xl bg-[rgb(255,255,255,.9)] top-1/2 left-[2%] p-1 rounded-[50%]">
                        <img src={arrowLeft} alt="წინა" className="w-[40px] h-[40px]" loading="lazy"></img>
                    </a>
                    <a href="#start" style={{backgroundColor: board.oneThreeBackColor}} onClick={nextBoard} className="shadow-xl bg-[rgb(255,255,255,.9)] top-1/2 left-[2%] p-1 rounded-[50%]">
                        <img src={arrowRight} alt="შემდეგი" className="w-[40px] h-[40px]" loading="lazy"></img>
                    </a>
                </div>
                
                             <div className="bg-white pb-20 mt-20 w-full">
                                    <div className="lg:absolute xxs:sticky left-1/2 lg:min-w-[40%] xxs:border-2 xxs:border-t-0 xxs:border-r-0 xxs:border-l-0 lg:border-0 w-full lg:w-[60%] flex items-center justify-center lg:rounded-lg top-0 xxs:rounded-none lg:-translate-x-1/2 right-1/2 z-10 p-2" style={{backgroundColor: board.oneThreeBackColor}}>
                                    <h1 style={{color: board.oneThreeFontColor}} className="font-bold md:text-2xl xxs:text-md">{board.threeNames[chosen || 0].name}</h1>
                                </div>
                                <div className="flex flex-wrap w-[95%] gap-1 m-auto xxs:pt-2 sm:pt-14 sm:justify-evenly xxs:justify-center">
                                    {isLoading ? Array.from({length: 36}).map((_, index) => {
                                        return <div key={index} className="animate-pulse xxs:w-[200px] lg:w-[200px] mt-4 xs:w-[230px] mobl:w-[230px] xl:w-[180px]">
                                        <div className="relative">
                                          <div className="bg-gray-300 w-full xxs:h-[215px] xs:h-[245px] lg:h-[195px]"></div>
                                        </div>
                                        <Fragment>
                                          <div>
                                            <div className="h-[22px] mt-1 mb-3 rounded bg-[rgb(251,77,1)] w-1/2"></div>
                                            <div className="h-[30px] mt-4 mb-2 bg-gray-400 rounded w-full"></div>
                                          </div>
                                        </Fragment>
                                      </div>
                                }) : !isLoading && <BoardProducts activities={activities}></BoardProducts>
                                }
                                </div>
                          </div>      
                </div>
            </div>
            </Fragment>
        }
    </div>    
    </> 
}

export default Page