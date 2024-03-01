import { Fragment, useEffect, useState } from "react"
import { Header } from "../Components/Header"
import { Footer } from "../Components/Footer"
import sadIcon from "../public/sad-icon.svg"
import {Helmet, HelmetProvider} from "react-helmet-async"
import { InternalError } from "../Components/InternalError"
import { CartItem } from "./CartItem"

const Cart = () => {
    const [cartArray, setCartArray] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [isEmpty, setIsEmpty] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const cartArrayRequest = async () => {
            localStorage.removeItem("c")
            try {
                const check_user = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/getcart`, {
                    credentials: "include",
                })
    
                if (!check_user.ok) {
                    throw Error(check_user.status)
                } else {
                    const data = await check_user.json()
                    if (data.length === 0) return setIsEmpty(true)
                    setCartArray(data || [])
                }
            } catch (error) {
                if (error.message === 401) {
                    const items = JSON.parse(localStorage.getItem("cart"))
                    console.log(items)
                    if (!items || !items.length) return setIsEmpty(true)
                    setCartArray(items || [])
                } else {
                    setIsError(true)
                }
            }
        }
        cartArrayRequest()
    }, [])

    const cartItemDelete = async (id, i) => {
        try {
            const check_user = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/deletecart/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (!check_user.ok) {
                throw Error(check_user.status)
            } else {
                const data = await check_user.json()
                if (data.length === 0) {
                    setCartArray([])
                    return setIsEmpty(true)
                } else {
                    setCartArray(data)
                }
            }   
        } catch (error) {
            if (error.message === 401) {
                const cartItems = JSON.parse(localStorage.getItem("cart"));
                const deletedItemArray = cartItems.filter((items, index) => index !== i);
                if (deletedItemArray.length === 0) {
                    localStorage.setItem("cart", JSON.stringify(deletedItemArray))
                    setCartArray([])
                    return setIsEmpty(true)
                } else {
                    setCartArray(deletedItemArray)
                }
            } else {
                setIsError(true)
            }
        }
    }

    const remove_cart_items = async () => {
        try {
            const check_user = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/clear`, {
                method: "DELETE",
                credentials: "include"
            })
    
            if (!check_user.ok) {
                throw Error(check_user.status)
            } else {
                setCartArray([])
                setIsEmpty(true)
            }   
        } catch (error) {
            if (error.message === 401) {
                localStorage.clear()
                setCartArray([])
                setIsEmpty(true)
            } else {
                setIsError(true)
            }
        }
    }

        return <HelmetProvider>
            <Helmet>
                <title>Slashy კალათა</title>
            </Helmet>
            <div className="relative">
        <Header></Header>
        <div id="closeScroll" className="min-h-[90vh]">
        {isError ? <InternalError></InternalError> : isEmpty ? <div className="flex mt-8 flex-col items-center gap-2 justify-center">
        <div className="flex gap-2 items-center">
            <h1>კალათა ცარიელია</h1>
            <img width={24} alt="მოწყენილი ემოჯი" height={24} src={sadIcon} loading="lazy"></img>
        </div>

        <a href="/" className="bg-[rgb(237,123,82)] text-sm font-sm rounded p-2 text-white">გააგრძელე შოპინგი</a>

        </div> :
        <div className={`${cartArray && cartArray.length > 0 ? "grid-cols-4 xs:grid-cols-1 xxs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3" : "grid-cols-1"}  gap-5 relative grid mb-3 mt-10 `}>        
        {cartArray.map((v, i) => {
            return (
              <Fragment key={i}>
                <CartItem v={v} i={i} quantity={quantity} cartItemDelete={cartItemDelete} setQuantity={setQuantity}></CartItem>
              </Fragment>
            );
          })}
          </div>}
        </div>
        {cartArray.length && <section className="sticky bg-slate-50 flex items-center justify-center px-5 h-[60px] bottom-0 right-0">
        <button className="rounded bg-[rgb(251,77,1)] hover:bg-[rgb(231,57,1)] w-28 justify-center rounded gap-3 font-normal text-white flex items-center text-[13px] p-2 space-3" onClick={remove_cart_items}>
        გასუფთავება
  </button>
    </section>}
        <Footer></Footer>
    </div>
        </HelmetProvider> 
    }
export default Cart