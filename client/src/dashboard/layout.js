import {Sidebar} from "../Components/Sidebar"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const Layout = () => {
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    useEffect(() => {
        const check_user_auth = async () => {
            try {
                const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/profile`, {
                    method: "GET",
                    credentials: "include"
                }) 
        
                const data = await request.json()
                if (request.status === 401) {
                    return navigate("/login")
                } else if (!request.ok && request.status !== 401) {
                    throw new Error(data.message)
                }
                setLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        }

        check_user_auth()
    }, [navigate])

    return <div className="min-h-[100vh] bg-[rgb(235,235,235)]">
        {loading ? <div className='flex space-x-2 justify-center items-center bg-white h-screen'>
         <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
       <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
       <div className='h-8 w-8 bg-[rgb(237,123,82)] rounded-full animate-bounce'></div>
   </div> : <main className="sm:flex min-h-screen sm:flex-row">
            <div className="sticky top-0 bottom-0">
            <Sidebar></Sidebar>
            </div>
            <Outlet></Outlet>
            </main>
            }
    </div>
}

export default Layout