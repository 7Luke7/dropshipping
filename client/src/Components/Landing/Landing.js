import { Header } from "../Header"
import { Navigation } from "../Navigation"
import {TrendingProducts} from "../TrendingProducts"
import {Footer} from "../Footer"
import { Fragment, Suspense, lazy, useEffect } from "react"

const VideoProducts = lazy(() => import("../VideoProducts"))
const HotCategories = lazy(() => import("../HotCategories"))
const NewProducts = lazy(() => import("../NewProducts"))
const BestDeals = lazy(() => import("../BestDeals"))

export const Landing = () => {
  useEffect(() => {
    document.title = "Slash.ge. ონლაინ მაღაზია. საუკეთესო ფასები."
  }, [])
  return <Fragment>
      <Header></Header>
      <section id="closeScroll" className="sm:w-[83%] lg:w-[77%] xxs:w-full m-auto">
        <Navigation></Navigation>
        <main className="sm:w-full xs:w-[90%] xxs:w-[80%] m-auto">
          <TrendingProducts />
            <Suspense fallback={<div>იტვირთება...</div>}>
              <NewProducts></NewProducts>
            </Suspense>
            <Suspense fallback={<div>იტვირთება...</div>}>
              <VideoProducts></VideoProducts>
            </Suspense>
            <Suspense fallback={<div>იტვირთება...</div>}>
              <BestDeals></BestDeals>
            </Suspense>
            <Suspense fallback={<div>იტვირთება...</div>}>
              <HotCategories></HotCategories>
            </Suspense>
        </main>
      </section>
      <section className="mt-20">
        <Footer />
      </section>
  </Fragment>
}