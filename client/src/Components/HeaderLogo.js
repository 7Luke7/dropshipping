import List from "../public/list.svg"

export const HeaderLogo = () => {
    const displayBar = () => {
        const closeScroll = document.getElementById("closeScroll")
        const catBar = document.getElementById("catBar")

        catBar.style.display = "block"        
        closeScroll.style.overflow = "hidden"
        closeScroll.style.position = "fixed"
    }
    return <div className='flex items-center sm:flex-[2] lg:flex-[1] gap-3 justify-start'>
    <div className='xxs:hidden sm:flex items-center lg:hidden'>
        <button className='w-[24px] h-[24px]' onClick={displayBar}>
        <img alt="მენიუს გახსნა" decoding="lazy" width={24} height={24} src={List}></img>
    </button> 
    </div>
    <a rel="alternate" href="/">
        <img width={140} height={120} decoding="lazy" src="https://prestashop.dostguru.com/ES18/PS_Electronics03/img/electronic-store-logo-1527842815.jpg" alt="ლოგო"></img>
    </a>
</div>
}