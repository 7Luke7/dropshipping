import { useEffect, useMemo, useState } from "react"
import trash from "../../public/trash-icon.svg"

const Addresses = () => {
    const [addresses, setAddresses] = useState([])
    const [empty, setEmpty] = useState(false)
    const [error, setError] = useState(false)
    
    useEffect(() => {
      document.title = "Slash - ჩემი მისამართები"
        const get_addresses = async () => {
            try {
              const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/address`, {
                method: "GET",
                credentials: "include",
              })

              const data = await request.json() 
              if (!request.ok) {
                throw Error(data.message)
              } 

              setAddresses(data.addresses)
            } catch (error) {
              if (error.message === "მისამართები ცარიელია") {
                setEmpty(true)
              } else if (error.message !== "მისამართები ცარიელია") {
                setError(true)
              }
            }
        }

        get_addresses()
    }, [])

    const delete_address = async (id) => {
        try {
            const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/address/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await request.json()

            if (!request.ok) {
              throw new Error(data.message)
            }

            if (!data.length) {
              setEmpty(true)
            }
            setAddresses(data)
        } catch (error) {   
            setError(true)
        }
    }

    const render = useMemo(() => {
      if (addresses.length) {
        return <div>
        <h1 className="text-xl ml-3 font-medium mb-3">მისამართები</h1>
        <div className="flex ml-3 flex-wrap gap-5">
        {addresses.map((address) => {
            return (
              <div key={address._id} className="p-5 sm:min-w-[300px] xxs:min-w-[250px] rounded bg-[#f3f3f3] border border-[rgb(251,77,1)] shadow-md">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[10px]">{address._id}</span>
                    <button onClick={() => delete_address(address._id)}>
                        <img alt="მისმართის წაშლა" width={16} height={16} src={trash}></img>
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex flex-col justify-between gap-2">
                      <p className="text-xs">კუთხე:</p>
                      <p className="text-xs">ქალაქი:</p>
                      <p className="text-xs">ქუჩა:</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2">
                      <p className="text-xs">{address.state}</p>
                      <p className="text-xs">{address.city}</p>
                      <p className="text-xs">{address.street}</p>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>
        <div className="mt-5">
          <a href="/dashboard/add" className="xxs:w-full mt-5 ml-3 sm:w-auto text-xs px-3 py-2 text-white bg-[rgb(251,77,1)] rounded hover:bg-[rgb(231,57,1)]">დაამატე მისამართი</a>
        </div>
        </div>
      }
      if (empty) {
        return <div className="flex w-full justify-center items-center flex-col">
        <p className="font-medium mb-3">მისამართები არ არის დამატებული.</p>
        <div className="mt-3">
        <a href="/dashboard/add" className="xxs:w-full sm:w-auto text-xs px-3 py-2 text-white bg-[rgb(251,77,1)] rounded hover:bg-[rgb(231,57,1)]">დაამატე მისამართი</a>
      </div>
      </div>
      } 

      if (error) {
        return <div className="flex w-full justify-center items-center flex-col">
        <p className="font-medium mb-3">დაფიქსირდა შეცდომა ცადეთ მოგვიანებით.</p>
        <div className="mt-3">
        <button onClick={() => window.history.back()} className="xxs:w-full sm:w-auto text-xs px-3 py-2 text-white bg-[rgb(251,77,1)] rounded hover:bg-[rgb(231,57,1)]">დაბრუნდი უკან</button>
      </div>
      </div>
      }

    }, [error, empty, addresses])


    return <>
      <div className="sm:flex-[11]">
      <div className="sm:w-[80%] flex sm:items-start gap-10 flex-col m-auto mt-10">
          {render}
      </div>
    </div>
  </>
}

export default Addresses