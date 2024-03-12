import { Header } from "../Header"
import { Navigation } from "../Navigation"
import {TrendingProducts} from "../TrendingProducts"
import {Footer} from "../Footer"
import { Fragment, Suspense, lazy } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"

const VideoProducts = lazy(() => import("../VideoProducts"))
const HotCategories = lazy(() => import("../HotCategories"))
const NewProducts = lazy(() => import("../NewProducts"))
const BestDeals = lazy(() => import("../BestDeals"))

export const Landing = () => {
  return <Fragment>
    <HelmetProvider>
    <Helmet>
        <meta
          name="description"
          content="უფასო მიწოდება უამრავ ნივთზე. მიიღეთ საუკეთესო შოპინგის გამოცდილება. ისარგებლეთ საუკეთესო ფასებით და დიდი შეთავაზებებით ყოველდღიური საჭირო ნივთების და სხვა პროდუქტების უდიდეს არჩევანზე, მათ შორის მოდაზე, სახლზე, სილამაზეზე, ელექტრონიკაზე, სპორტული, სათამაშოები, შინაური ცხოველები, ბავშვები, წიგნები, ვიდეო თამაშები, საოფისე მასალები და მეტი."
        />
        <meta
          name="keywords"
          content="Slash, ჩინეთიდან, ამერიკიდან, გერმანიიდან, ინგლისიდან, ონლაინ შოპინგი, ონლაინ მაღაზია, დაბალი ფასი, საუკეთესო ფასი, წიგნები, წიგნის მაღაზია, ჟურნალი, გამოწერა, მუსიკა, CD, DVD, ვიდეო, ელექტრონიკა, ვიდეო თამაშები, კომპიუტერები, მობილური ტელეფონები, სათამაშოები, თამაშები, ტანსაცმელი, აქსესუარები, ფეხსაცმელი, სამკაულები, საათები, საოფისე პროდუქტები, სპორტი და ღია ცის ქვეშ, სპორტული საქონელი, ბავშვის პროდუქტები, ჯანმრთელობა, პირადი მოვლა, სილამაზე, სახლი, ბაღი, საწოლი და აბაზანა, ავეჯი, ხელსაწყოები, აპარატურა, მტვერსასრუტები, გარე საცხოვრებელი, ავტომობილების ნაწილები, შინაური ცხოველების მარაგი"
        />
        <link rel="canonical" href="https://Slash.ge" />
        <title>Slash.ge. ონლაინ მაღაზია. საუკეთესო ფასები.</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="პროდუქცია უცხოეთიდან - Slash" />
        <meta
          property="og:description"
          content="ჩვენ გთავაზობთ შეიძინოთ უცხოეთში დამზადებული ნივთები დაბალ ფასად - Slash"
        />
        <meta
          property="og:image"
          content="https://frontend.cjdropshipping.com/cj-web-egg-config-resource/cj/share1200x900.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content="https://Slash.ge/" />
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
    </Helmet>
    </HelmetProvider>
      <Header></Header>
      <section id="closeScroll" className="sm:w-[83%] lg:w-[77%] xxs:w-full m-auto">
        <Navigation></Navigation>
        <main className="sm:w-full xs:w-[90%] xxs:w-[80%] m-auto">
          <TrendingProducts />
            <Suspense fallback={<div>hello</div>}>
              <NewProducts></NewProducts>
            </Suspense>
            <Suspense fallback={<div>hello</div>}>
              <VideoProducts></VideoProducts>
            </Suspense>
            <Suspense fallback={<div>hello</div>}>
              <BestDeals></BestDeals>
            </Suspense>
            <Suspense fallback={<div>hello</div>}>
              <HotCategories></HotCategories>
            </Suspense>
        </main>
      </section>
      <section className="mt-20">
        <Footer />
      </section>
  </Fragment>
}