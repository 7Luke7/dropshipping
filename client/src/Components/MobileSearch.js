import { Fragment, useEffect, useState } from 'react';
import Search from "../public/search.svg"
import List from "../public/list.svg"
import { useNavigate } from "react-router-dom";

export const MobileSearch = () => {
    const [searchValue, setSearchValue] = useState("")
    const [suggestion, setSuggestion] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        if (suggestion && suggestion.length > 0) {
            const removeSuggestion = () => {
                setSuggestion([]);
            }
                    
            document.addEventListener("click", removeSuggestion);
            document.addEventListener("scroll", removeSuggestion);
    
            return () => {
                document.removeEventListener("click", removeSuggestion);
                document.removeEventListener("scroll", removeSuggestion);
            };
        }
    }, [suggestion])

    const changeInput = async (inp) => {
        setSearchValue(inp)
        const request = await fetch("https://cjdropshipping.com/elastic-api/product/v1/suggester", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            cache: "force-cache",
            body: JSON.stringify({"keyWord": inp}),
        })

        if (!request.ok) {
            throw new Error(request.statusText)
        }

        const data = await request.json()
        setSuggestion(data.data.suggesterList)
    }

    const search = (e) => {
        e.preventDefault()
        if(searchValue === "") {
            return
        }
     
        setSuggestion([])
        navigate(`/search?page=1&keyword=${searchValue}`)
        setSearchValue("")
    }

    const displayBar = () => {
        const closeScroll = document.getElementById("closeScroll")
        const catBar = document.getElementById("catBar")

        catBar.style.display = "block"        
        closeScroll.style.overflow = "hidden"
        closeScroll.style.position = "fixed"
    }

    return <div className='sm:hidden w-[90%] m-auto justify-evenly items-center xxs:flex'>
    <Fragment>
        <button className='flex-[1] flex justify-center xxs:ml-2 xs:ml-1 w-[26px]' onClick={displayBar}>
    <img width={5} height={5} className="w-[24px] h-[24px]" src={List} alt="მენიუ"></img>
</button> 
    </Fragment>
    <form onSubmit={search} className="relative flex-[12] justify-between ml-3 items-center bg-slate-50">
        <div className='flex justify-between items-center h-[40px] w-full'>
            <input type='text' value={searchValue} onChange={(e) => changeInput(e.target.value)} className='pl-3 outline-none w-full bg-slate-50' placeholder='მოძებნე ინგლისურად...' />
            <button type='submit' className='p-3 sm:p-3 text-xl'>
                <img width={5} height={5} className="w-[24px] h-[24px]" alt="მოძებნე" src={Search}></img>
            </button>
        </div>
        {suggestion && suggestion.length > 0 && <ul className='flex absolute rounded-tr-none rounded-md rounded-tl-none flex-col pl-2 pt-1 top-0 bg-slate-50 shadow-2xl w-full translate-y-[40px] justify-between'> 
            {suggestion.map((sug, i) => {
                return <a href={`/search?page=1&keyword=${sug}`} key={i} className="rounded p-1" onClick={() =>  {
                    setSearchValue("")
                    setSuggestion([])
                }}>
                {sug}
            </a>
            })}
        </ul>
        }
    </form>
    </div>
}