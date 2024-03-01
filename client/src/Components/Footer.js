import Facebook from "../public/facebook.svg"
import Tiktok from "../public/tiktok.svg"
import Instagram from "../public/instagram.svg"
import Youtube from "../public/youtube.svg"
import TelePhoneFill from "../public/telephone-fill.svg"
import envelopeFill from "../public/envelope-fill.svg"

export const Footer = () => {
    return <div className="w-full bg-[rgb(242,242,242)]">
    <div className="sm:w-[70%] xxs:w-[100%] xxs:grid xxs:grid-cols-2 p-5 flex-wrap xxs:gap-5 lg:gap-0 lg:flex justify-evenly m-auto">
    <main className="list-none flex flex-col gap-3">
    <h2 className="text-sm font-[600] text-gray-900">ნავიგაცია</h2>
    <hr className="border-1 border-[rgb(251,77,1)]" />
    <li className="text-xs font-[600] text-gray-700">
        <a href="/about">ჩვენ შესახებ</a>
    </li>
    <li className="text-xs font-[600] text-gray-700">
        <a href="/rules">წესები და პირობები</a>
    </li>
    <li className="text-xs font-[600] text-gray-700">
        <a href="/delivery">მიწოდების სერვისი</a>
    </li>
</main>
<main className="list-none flex flex-col gap-3">
    <h2 className="text-sm font-[600] text-gray-900">გადახდები</h2>
    <hr className="border-1 border-[rgb(251,77,1)]" />

    <li className="text-xs font-[600] text-gray-700">
        <a href="/payments">გადახდის მეთოდები</a>
    </li>
</main>
<main className="list-none flex flex-col gap-3">
    <h2 className="text-sm font-[600] text-gray-900">გამოგვყევი</h2>
    <hr className="border-1 border-[rgb(251,77,1)]" />

    <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
        <img src={Facebook} alt="ფეისბუქი" loading="lazy" width={16} height={16}></img>
        Facebook
    </li>
    <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
    <img src={Instagram} alt="ინსტაგრამი" loading="lazy" width={16} height={16}></img>
    Instagram
    </li>
    <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
    <img src={Tiktok} alt="ტიკტოკი" loading="lazy" width={16} height={16}></img>
    Tiktok</li>
    <li className="text-xs font-[600] text-gray-700 flex gap-2 items-center">
    <img src={Youtube} alt="იუთუბი" loading="lazy" width={16} height={16}></img>
    Youtube</li>
</main>
<main className="list-none flex flex-col gap-3">
    <h2 className="text-sm font-[600] text-gray-900">კონტაქტი</h2>
    <hr className="border-1 border-[rgb(251,77,1)]" />
    <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
    <img src={envelopeFill} alt="მეილი" loading="lazy" width={16} height={16}></img>
    info@store.ge</li>
    <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
    <img src={TelePhoneFill} alt="ტელეფონი" loading="lazy" width={16} height={16}></img>
    +995 (32) 2 60 30 60 / *7007</li>
</main>
    </div>
    <div className="xxs:w-[100%] sm:w-[60%] text-center p-5 m-auto">
    <hr />
        <p className="text-xs font-bold text-gray-600 pt-5">Copyright © {new Date().getFullYear()} Slashy.ge All rights reserved.</p>
    </div>
    </div>  
}