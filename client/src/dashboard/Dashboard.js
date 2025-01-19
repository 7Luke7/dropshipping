import { Fragment, useEffect, useState } from "react"
import pen from "../public/pen.svg"
import Plus from "../public/plus-circle.svg"

const Dashboard = () => {
    const [user, setUser] = useState()
    const [displayMailInput, setDisplayMailInput] = useState(false)
    const [displayPhoneInput, setDisplayPhoneInput] = useState(false)
    const [phoneInput, setPhoneInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [message, setMessage] = useState("")
    
    useEffect(() => {
      document.title = "Slash - ჩემი ანგარიში"
      const get_addresses = async () => {
        try {
          const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/profile`, {
            method: "GET",
            credentials: "include",
        })
  
        const data = await request.json()
  
        if (!request.ok) {
          throw new Error(data.message)
        }
  
        setUser(data)
        } catch (error) {
          console.log(error.message);
        }
      }

      get_addresses()
    }, [])

    const update_user_phone = async (e) => {
      e.preventDefault()
      setMessage("")

      if (phoneInput === user.phone) {
        return setDisplayPhoneInput(false)
      }

      try {
        const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/update_user_phone`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phoneInput: phoneInput
          }),
          credentials: "include"
        })

        const data = await request.json()

        if (!request.ok) {
          throw new Error(data.message)
        }

        setUser((prev) => {
          return {...prev, phone: data.phone}
        })  

        setDisplayPhoneInput(false)
      } catch (error) {
        setMessage(error.message)
      }
    }

    const update_user_email = async (e) => {
      e.preventDefault()
      setMessage("")

      if (emailInput === user.email) {
        return setDisplayMailInput(false)
      }
      try {
        const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/update_user_email`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailInput: emailInput
          }),
          credentials: "include"
        })

        const data = await request.json()

        if (!request.ok) {
          throw new Error(data.message)
        }

        setUser((prev) => {
          return {...prev, email: data.email}
        })        
        setDisplayMailInput(false)
      } catch (error) {
        setMessage(error.message)
      }
    }

    return <Fragment>
      <div className="sm:flex-[11]">
    <div className="sm:w-[80%] flex gap-10 flex-col m-auto mt-10">
        {
          user && <div className="flex flex-col gap-3">
          <Fragment>
          <h1 className="text-xl ml-3 font-medium mb-3">პერსონალური მონაცემები</h1>
          <div className="flex ml-3 flex-wrap gap-5">
                <div className="px-5 py-3 sm:min-w-[300px] xxs:min-w-[250px] rounded bg-[#f3f3f3] border border-[rgb(251,77,1)] shadow-md">
                  <div className="flex gap-2">
                    <div className="flex flex-col justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <p className="text-xs">ტელ. ნომერი: {!displayPhoneInput && user.phone}</p>
                        {displayPhoneInput ? <form id="tel" onSubmit={update_user_phone} className="flex items-center">
                        <input type="text" value={phoneInput} className="border text-xs p-1 outline-0" onChange={(e) => setPhoneInput(e.target.value)}></input><button className="border w-6 font-semibold" type="submit">
                        +
                        </button>
                        </form> : <button onClick={() => {
                          setDisplayPhoneInput(true)
                          setPhoneInput(user.phone)
                        }}><img className="text-xs" src={!user.phone ? Plus : pen} alt={!user.phone ? "ტელ. ნომრის დამატება" : "ტელ. ნომრის რედაქტირება"}></img>
                      </button>}  
                    </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs">მეილი: {!displayMailInput && user.email}</p>
                        {displayMailInput ? <form id="email" onSubmit={update_user_email} className="flex items-center">
                            <input type="email" value={emailInput} className="border text-xs p-1 outline-0" onChange={(e) => setEmailInput(e.target.value)}></input><button className="border w-6 font-semibold" type="submit">
                            +
                            </button>
                            </form> : <button onClick={() => {
                              setDisplayMailInput(true)
                              setEmailInput(user.email)
                            }}><img className="text-xs" src={!user.email ? Plus : pen} alt={!user.email ? "მეილის დამატება" : "მეილის რედაქტირება"}></img>
                          </button>}  
                      </div>
                    </div>
                  </div>
                </div>
          </div>
          </Fragment>
          <p className="text-red-500 text-sm ml-3 font-semibold">{message}</p>
          <Fragment>
          <h1 className="text-xl ml-3 font-medium mb-3">მისამართები</h1>
          <div className="flex ml-3 flex-wrap gap-5">
          {user.addresses.length > 0 ? user.addresses.map((address) => {
              return (
                <div key={address._id} className="p-5 sm:min-w-[300px] xxs:min-w-[250px] rounded bg-[#f3f3f3] border border-[rgb(251,77,1)] shadow-md">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[10px]">{address._id}</span>
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
            }) : <Fragment>
            <a href="/dashboard/add" className="text-center w-auto text-xs px-3 py-2 text-white bg-[rgb(251,77,1)] rounded hover:bg-[rgb(231,57,1)]">დაამატე მისამართი</a>
          </Fragment>}
          </div>
          </Fragment>
          </div>
        }
      <div>
      </div>
    </div>
  </div>
    </Fragment>
}

export default Dashboard