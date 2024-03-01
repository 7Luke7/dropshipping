import { memo } from "react"

export const ChildCategories = memo(({product}) => {
    const categoryIds = product && product.CategoryIds && product.CategoryIds.split(",")

    return (
        <div className="flex xxs:hidden lg:flex sm:flex">
            {product && product.CATEGORY && product.CATEGORY.includes("&gt;") ? product.CATEGORY.split("&gt;").map((a, i) => {
                return (
                    <div key={i} className="flex items-center pb-1">
                        <a href={`/search?category=${categoryIds[i]}&page=1`} className="xxs:text-[13px] lg:text-xs cursor-pointer text-blue-500 underline">{a}</a>
                        {categoryIds.length !== i + 1 && <span className="text-xs">\</span>}
                    </div>
                );
            }) : product && product.CATEGORY && product.CATEGORY.includes("/") ? product.CATEGORY.split("/").map((a, i) => {
                return (
                    <div key={i} className="flex items-center">
                        <a href={`/search?category=${categoryIds[i]}&page=1`} className="lg:text-xs xxs:text-[13px] cursor-pointer text-blue-500 underline">{a}</a>
                        {i < product.CATEGORY.split("/").length - 1 && <span>\</span>}
                    </div>
                );
            }) : null}
        </div>
    );
    
})

ChildCategories.displayName = "ChildCategories"