import {useNavigate} from "react-router-dom"
import backArrow from "../public/back-arrow.svg"
import AddressesIcon from "../public/addresses.svg"
import HomeIcon from "../public/home.svg"
import ExitSvg from "../public/exit.svg"

export const Sidebar = () => {

    const navigate = useNavigate()

    const routedArray = window.location.pathname.split("/")
    const routed = routedArray.filter((r) => r !== "dashboard")

    const logout_user = async () => {
        try {
            const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/logout`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await request.json()
            if (!request.ok) {
                throw new Error({message: data.message, status: data.status})
            }

            navigate("/login")
        } catch (error) {
            if(error.status === 401) {
                console.log("არ გაქვთ უფლება")
            }
            console.log(error);
        }
    }

    return <aside className="p-5 sm:flex-[2] sm:h-full xxs:h-[68px] bg-[rgb(237,123,82)]">
        <div className="text-white sm:p-3 sm:pt-4 flex xxs:flex-row sm:flex-col sm:h-full sm:justify-between xxs:justify-center gap-5">
        <div className="flex xxs:flex-row sm:items-start  xxs:items-center sm:flex-col gap-5">
        <a href="/" className="xs:pr-16 text-white text-xs sm:mb-3 flex items-center gap-1">
                <img src={backArrow} width={24} height={24} className="sm:w-[24px] sm:h-[24px]" alt="უკან დაბრუნება"></img>
                <p className="xxs:hidden sm:block">უკან დაბრუნება</p>
            </a>    
            <a href="/dashboard" className={`text-sm xxs:relative sm:static ${routed.length === 1 ? "sm:font-bold" : "sm:font-normal sm:text-[#f3f3f3]"} sm:items-center sm:flex sm:gap-1`}>
                <img src={HomeIcon} alt="მთავარი" width={24} height={24} className="sm:w-[24px] sm:h-[24px]"></img>
                <span className={`xxs:block sm:hidden ${routed.length === 1 && "absolute bottom-0 left-0 translate-y-[25px] right-0 h-[5px] rounded bg-white"} `}></span>
                <p className="xxs:hidden sm:block">მთავარი</p>
            </a>
            <a className={`flex text-sm xxs:relative sm:static items-center ${routed[1] === "addresses" ? "sm:font-bold" : "sm:font-normal sm:text-[#f3f3f3]"} sm:gap-1`} href="/dashboard/addresses">
                <img src={AddressesIcon} width={24} height={24} alt="მისამართები" className="sm:w-[24px] sm:h-[24px]"></img>
                <span className={`xxs:block sm:hidden ${routed[1] === "addresses" && "absolute bottom-0 left-0 translate-y-[25px] right-0 h-[5px] rounded bg-white"} `}></span>
                <p className="xxs:hidden sm:block">მისამართები</p>
            </a>
            </div>
            <div className="xxs:flex xxs:items-center xs:pl-16 sm:pl-0 sm:block">
                <button type="button" className="flex justify-between gap-1 items-center text-sm" onClick={logout_user}>
                    <p className="xxs:hidden sm:block">გასვლა</p>
                    <img src={ExitSvg} width={24} height={24} className="sm:w-[24px] sm:h-[24px]" alt="გასვლა ექაუნთიდან"></img>
                </button>
            </div>
        </div>
    </aside>
}