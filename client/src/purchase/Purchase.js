import { Fragment, useEffect, useState } from "react"
import cities from "../dashboard/cities.json"
import { Header } from '../Components/Header'
import { Footer } from '../Components/Footer'
import "./purchase.css"  
import geoflag from "../public/geoflag.svg"
import check from "../public/check.svg"
import card from "../public/card.svg"  
import identify from "../public/identify.svg"
import mobile from "../public/mobile.svg"
import outChevron from "../public/out-chevron.svg"
import Logo from "../public/slashy_logo.webp"
import { BringService } from "./BringService"
import { BringServiceLoading } from "./BringServiceLoading"
import sadIcon from "../public/sad-icon.svg"
import { Helmet } from "react-helmet-async"
import { translate } from "../Components/Translate"

const Purchase = () => {
    const [variant, setVariant] = useState({})
    const [cityStates, setCityStates] = useState(cities)
    const [city, setCity] = useState("")
    const [inventory, setInventory] = useState({})
    const [message, setMessage] = useState("")
    const [state, setState] = useState("")
    const [user, setUser] = useState({})
    const [street, setStreet] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [selectedLogistic, setSelectedLogistic] = useState({})
    const [cardOwner, setCardOwner] = useState("")
    const [cardNumber, setCardNumber] = useState("")

    const phoneRegex = /^\d{9}$/;
    useEffect(() => {
      const check_user_auth = async () => {
          try {
              const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/profile`, {
                method: "GET",
                credentials: "include",
              }) 
      
              const data = await request.json()
              if (!request.ok) {
                throw new Error(request.status)
              }
              
              setMessage("გაქვს უფლება")
                setUser(data)
                if (!data.addresses.length) {
                  return 
                } else {
                  setCity(data.addresses[0].city)
                  setState(data.addresses[0].state)
                  setStreet(data.addresses[0].street)
                }
              setPhoneNumber(data.phone)
          } catch (error) {
              if (error.message === "401") {
                return setMessage("მომხმარებელს არ აქვს წვდომის უფლება")
              } else {
                return setMessage("დაფიქსირდა მოულოდნელი შეცდომა, სცადეთ თავიდან.")
              }
          }
      }

      check_user_auth()
    }, [])

    useEffect(() => {
      if (Object.keys(variant).length !== 0) {
        get_area_inventory_info()
      }
    }, [variant])
    
    useEffect(() => {
      window.scrollTo(0, 0) 
      const purchase_targets = JSON.parse(sessionStorage.getItem("purchases"))

      if (!purchase_targets) {
        return setMessage("ნივთის შეძენის სესია ამოიწურა.")
      } 
      
      const get_all_variants = async () => {
        try {
          const request_all_variants = await fetch("https://m.cjdropshipping.com/elastic-api/cjProductInfo/v2/getProductDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            body: JSON.stringify({
                id: purchase_targets.pid
            })
          })

          const data = await request_all_variants.json()

          const target_variant = data.data.stanProducts.find((a) => a.ID === purchase_targets.vid)

          const translated_data = await translate([target_variant.NAMEEN || request_all_variants.NAMEEN, target_variant.STANDARD, target_variant.VARIANTKEY])

          target_variant.NAMEEN = translated_data[0][0]
          target_variant.STANDARD = translated_data[0][1] 
          target_variant.VARIANTKEY = translated_data[0][2]
          target_variant.quantity = purchase_targets.quantity

          setVariant(target_variant)
        } catch (error) {
          setMessage(error.message)
        }
      }

      if (message === "გაქვს უფლება") {        
        get_all_variants()
      }

    }, [message])

    const processPurchase = (e) => {
        e.preventDefault()
        if (!phoneRegex.test(phoneNumber)) {
          return setMessage("ტელეფონის ნომერი არასწორია")
        }
    }

    const get_area_inventory_info = async () => {
      try {
        const request_area_info = await fetch("https://cjdropshipping.com/elastic-api/product/inventory/getAreaInventoryInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: variant.PID 
        })
      })

      if (!request_area_info.ok) {
        throw new Error("ვერ განხორციერლდა პროდუქტის ადგილმდებარეობის მოთხოვნა, სცადეთ თავიდან.")
      }

      const area_info = await request_area_info.json()

      get_logistic(area_info)   
      } catch (error) {
        setMessage(error.message)
      }
  }

  const get_logistic = async (areas) => {
      try {
        const get_inventory = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_inventory`, {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            areas,
            purchase: variant
          }),   
          headers: {
            "Content-Type": "application/json"
          }
        })

        if (!get_inventory.ok) {
          throw new Error("წარმოშვა შეცდომა გთხოვთ გაანახლეთ გვერდი.")
        }

        const data = await get_inventory.json()
        
        setInventory(data)
        setSelectedLogistic(data.freight_data && data.freight_data[0])
      } catch (error) {
        setMessage(error.message)
      }
  }

    const changeAddress = (address_id) => {
      const selectedAddress = user.addresses.filter((address) => address._id === address_id)
      
      setCity(selectedAddress[0].city)
      setState(selectedAddress[0].state)
      setStreet(selectedAddress[0].street)
    }

    const changeLogistic = (f) => {
      setSelectedLogistic("")
      setSelectedLogistic(f)
    }

    const redirectTbcCheckout = () => {
      
    }

    const variant_sell_price = variant.quantity * variant.SELLPRICE

    return <Fragment>
        <Helmet>
          <title>Slashy - შეძენა</title>
        </Helmet>     
    {message === "" ?  <div className='flex space-x-2 justify-center items-center bg-white h-screen'>
         <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
       <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
       <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce'></div>
   </div> : message === "მომხმარებელს არ აქვს წვდომის უფლება" ? <div className="h-screen">
    <Header></Header> 
            <div className="flex flex-col items-center justify-center h-[75%]">
            <p>არ გაქვს ნივთის შეძენის უფლება</p>
            <div className="flex items-center gap-3 mt-3">
                <a href="/register" className="bg-[rgb(237,123,82)] justify-center rounded gap-3 font-normal text-white flex items-center text-[13px] p-[9px] space-3">გაიარე რეგისტრაცია</a>
                    <span>ან</span>
                <a href="/login" className="bg-[rgb(251,77,1)] justify-center rounded gap-3 font-normal text-white flex items-center text-[13px] p-[9px] space-3">შედი აქაუნთში</a>
            </div>
        </div>
        <Footer />
        </div> : message === "გაქვს უფლება" ? <Fragment>
        <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
            <a href="/">
            <img loading="lazy" className="xxs:w-[80px] lg:w-[90px] object-cover xxs:h-[50px] lg:h-[40px]" src={Logo} alt="ლოგო"></img>
        </a>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,128,64,0.5)] text-xs font-semibold text-[rgb(255,128,64)]" href="#">
                  <img loading="lazy" src={check} alt="გავლილი ეტაპი"></img>
                </a>
                <span className="font-semibold text-gray-900">შერჩევა</span>
              </li>
              <img loading="lazy" src={outChevron} alt="შემდეგი ეტაპი მიმთითებელი"></img>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(255,128,64)] text-xs font-semibold text-white animate-pulse" href="#"></a>
                <span className="font-semibold text-gray-900">ყიდვა</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <form onSubmit={processPurchase} className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 flex flex-col pt-8">
          <Fragment>
            <p className="text-xl font-medium">შეკვეთის მონახაზი</p>
            <p className='text-gray-400'>შეძენამდე წაიკითხეთ მონახაზი</p>
            {Object.keys(variant).length !== 0 && <div className="mt-3 relative rounded-lg border overflow-hidden bg-red-100">
            <span className="absolute top-0 right-0 bg-[rgb(243,104,29)] px-2 py-0.5 text-lg opacity-90 text-center text-white">{variant.quantity}ც</span>
            <div className="flex flex-col rounded-lg h-full bg-white sm:flex-row">
            <img loading="lazy" className="rounded-md sm:h-full border sm:w-[144px] object-cover object-center" src={window.innerWidth >= 425 ? `${variant.IMG}?x-oss-process=image/format,webp,image/resize,m_fill,w_360,h_240` : `${variant.IMG}?x-oss-process=image/format,webp,image/resize,m_fill,w_240,h_144`} alt="ფოტო" />
            <div className="flex pt-2 w-full flex-col px-4">
                <h1 className="font-bold">{variant.NAMEEN.slice(0, 100) || "სათაურის გარეშე"}...</h1>
                  <Fragment>
                    <p className="text-gray-500 text-md">{variant.VARIANTKEY}</p>
                    <p className="text-lg text-[rgb(255,128,64)] font-bold">${Number(variant_sell_price).toFixed(2)}</p>
                  </Fragment>
            </div>
            </div>
            </div>}
          </Fragment>
      
        <div className="xxs:mb-5 lg:mb-0">
            <p className="mt-8 text-lg font-medium">მიტანის სერვისი</p>
            
            {message === "წარმოშვა შეცდომა გთხოვთ გაანახლეთ გვერდი." ? <div>
                <h1 className="text-gray-500">წარმოშვა შეცდომა, გთხოვთ გაანახლეთ გვერდი.</h1>
              </div> : inventory && !inventory.freight_data ? <BringServiceLoading></BringServiceLoading> : <BringService changeLogistic={changeLogistic} inventory={inventory} selectedLogistic={selectedLogistic}></BringService>}
        </div>

        </div>
        <div className="bg-gray-50 px-4 pt-8 lg:mt-0">
          <Fragment>
            <p className="text-xl font-medium">გადახდის დეტალები</p>
            <p className="text-gray-400">დაასრულეთ შეკვეთა თქვენი გადახდის დეტალების შევსებით.</p>
          </Fragment>
          <div className="mt-8">
            <p htmlFor="ტელეფონის ნომერი" className="mt-4 mb-2 block text-sm font-medium">ტელ. ნომერი</p>
            <div className="relative">
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="number" name="ტელეფონის ნომერი" placeholder="მობილურის ნომერი" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <img loading="lazy" src={mobile} alt="ტელეფონი გადახდა"></img>
              </div>
            </div>
            {message === "ტელეფონის ნომერი არასწორია" && <p className="text-xs text-red-500">ნომერი არასწორია.</p>}
            <p htmlFor="მფლობელი" className="mt-4 mb-2 block text-sm font-medium">ბარათის მფლობელი</p>
            <div className="relative">
              <input type="text" onChange={(e) => setCardOwner(e.target.value)} value={cardOwner} name="მფლობელი" placeholder='სახელი და გვარი' className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <img loading="lazy" src={identify} alt="იდენტიფიკაცია მფლობელის"></img>
              </div>
            </div>
              <p htmlFor="ბარათის ნომერი" className="mt-4 mb-2 block text-sm font-medium">ბარათის დეტალები</p>
              <div className="flex">
                <div className="relative w-7/12 flex-shrink-0">
                  <input type="text" onChange={(e) => setCardNumber(e.target.value)} value={cardNumber} name="ბარათის ნომერი" className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" placeholder="xxxx-xxxx-xxxx-xxxx" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <img loading="lazy" src={card} alt="ბარათი"></img>
                  </div>
                </div>
                <input type="text" name="ბარათის ვადა" className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" placeholder="MM/YY" />
                <input type="text" name="ბარათის-cvc" className="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" placeholder="CVC" />
              </div>
            <div className='flex justify-between items-center'>
            <p className="mt-4 mb-2 block text-sm font-medium">მისამართი</p>
            {user.addresses.length > 0 && <select onChange={(e) => changeAddress(e.target.value)} className='text-sm mt-4 mb-2 py-1 rounded px-2 border'>
                {user.addresses.map((address, i) => {
                    return <option key={i} value={address._id}>{address.city}, {address.street}</option>
                })}
            </select>}
            </div>
            <div className='flex sm:flex-row w-full xxs:gap-1 sm:gap-0 xxs:flex-col items-center'>
                    <div className="relative xxs:w-full flex-shrink-0 sm:w-6/12">
                    <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]" placeholder="ქუჩის მისამართი" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                        <img loading="lazy" src={geoflag} alt="ქართული დროშა"></img>
                    </div>
                    </div>
                    <select
                    id="state"
                    name="state"
                    onChange={(e) => {
                        setState(e.target.value)
                    }}
                    value={state}
                    type="select"
                    required
                    className="w-full rounded-md border border-gray-200 px-3 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]"
                        >
                        {cityStates.map((c, i) => {
                            return <option key={i} defaultValue={state === "" ? "თბილისი" : state} value={c.state}>{c.state}</option>
                        })}
                    </select>
                    <select
                        id="ქალაქი"
                        name="ქალაქი"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        type="select"
                        required
                        className="w-full rounded-md border border-gray-200 px-3 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-[rgb(243,104,29)] focus:ring-[rgb(243,104,29)]"
                    >
                        {cityStates.filter((cs) => state === "" ? cs.state === "თბილისი" : cs.state === state).map((c, i) => {
                            return c.cities.map((city, index) => {
                                return <option defaultValue={city === "" ? "თბილისი" : city} key={index} value={city}>{city}</option>
                            })
                        })}
                    </select>
                </div>

      
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">ნივთი</p>
                <p className="font-semibold text-gray-900">${variant_sell_price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">მიტანა</p>
                <p className="font-semibold text-gray-900">${selectedLogistic.logisticPrice && selectedLogistic.logisticPrice.toFixed(2) || 0}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">მთლიანი ფასი</p>
              <p className="text-2xl font-semibold text-[rgb(255,128,64)]">$ {selectedLogistic.logisticPrice ?
              (Number(selectedLogistic.logisticPrice) + Number(variant_sell_price)).toFixed(2) : Number(variant_sell_price)}</p>
            </div>
          </div>
          <button type='submit' className="mt-2 mb-6 w-full hover:bg-gray-800 rounded-md bg-gray-900 px-6 py-3 font-medium text-white">შეკვეთა</button>
        </div>
      </form>
        </Fragment> : <Fragment>
          <Header></Header>
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="flex items-center xxs:flex-col mobl:flex-row items-center justfy-center space-x-1">
              <p className="text-center">{message}</p>
              <img src={sadIcon} alt="ემოჯი"></img>
            </div>
            <div className="flex items-center gap-3 mt-3">
                <a href="/" className="bg-[rgb(237,123,82)] justify-center rounded gap-3 font-normal text-white flex items-center text-[13px] p-[9px] space-3">
                  მთავარი გვერდი
                </a>
            </div>
        </div>
          <Footer></Footer>
          </Fragment>}
    </Fragment>
}

export default Purchase