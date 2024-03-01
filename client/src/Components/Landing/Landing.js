import { Header } from "../Header"
import { Navigation } from "../Navigation"
import {TrendingProducts} from "../TrendingProducts"
import {BestDeals} from "../BestDeals"
import {Footer} from "../Footer"
import {NewProducts} from "../NewProducts"
import {HotCategories} from "../HotCategories"
import {VideoProducts} from "../VideoProducts"
import { Fragment, useEffect, useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"

function observeElement(id, callback) {
  const element = document.getElementById(id);

  if (!element) return;

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    });
  }, options);

  observer.observe(element);
}

export const Landing = () => {
  const [firstLoad, setFirstLoad] = useState(false)
  const [secondLoad, setSecondLoad] = useState(false)
  const [thirdLoad, setThirdLoad] = useState(false)
  const [fourthLoad, setFourthLoad] = useState(false)

  useEffect(() => {
    if (!firstLoad) {
      observeElement('test1', () => setFirstLoad(true));
    }
    if (firstLoad) {
      observeElement('test2', () => setSecondLoad(true));
    }
    if (secondLoad) {
      observeElement('test3', () => setThirdLoad(true));

    }
    if (thirdLoad) {
      observeElement('test4', () => setFourthLoad(true));
    }
  }, [firstLoad, secondLoad, thirdLoad]);


  return <Fragment>
    <HelmetProvider>
    <Helmet>
        <meta
          name="description"
          content="უფასო მიწოდება უამრავ ნივთზე. მიიღეთ საუკეთესო შოპინგის გამოცდილება. ისარგებლეთ საუკეთესო ფასებით და დიდი შეთავაზებებით ყოველდღიური საჭირო ნივთების და სხვა პროდუქტების უდიდეს არჩევანზე, მათ შორის მოდაზე, სახლზე, სილამაზეზე, ელექტრონიკაზე, სპორტული, სათამაშოები, შინაური ცხოველები, ბავშვები, წიგნები, ვიდეო თამაშები, საოფისე მასალები და მეტი."
        />
        <meta
          name="keywords"
          content="Slashy, ჩინეთიდან, ამერიკიდან, გერმანიიდან, ინგლისიდან, ონლაინ შოპინგი, ონლაინ მაღაზია, დაბალი ფასი, საუკეთესო ფასი, წიგნები, წიგნის მაღაზია, ჟურნალი, გამოწერა, მუსიკა, CD, DVD, ვიდეო, ელექტრონიკა, ვიდეო თამაშები, კომპიუტერები, მობილური ტელეფონები, სათამაშოები, თამაშები, ტანსაცმელი, აქსესუარები, ფეხსაცმელი, სამკაულები, საათები, საოფისე პროდუქტები, სპორტი და ღია ცის ქვეშ, სპორტული საქონელი, ბავშვის პროდუქტები, ჯანმრთელობა, პირადი მოვლა, სილამაზე, სახლი, ბაღი, საწოლი და აბაზანა, ავეჯი, ხელსაწყოები, აპარატურა, მტვერსასრუტები, გარე საცხოვრებელი, ავტომობილების ნაწილები, შინაური ცხოველების მარაგი"
        />
        <link rel="canonical" href="https://slashy.ge" />
        <title>Slashy.ge. ონლაინ მაღაზია. საუკეთესო ფასები.</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="პროდუქცია უცხოეთიდან - Slashy" />
        <meta
          property="og:description"
          content="ჩვენ გთავაზობთ შეიძინოთ უცხოეთში დამზადებული ნივთები დაბალ ფასად - Slashy"
        />
        <meta
          property="og:image"
          content="https://frontend.cjdropshipping.com/cj-web-egg-config-resource/cj/share1200x900.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content="https://slashy.ge/" />
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
          <span id="test1"></span>
          {firstLoad && 
          <Fragment>
            <NewProducts firstLoad={firstLoad}></NewProducts>
            <span id="test2"></span>
          </Fragment>}
          {secondLoad && <Fragment>
              <VideoProducts secondLoad={secondLoad}></VideoProducts>
              <span id="test3"></span>
            </Fragment>}
          {thirdLoad && <Fragment>
              <BestDeals thirdLoad={thirdLoad}/>
              <span id="test4"></span>
            </Fragment>}
          {fourthLoad && <HotCategories fourthLoad={fourthLoad}></HotCategories>}
        </main>
      </section>
      <section className="mt-20">
        <Footer />
      </section>
  </Fragment>
}