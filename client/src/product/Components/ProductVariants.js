import { Fragment, memo } from "react";
import { Variants } from "./Variants";

export const ProductVariants = memo(({changeVarientArr, varientList, warning}) => {
    return <div className="flex flex-col gap-3 mt-3 mb-3 xxs:max-h-[300px] lg:h-[235px] overflow-y-scroll overflow-x-none justify-start">
    {varientList && varientList.map((pv, index) => {
        return <Fragment key={index}>
            <p className="text-xs text-gray-900 font-semibosld">{pv.name}</p>
            <div className="pt-2 gap-2 flex flex-wrap">
            {pv.keyObj.map((v, i) => {
                return <Fragment key={i}>
                    <Variants v={v} i={i} pv={pv} changeVarientArr={changeVarientArr} warning={warning}></Variants>  
                </Fragment>
            })}
            </div> 
        </Fragment>
    })}
    
</div>
})

ProductVariants.displayName = "ProductVariants"