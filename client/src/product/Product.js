import { useEffect, Fragment, useMemo, useState } from "react"
import { Footer } from "../Components/Footer"
import { Header } from "../Components/Header"
import { useNavigate, useParams } from "react-router-dom"
import cart from "../public/cart-white.svg"
import RemovedProduct from "../public/removed_product.svg" 
import {AdditionalInformation} from "./Components/AdditionalInformation"
import {RecommendedProducts} from "./Components/RecommendedProducts"
import {ChildCategories} from "./Components/ChildCategories"
import {ProductVariants} from "./Components/ProductVariants"
import {translate} from "../Components/Translate"
import {ProductLoading} from "./Components/ProductLoading" 
import {Helmet, HelmetProvider} from "react-helmet-async"
import { MediaCarousel } from "./Components/MediaCarousel"

const Product = () => {
    const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [warning, setWarning] = useState()
    const [variantObj, setVariantObj] = useState({})
    const [isEmpty, setIsEmpty] = useState(false)
    const [displayDescription, setDisplayDescription] = useState(false)

    const {id} = useParams()    
    const navigate = useNavigate()

    useEffect(() => {
        const getProductDetail = async () => {
            try {
            const request = await fetch("https://m.cjdropshipping.com/elastic-api/cjProductInfo/v2/getProductDetail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "omit",
                body: JSON.stringify({
                    id: id
                })
            })
            
            const request_data = await request.json();
            const data = request_data.data

            if (!data) return setIsEmpty(true) 

            const split_keys = data.VARIANTKEYEN.split("-")

            const product_translated = await translate([...split_keys, data.MATERIALEN, data.CATEGORY, data.NAMEEN, data.DESCRIPTION])
            const mod_keys = [] 
            const v_keys_length = split_keys.length
            for(let i = 0; i < v_keys_length; i++) {
                mod_keys.push(product_translated[0][i])
            }

            data["VARIANTKEYEN"] = mod_keys
            data["MATERIALEN"] = product_translated[0][v_keys_length]
            data["CATEGORY"] = product_translated[0][v_keys_length + 1]
            data["NAMEEN"] = product_translated[0][v_keys_length + 2]
            data["DESCRIPTION"] = product_translated[0][v_keys_length + 3]

            setProduct(data)
            } catch (error) {
                console.log(error);
            }
        }

        getProductDetail();
      }, [id]);

      const changeVarientArr = (cueSele, curVarIndex, pv, setVarientList, index) => {
        //cueSele -- Current key
        //curVarIndex -- Current Index

        const all_variants_possible = product.stanProducts
    
        // for (let i = 0; i < all_variants_possible.length; i++) {
        //     all_variants_possible[]
        // }

        console.log(cueSele, curVarIndex, pv, index)
        setVarientList((prev) => {
            const filtered_variants = prev.filter((p) => {
                if (p.name === prev[index].name) {
                    return
                }
                return prev
            })

            for (let i = 0; i < filtered_variants.length; i++) {
                for (let j = 0; j < filtered_variants[i].keyObj.length; j++) {
                    console.log(filtered_variants[i].keyObj[j].img, cueSele.img)
                    if (filtered_variants[i].keyObj[j].img !== cueSele.img) {
                        filtered_variants[i].keyObj[j].disable = true
                    } else {
                        filtered_variants[i].keyObj[j].disable = false
                    }
                }
            }
            console.log(filtered_variants)
            return prev
        })
      }

    const addToCart = async  () => {
        if (Object.keys(variantObj).length === 0) {
            return setWarning("image")
        } 
        try {
            const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tocart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                credentials: "include",
                body: JSON.stringify({...variantObj, QUANTITY: quantity})
            })

            if (!request.ok) {
                throw Error(request.status)
            } else {
                localStorage.setItem('c', true)
                return setWarning(false)
            }
        } catch (error) {
            if (error.message == 401) {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];                
                const exists = cart.find((c) => c.ID === variantObj.ID)
                if (exists) {
                    return 
                } else {
                    localStorage.setItem('c', true)
                    cart.push({...variantObj, QUANTITY: quantity})
                    localStorage.setItem('cart', JSON.stringify(cart));
                    setWarning(false)   
                }
            } else {
                console.log("custom error page")
            }
        }
    }

    const navigatePurchase = () => {
        if (Object.keys(variantObj).length === 0) {
            return setWarning("image")
        }
        
        navigate(`/purchase/${variantObj.ID}`)
    }


    // PACKAGE_SIZE <------------------------------------------ Make this dynamic 
    const standard = product && product.stanProducts && product.stanProducts[0].STANDARD
    const package_sizes = standard && standard.match(/\d+/g);

    const renderProductDetails = useMemo(() => {
        if (isEmpty) {
          return (
              <Fragment>
                <div className="flex min-h-[70vh] flex-col gap-8 items-center justify-center">
                <img src={RemovedProduct} alt="პროდუქტი წაშლილია"></img>
                <div className="flex items-center flex-col gap-2">
                    <h1 className="text-slate-600">პროდუქტი ამოღებულია</h1>
                    <button onClick={() => window.history.back()} className="bg-[rgb(251,75,6)] text-white rounded py-1 px-2">
                        უკან დაბრუნება
                    </button>
                </div>
            </div>
            <div className="mt-20">
                <Footer></Footer>
            </div>
                </Fragment>
          );
        }
    
        if (Object.keys(product).length === 0) {
          return <ProductLoading></ProductLoading>
        }
        
        if (Object.keys(product).length !== 0) {
            const show_additional = document.getElementById("show_additional")

            const options = {
                root: null,
                rootMargin: "0px",
                threshold: 1,
            };
            
            const observerTest = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setDisplayDescription(true)
                        observer.unobserve(show_additional)
                    }
                });
            }, options);
            observerTest.observe(show_additional);

          return <HelmetProvider>
                <Helmet>
        <meta
          name="description"
          content={`${product.NAMEEN} - Slash.ge`}
        />
        <meta
          name="keywords"
          content={`Slash, Slash.ge, ${product.NAMEEN}`}
        />
        <link rel="canonical" href={window.location.href} />
        <title>{product.NAMEEN} - Slash.ge</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`შეიძინე - ${product.NAMEEN} - Slash.ge`}/>
        <meta
          property="og:description"
          content={`${product.NAMEEN} - Slash.ge`}
        />
        <meta
          property="og:image"
          content={product.newImgList[0]}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content={window.location.href} />
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
    </Helmet>
    <main className="h-full w-[100%] mx-auto"> 
            <div className="xxs:w-[95%] mobl:w-[90%] lg:w-[90%] sm:w-[80%] mx-auto">
            <ChildCategories product={product}></ChildCategories>
            
            <div className="flex sm:gap-3 lg:gap-0 w-full lg:flex-row xxs:flex-col lg:h-full">
                <div className="flex xxs:w-full h-full lg:w-[450px] outline outline-1 outline-gray-100 flex-col">
                    <MediaCarousel product={product} id={id}></MediaCarousel>
                </div>
                <div className="flex xxs:mt-5 lg:mt-0 justify-between w-full lg:h-full lg:ml-8 flex-col">
                
                    <Fragment>
                        <h1 className="lg:text-base text-left font-semibold text-gray-900 xxs:min-h-[30px] lg:min-h-[73px]">{product.NAMEEN}</h1>
                    </Fragment>
                    <div className="flex h-full flex-col">
                        <div className="flex xxs:flex-col gap-3 lg:flex-row mt-3 justify-between">
                        
                        <div className="xxs:flex xxs:flex-wrap md:flex-nowrap gap-3 w-full justify-between items-center">
                            <div className="flex items-center p-3 xxs:w-full border border-[rgb(251,77,1)] justify-center rounded border border-gray-100">
                                <p className="font-semibold xxs:text-[24px] sm:text-[20px] lg:text-md text-[rgb(251,77,1)]">${Object.getOwnPropertyNames(variantObj).length > 0 ? Number(variantObj.SELLPRICE * quantity).toFixed(2) : Number(product.SELLPRICE.split("-")[0] * quantity).toFixed(2)}{Object.getOwnPropertyNames(variantObj).length > 0 ? "" : product.SELLPRICE.split("-")[1]&&-Number(product.SELLPRICE.split("-")[1] * quantity).toFixed(2)}</p>   
                            </div>
                    
                            <div className="flex rounded h-[60px] w-full border border-gray-100">
                                <button onClick={() => {
                                    if (Object.keys(variantObj).length === 0) {
                                        return setWarning("image")
                                    }
                                    setQuantity(q => q - 1)
                                }} disabled={quantity === 1} className="border py-3 px-5 flex items-center justify-center border-gray-200 w-full cursor-pointer outline-none">
                                    <span className="font-normal">−</span>
                                </button>
                                    <input onChange={(e) => {
                                        if (Object.keys(variantObj).length === 0) {
                                            return setWarning("image")
                                        }
                                        setQuantity(e.target.value)
                                    }} type="number" readOnly className="outline-none lg:w-[50px] px-5 xxs:w-full xl:w-full text-center border flex items-center text-gray-700" value={quantity}></input>
                                <button onClick={() => {
                                    if (Object.keys(variantObj).length === 0) {
                                        return setWarning("image")
                                    }
                                    setQuantity(q => q + 1)
                                }} className="border px-5 flex items-center justify-center border-gray-200 w-full cursor-pointer outline-none">
                                    <span className="font-normal">+</span>
                                </button>
                            </div>
                            
                            <div className="flex rounded w-full h-full justify-center p-3 border-gray-100 border items-center">
                                <p className="font-bold xxs:text-[15px] sm:text-[19px] lg:text-[14px]">{variantObj.PACKWEIGHT ? variantObj.PACKWEIGHT * quantity : product.PACKWEIGHT.split("-")[1] ? product.PACKWEIGHT.split("-")[0] + " - " + product.PACKWEIGHT.split("-")[1] : product.PACKWEIGHT * quantity}გ</p>
                            </div>
                        </div>
                        </div>
                        
                        <ProductVariants changeVarientArr={changeVarientArr} product={product} variantObj={variantObj} setVariantObj={setVariantObj} warning={warning}></ProductVariants>
                    
                    <div className="w-full flex xxs:flex-col xxs:items-start sm:flex-row gap-3 sm:items-center lg:items-start mt-2 justify-between h-full lg:h-1/2">
                    <div className="flex lg:w-3/4 xl:w-1/3 flex-col xl:justify-between h-full w-full gap-5">
                        <button onClick={addToCart} className="border xxs:w-full text-white bg-[rgb(251,77,1)] xxs:w-full rounded gap-2 justify-center flex items-center text-[13px] px-4 xxs:h-[45px] lg:h-[40px]">
                            <img alt="კალათაში დამატება" decoding="lazy" width={16} height={16} src={cart}></img>
                            დამატება
                        </button>
                        {<button onClick={navigatePurchase} className="bg-green-500 xxs:w-full hover:bg-green-600 xxs:w-full justify-center rounded gap-3 font-normal text-white flex items-center text-[13px] xxs:h-[45px] lg:h-[40px] px-4 space-3">ყიდვა</button>}
                    </div>
                    <div className="xxs:w-full lg:w-full xl:w-2/4 h-full px-3 gap-5 py-2 flex lg:h-[100px] flex-col border justify-between rounded border-gray-100">
                            <p>მნიშვნელოვანი ინფორმაცია</p>
                            <div className="flex mt-2 mobl:w-8/12 items-center lg:w-full 2xl:w-3/4 justify-between">
                            <div>
                                <p className="text-xs">მატერია</p>
                                <p className="text-[11px]">{product.MATERIALEN}</p>
                            </div>
                            <div>
                                <p className="text-xs">შეფუთვის ზომები</p>
                                <p className="text-[10px]">{package_sizes.map((p) => `${p} x `)}მმ</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
                </div>  
            
                <RecommendedProducts id={id}></RecommendedProducts>
                </div>
            </main>
            </HelmetProvider>
        }
    
        return null;
      }, [isEmpty, product]);

    return <Fragment>
        <Header></Header>
        <section id="closeScroll" className="min-h-screen w-full mx-auto mt-5">
            {renderProductDetails}
            <span id="show_additional"></span>
                    {Object.keys(product).length !== 0 && <Fragment>
                        {displayDescription && <AdditionalInformation id={id} product={product} ></AdditionalInformation>}
                        <div className="mt-20">
                            <Footer></Footer>
                        </div>
                    </Fragment>}
        </section>
    </Fragment>
}

export default Product