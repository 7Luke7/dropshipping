import { useEffect, Fragment, useMemo, useState, lazy, Suspense } from "react"
import { Footer } from "../Components/Footer"
import { Header } from "../Components/Header"
import { useParams } from "react-router-dom"
import cart from "../public/cart-white.svg"
import RemovedProduct from "../public/removed_product.svg" 
import {ChildCategories} from "./Components/ChildCategories"
import {ProductVariants} from "./Components/ProductVariants"
import {translate} from "../Components/Translate"
import {ProductLoading} from "./Components/ProductLoading" 
import { MediaCarousel } from "./Components/MediaCarousel"
import {AdditionalInformation} from "./Components/AdditionalInformation"

const RecommendedProducts = lazy(() => import('./Components/RecommendedProducts'));

const Product = () => {
    const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [variantObj, setVariantObj] = useState({})
    const [isEmpty, setIsEmpty] = useState(false)
    const [displayDescription, setDisplayDescription] = useState(false)
    const [curr, setCurr] = useState({})

    const {id} = useParams()    

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
            const original = [...split_keys, data.MATERIALEN, data.CATEGORY, data.NAMEEN, data.DESCRIPTION]
            const not_null_properties = original.filter((a) => a !== null )

            const product_translated = await translate(not_null_properties)
            const mod_keys = [] 
            const v_keys_length = split_keys.length
            for(let i = 0; i < v_keys_length; i++) {
                mod_keys.push(product_translated[0][i])
            }

            const diff = original.length - product_translated[0].length
            data["VARIANTKEYEN"] = mod_keys
            data["MATERIALEN"] = product_translated[0][v_keys_length - diff]
            data["CATEGORY"] = product_translated[0][(v_keys_length + 1) - diff]
            data["NAMEEN"] = product_translated[0][(v_keys_length + 2) - diff]
            data["DESCRIPTION"] = product_translated[0][(v_keys_length + 3) - diff]

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
                    document.title = `${data.NAMEEN} - Slash`

            setProduct(data)
            } catch (error) {
                console.log(error);
            }
        }

        getProductDetail();
      }, [id]);

      const changeVarientArr = (cueSele, curVarIndex, pv, setVarientList, index) => {
        if (pv.name.includes("ფერი")) {
            const img_index = product.newImgList.findIndex((a) => a === cueSele.img)
            setCurr({imageURL: cueSele.img, index: img_index})
        } else if (!pv.name.includes("ფერი") && index === 0) {
            const img_index = product.newImgList.findIndex((a) => a === cueSele.img)
            setCurr({imageURL: cueSele.img, index: img_index})
        }
    
        const all_variants_possible = product.stanProducts
    
        setVarientList((prev) => {
            const lists = [...prev]
            const key_builder = []
            const parent_indexes = []

            if (lists[index].keyObj[curVarIndex].chosen) {
                lists[index].keyObj[curVarIndex].chosen = false
            } else {
                lists[index].keyObj[curVarIndex].chosen = true  
            }
    
            for (let i = 0; i < lists.length; i++) {
                for (let j = 0; j < lists[i].keyObj.length; j++) {
                    if (lists[i].keyObj[j].chosen) {
                        if (lists[i].name === lists[index].name && j !== curVarIndex) {
                            lists[i].keyObj[j].chosen = false
                        } else {
                            key_builder.push(lists[i].keyObj[j].eng_name)
                        }
                        parent_indexes.push(lists[i].name)
                    } 
                }
            }
    
            const filtered_variants = all_variants_possible.filter(variant => {
                const all_keys_into_array = variant.VARIANTKEY.split("-")
                return key_builder.every(key => all_keys_into_array.includes(key))
            })
    
            
            const pass_on = []
    
            for (let i = 0; i < lists.length; i++) {
                for (let j = 0; j < lists[i].keyObj.length; j++) {
                    for (let k = 0; k < filtered_variants.length; k++) {
                        const splited_filter_keys = filtered_variants[k].VARIANTKEY.split("-")
                        if (splited_filter_keys.includes(lists[i].keyObj[j].eng_name)) {
                            lists[i].keyObj[j].disable = false
                            pass_on.push(lists[i].keyObj[j].eng_name)
                        } else if (!pass_on.includes(lists[i].keyObj[j].eng_name)) {
                            lists[i].keyObj[j].disable = true
                        }
                    }
                }
            }
    
            const chosenVariantIndex = all_variants_possible.findIndex(variant => variant.VARIANTKEY === key_builder.join("-"))
            if (chosenVariantIndex !== -1) {
                setVariantObj(all_variants_possible[chosenVariantIndex])
            }
    
            return lists
        })
    }

    const addToCart = async  () => {
        if (Object.keys(variantObj).length === 0) {
            return
        }
        const translated_data = await translate([variantObj.NAMEEN || product.NAMEEN, variantObj.STANDARD])

        variantObj.NAMEEN = translated_data[0][0]
        variantObj.STANDARD = translated_data[0][1]

        try {
            const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tocart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                credentials: "include",
                body: JSON.stringify({...variantObj, quantity: quantity})
            })

            if (!request.ok) {
                throw Error(request.status)
            } else {
                document.getElementById("notification").style.display = "block"
            }
        } catch (error) {
            if (error.message === "401") {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];                
                const exists = cart.find((c) => c.ID === variantObj.ID)
                if (exists) {
                    return 
                } else {
                    document.getElementById("notification").style.display = "block"
                    cart.push({...variantObj, quantity: quantity})
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            } else {
                console.log("custom error page")
            }
        }
    }

    // PACKAGE_SIZE <------------------------------------------ Make this dynamic 
    const standard = Object.keys(variantObj).length === 0 ? product && product.stanProducts && product.stanProducts[0].STANDARD : variantObj.STANDARD
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

          return <Fragment>
    <main className="h-full w-[100%] mx-auto"> 
            <div className="xxs:w-[95%] mobl:w-[90%] lg:w-[90%] sm:w-[80%] mx-auto">
            <ChildCategories product={product}></ChildCategories>
            
            <div className="flex sm:gap-3 lg:gap-0 w-full lg:flex-row xxs:flex-col lg:h-full">
                <div className="flex xxs:w-full h-full lg:w-[400px] rounded-t xl:w-[450px] outline outline-1 outline-gray-100 flex-col">
                    <MediaCarousel product={product} curr={curr} setCurr={setCurr} id={id}></MediaCarousel>
                </div>
                <div className="flex xxs:mt-5 lg:mt-0 justify-between w-full lg:h-full lg:ml-8 flex-col">
                
                    <Fragment>
                        <h1 className="lg:text-base text-left font-semibold text-gray-900 xxs:min-h-[30px] lg:min-h-[73px]">{product.NAMEEN}</h1>
                    </Fragment>
                    <div className="flex h-full flex-col">
                        <div className="flex xxs:flex-col gap-3 lg:flex-row mt-3 justify-between">
                        
                        <div className="xxs:flex xxs:flex-wrap md:flex-nowrap gap-3 w-full justify-between items-center">
                            <div className="flex items-center p-3 xxs:w-full border border-[rgb(251,77,1)] justify-center rounded border border-gray-100">
                                <p className="font-semibold xxs:text-[24px] sm:text-[20px] lg:text-md text-[rgb(251,77,1)]">
                                    ${Object.getOwnPropertyNames(variantObj).length > 0 ? Number(variantObj.SELLPRICE * quantity).toFixed(2) : product.SELLPRICE}
                                </p>   
                            </div>
                    
                            <div className="flex rounded h-[60px] w-full border border-gray-100">
                                <button onClick={() => {
                                    if (Object.keys(variantObj).length === 0) {
                                        return
                                    }
                                    setQuantity(q => q - 1)
                                }} disabled={quantity === 1} className="border py-3 px-5 flex items-center justify-center border-gray-200 w-full cursor-pointer outline-none">
                                    <span className="font-normal">−</span>
                                </button>
                                    <input onChange={(e) => {
                                        if (Object.keys(variantObj).length === 0) {
                                            return
                                        }
                                        setQuantity(e.target.value)
                                    }} type="number" readOnly className="outline-none lg:w-[50px] px-5 text-md xxs:w-full xl:w-full text-center border flex items-center text-gray-700" value={quantity}></input>
                                <button onClick={() => {
                                    if (Object.keys(variantObj).length === 0) {
                                        return
                                    }
                                    setQuantity(q => q + 1)
                                }} className="border px-5 flex items-center justify-center border-gray-200 w-full cursor-pointer outline-none">
                                    <span className="font-normal">+</span>
                                </button>
                            </div>
                            
                            <div className="flex rounded w-full h-full justify-center p-3 border-gray-100 border items-center">
                                <p className="font-bold xxs:text-[15px] sm:text-[19px] lg:text-[14px] xl:text-md">{variantObj.PACKWEIGHT ? variantObj.PACKWEIGHT * quantity : product.PACKWEIGHT.split("-")[1] ? product.PACKWEIGHT.split("-")[0] + " - " + product.PACKWEIGHT.split("-")[1] : product.PACKWEIGHT * quantity}გ</p>
                            </div>
                        </div>
                        </div>
                        
                        <ProductVariants changeVarientArr={changeVarientArr} product={product}></ProductVariants>
                    
                    <div className="w-full flex xxs:flex-col xxs:items-start sm:flex-row gap-3 sm:items-center lg:items-end mt-2 justify-between h-full lg:h-1/2">
                    <div className="flex lg:w-3/4 xl:w-1/3 flex-col xl:justify-between h-full w-full gap-5">
                        <button onClick={addToCart} className="flex items-center xxs:py-3 justify-center apx-4 lg:py-2 bg-[rgb(251,77,1)] text-white rounded gap-2 text-xs lg:text-sm">
                            <img alt="Add to Cart" src={cart} className="w-4 h-4" />
                            <span>დამატება</span>
                        </button>
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
            
                <Suspense fallback={<div>რეკომენდაცია იტვირთება...</div>}>
                    <RecommendedProducts id={id}></RecommendedProducts>
                </Suspense>
                </div>
            </main>
          </Fragment>
        }
    
        return null;
      }, [isEmpty, variantObj, quantity, product, curr]);

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
