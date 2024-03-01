import { Fragment, useState } from "react"
import cities from "../../cities.json"
import { useNavigate } from "react-router-dom"
import { Helmet, HelmetProvider } from "react-helmet-async"

const AddAddress = () => {
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [street, setStreet] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const SubmitAddress = async (e) => {
        e.preventDefault()
        console.log(city, state, street);
        try {
            const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    state: state.trim() || "თბილისი",
                    city: city.trim() || "თბილისი",
                    street: street.trim()
                })                    
            })

            const data = await request.json()
            
            if (!request.ok) {
              throw new Error(data.message)
            }

            navigate("/dashboard/addresses")
        } catch (error) {
            setMessage(error.message)
        }
    }


    return <HelmetProvider>
    <Helmet>
      <title>Slashy - მისამათის დამატება</title>
    </Helmet>
     <div style={{flex: "11"}}>
    <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex h-full flex-[6] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="h-[450px]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-gray-800 text-center text-lg font-bold leading-9 tracking-tight text-gray-900">
            მისამართის დამატება
          </h1>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-3" onSubmit={SubmitAddress}>
            <Fragment>
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                მხარე
              </label>
                <div className="mt-1">
                    <select
                    id="state"
                    name="state"
                    onChange={(e) => {
                        setState(e.target.value)
                    }}
                    value={state}
                    type="select"
                    required
                    className="block px-3 w-full rounded-md py-2 text-gray-900 shadow-sm border outline-none focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                    >
                        {cities.map((c, i) => {
                            return <option defaultValue={state === "" ? "თბილისი" : state} key={i} value={c.state}>{c.state}</option>
                        })}
                    </select>
              </div>
            </Fragment>

            <Fragment>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ქალაქი
                </label>
              <div className="mt-1">
                <select
                  id="city"
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  type="select"
                  required
                  className="block px-3 w-full rounded-md py-2 text-gray-900 shadow-sm border outline-none focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                >
                    {cities.filter((cs) => state === "" ? cs.state === "თბილისი" : cs.state === state).map((c, i) => {
                        return c.cities.map((city, index) => {
                            return <option defaultValue={city === "" ? "თბილისი" : city} key={index} value={city}>{city}</option>
                        })
                    })}
                </select>
              </div>
            </Fragment>

            <Fragment>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  მისამართი
                </label>
              <div className="mt-1">
                <input
                  name="street"
                  id="street"
                  type="text"
                  placeholder="მაგ: მელიქიშვილის 4 ბინა 10"
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
                  required
                  className="block px-3 w-full rounded-md py-1.5 text-gray-900 shadow-sm border outline-none placeholder:text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                />
              </div>
              <p className={`text-[10px] ${message === "წარმატებით დასრულდა" ? "text-green-500" : "text-red-500"} font-semibold`}>{message}</p>

            </Fragment>

            <Fragment>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[rgb(237,123,82)] px-3 py-1.5 text-sm letter-spacing-1 tracking-wider leading-6 text-white shadow-sm hover:bg-[rgb(225,123,70)]"
              >
                დამატება
              </button>
            </Fragment>
          </form>
        </div>
      </div>
    </div>
  </div>
    </div>
    </HelmetProvider>
}

export default AddAddress