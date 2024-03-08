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
import { useParams } from "react-router-dom"
import Logo from "../public/slashy_logo.webp"

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

    const params = useParams()

    const phoneRegex = /^\d{9}$/;
    useEffect(() => {
      const check_user_auth = async () => {
          try {
              const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/profile`, {
                  method: "GET",
                  credentials: "include",
              }) 
      
              const data = await request.json()
              if (request.status === 401) {
                sessionStorage.setItem("purchaseVariantId", params.id)
                  setMessage("მომხმარებელს არ აქვს წვდომის უფლება")
                  throw new Error(data.fail)
              }
              if (!request.ok) {
                  throw new Error(data.fail)
              }
              
              setMessage("გაქვს უფლება")
              setUser(data)
              setCity(data.addresses[0].city)
              setState(data.addresses[0].state)
              setStreet(data.addresses[0].street)
              setPhoneNumber(data.phone)
              sessionStorage.removeItem("purchaseVariantId")

          } catch (error) {
              console.log(error)
          }
      }

      check_user_auth()
    }, [])

    useEffect(() => { 
      const fetch_order_details = async () => {
          const get_variant = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_variant/${params.id}`, {
              cache: "force-cache", credentials: "omit"
          })
          const data = await get_variant.json()
          
          setVariant(data.data)
          get_logistic(data.data.variantWeight, data.data.variantHeight, data.data.variantLength, data.data.variantWidth)
      }

      const get_logistic = async (weight, height, length, width) => {
          const get_inventory = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_inventory/${params.id}?variantWeight=${weight}&variantHeight=${height}&variantLength=${length}&variantWidth=${width}`, {
              credentials: "include",
              cache: "force-cache"
          })
          const data = await get_inventory.json()
          
          setInventory(data)
          setSelectedLogistic(data.freight_data[0])
      }

      if (message === "გაქვს უფლება") {
        fetch_order_details()
      }
    }, [message])

    const processPurchase = (e) => {
        e.preventDefault()
        console.log(phoneRegex.test(phoneNumber))
        if (!phoneRegex.test(phoneNumber)) {
          return setMessage("ტელეფონის ნომერი არასწორია")
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

    return <Fragment>       
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
            <img decoding="lazy" className="xxs:w-[80px] lg:w-[90px] object-cover xxs:h-[50px] lg:h-[40px]" src={Logo} alt="ლოგო"></img>
        </a>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,128,64,0.5)] text-xs font-semibold text-[rgb(255,128,64)]" href="#">
                  <img decoding="lazy" src={check} alt="გავლილი ეტაპი"></img>
                </a>
                <span className="font-semibold text-gray-900">შერჩევა</span>
              </li>
              <img decoding="lazy" src={outChevron} alt="შემდეგი ეტაპი მიმთითებელი"></img>
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
            {Object.keys(variant).length !== 0 && <div className="mt-3 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            <div className="flex flex-col rounded-lg bg-white sm:flex-row">
            <img decoding="lazy" className="m-2 h-24 w-28 rounded-md border object-cover object-center" width={112} height={96} src={variant.variantimg} alt="purchase product" />
            <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">{variant.variantNameEn && variant.variantNameEn.slice(0, 100) || "სათაურის გარეშე"}...</span>
                  <Fragment>
                    <p className="text-gray-500 text-md">{variant.variantKey}</p>
                    <p className="text-lg text-[rgb(255,128,64)] font-bold">${Number(variant.variantSellPrice).toFixed(2)}</p>
                  </Fragment>
            </div>
            </div>
            </div>}
          </Fragment>
      
        <div className="xxs:mb-5 lg:mb-0">
            <p className="mt-8 text-lg font-medium">მიტანის სერვისი</p>

            <div className={`mt-3 grid gap-6 ${inventory.freight_data && inventory.freight_data.length > 2 ? "overflow-y-scroll overflow-x-none" : ""}`}>
            {inventory.freight_data && inventory.freight_data.map((f, i) => {
                return <div onClick={() => changeLogistic(f)} className="relative" key={i}>

                <span class={`absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 ${f.logisticName === selectedLogistic.logisticName ? "border-[rgb(255,128,64)]" : ""} rounded-full border-8`} onChange={() => changeLogistic(f)}></span>
                <p className={`${selectedLogistic.logisticName === f.logisticName ? "border-2 bg-gray-50 border-[rgb(255,144,80)]" : ""} flex cursor-pointer select-none rounded-lg border p-4`}>
                    <div className="ml-5">
                    <span className="mt-2 font-semibold">{f.logisticName}</span>
                    <p className="text-slate-500 text-sm leading-6">მიტანა: {f.logisticAging} დღე</p>
                    <p className="text-slate-500 text-sm leading-6">ფასი: ${f.logisticPrice.toFixed(2)}</p>
                    </div>
                </p>

                </div>
            })}
            </div>
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
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="number" name="ტელეფონის ნომერი" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <img decoding="lazy" src={mobile} alt="ტელეფონი გადახდა"></img>
              </div>
            </div>
            {message === "ტელეფონის ნომერი არასწორია" && <p className="text-xs text-red-500">ნომერი არასწორია.</p>}
            <p htmlFor="მფლობელი" className="mt-4 mb-2 block text-sm font-medium">ბარათის მფლობელი</p>
            <div className="relative">
              <input type="text" onChange={(e) => setCardOwner(e.target.value)} value={cardOwner} name="მფლობელი" placeholder='სახელი და გვარი' className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <img decoding="lazy" src={identify} alt="იდენტიფიკაცია მფლობელის"></img>
              </div>
            </div>
              <p htmlFor="ბარათის ნომერი" className="mt-4 mb-2 block text-sm font-medium">ბარათის დეტალები</p>
              <div className="flex">
                <div className="relative w-7/12 flex-shrink-0">
                  <input type="text" onChange={(e) => setCardNumber(e.target.value)} value={cardNumber} name="ბარათის ნომერი" className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="xxxx-xxxx-xxxx-xxxx" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <img decoding="lazy" src={card} alt="ბარათი"></img>
                  </div>
                </div>
                <input type="text" name="ბარათის ვადა" className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="MM/YY" />
                <input type="text" name="ბარათის-cvc" className="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="CVC" />
              </div>
            <div className='flex justify-between items-center'>
            <p className="mt-4 mb-2 block text-sm font-medium">მისამართი</p>
            {user.addresses.length > 0 && <select onChange={(e) => changeAddress(e.target.value)} className='text-sm mt-4 mb-2 rounded px-2 border'>
                {user.addresses.map((address, i) => {
                    return <option key={i} value={address._id}>{address.city}, {address.street}</option>
                })}
            </select>}
            </div>
            <div className='flex items-center'>
                    <div className="relative flex-shrink-0 sm:w-6/12">
                    <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="ქუჩის მისამართი" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                        <img decoding="lazy" src={geoflag} alt="ქართული დროშა"></img>
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
                    className="w-full rounded-md border border-gray-200 px-3 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
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
                        className="w-full rounded-md border border-gray-200 px-3 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
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
                <p className="font-semibold text-gray-900">${variant.variantSellPrice}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">მიტანა</p>
                <p className="font-semibold text-gray-900">${selectedLogistic.logisticPrice && selectedLogistic.logisticPrice.toFixed(2) || 0}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">მთლიანი ფასი</p>
              <p className="text-2xl font-semibold text-[rgb(255,128,64)]">$ {selectedLogistic.logisticPrice ?
              (Number(selectedLogistic.logisticPrice || 0) + Number(variant.variantSellPrice || 0))
                .toFixed(2) : Number(variant.variantSellPrice)}</p>
            </div>
          </div>
          <button type='submit' className="mt-2 mb-6 w-full hover:bg-gray-800 rounded-md bg-gray-900 px-6 py-3 font-medium text-white">შეკვეთა</button>
        </div>
      </form>
        </Fragment> : ""}
    </Fragment>
}

export default Purchase