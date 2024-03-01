import { useSearchParams } from "react-router-dom"
import { memo, useEffect, useState  } from "react"

export const Filter = memo(({isVideo, countryCode}) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchParams, setSearchParams] = useSearchParams()
  
    useEffect(() => {
      const maxInput = searchParams.get("endSellPrice") || ""
      const minInput = searchParams.get("startSellPrice") || ""

      setMinPrice(minInput);
      setMaxPrice(maxInput);
    }, [])

    const filterByPrice = (e) => {
      e.preventDefault();
      if (minPrice !== "") {
        searchParams.set("startSellPrice", minPrice);
      } else {
        searchParams.delete("startSellPrice");
      }

      if (maxPrice !== "") {
        searchParams.set("endSellPrice", maxPrice);
      } else {
        searchParams.delete("endSellPrice");
      }

      const closeScroll = document.getElementById("closeScroll");
      closeScroll.style.overflow = "visible";
      closeScroll.style.position = "static";

      setSearchParams(searchParams);
    };

    const check_func = (e) => {
      if (e.target.value === countryCode) {
        searchParams.delete("countryCode")
      } else {
        if (!searchParams.has('countryCode')) {
          searchParams.append('countryCode', e.target.value);
        } else {
          searchParams.set('countryCode', e.target.value);
        }
      }

      const closeScroll = document.getElementById("closeScroll")
      closeScroll.style.overflow = "visible"
      closeScroll.style.position = "static"
      setSearchParams(searchParams);
    };

    const changeProductType = () => {
        if (searchParams.has('productType')) {
          searchParams.delete("productType")
        } else {
          searchParams.append('productType', 10);
        }

        const closeScroll = document.getElementById("closeScroll")
        closeScroll.style.overflow = "visible"
        closeScroll.style.position = "static"
        setSearchParams(searchParams);
      }

    return <section className="border-t sticky top-[3%] xxs:w-full lg:w-[200px] border-gray-200">
    <div className="border-t border-gray-200 w-full px-2 py-6">
    <h3 className="font-medium -my-3 text-gray-900">
        ფასი
    </h3>
      <form className="pt-6 xxs:flex lg:block" onSubmit={filterByPrice}>
          <input type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="p-2 lg:w-20 xxs:w-16 border outline-none" id="min" placeholder="მინ." ></input>
          <input type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="მაქს." id="max" className="p-2 xxs:w-16 lg:w-20 border outline-none" ></input>
          <button type="submit" className="bg-slate-100 border xxs:w-32 lg:w-40 p-2">გაფილტრე</button>
      </form>
    </div>

    <div className="border-t border-gray-200 px-2 py-6">
      <h3 className="fony-medium -my-3 flow-root text-gray-900">
          ყველა საწყობი
      </h3>
      <div className="pt-6">
        <form className="space-y-6">
          <div className="flex items-center">
            <input  id="ამერიკა" name="ამერიკა" value="US" type="checkbox" onChange={(e) => check_func(e)} checked={countryCode === "US" ? true : false} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <label htmlFor="ამერიკა" className="ml-3 min-w-0 flex-1 text-gray-500">ამერიკა</label>
          </div>
          <div className="flex items-center">
            <input  id="ჩინეთი" name="ჩინეთი"  value="CN" type="checkbox" onChange={(e) => check_func(e)} checked={countryCode === "CN" ? true : false}  className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <label htmlFor="ჩინეთი" className="ml-3 min-w-0 flex-1 text-gray-500">ჩინეთი</label>
          </div>
          <div className="flex items-center">
            <input  id="გერმანია" name="გერმანია"  value="DE" type="checkbox" onChange={(e) => check_func(e)} checked={countryCode === "DE" ? true : false}  className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <label htmlFor="გერმანია" className="ml-3 min-w-0 flex-1 text-gray-500">გერმანია</label>
          </div>
          <div className="flex items-center">
            <input  id="დიდი ბრიტანეთი" name="დიდი ბრიტანეთი"  value="GB" type="checkbox" onChange={(e) => check_func(e)} checked={countryCode === "GB" ? true : false}  className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <label htmlFor="დიდი ბრიტანეთი" className="ml-3 min-w-0 flex-1 text-gray-500">დიდი ბრიტანეთი</label>
          </div>
        </form>
      </div>
    </div>
    <div className="border-t border-gray-200 px-2 py-6">
      <h3 className="fony-medium -my-3 flow-root text-gray-900">
        პროდუქციის ტიპი
      </h3>
      <div className="pt-6">
        <form className="space-y-6">
          <div className="flex items-center">
            <input  id="ვიდეო" name="ვიდეო" value="video" type="checkbox" onChange={changeProductType} checked={isVideo ? isVideo : false} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="ვიდეო" className="ml-3 min-w-0 flex-1 text-gray-500">ვიდეო</label>
          </div>
        </form>
      </div>
    </div>
    </section>
})

Filter.displayName = 'Filter';