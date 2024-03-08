import { Footer } from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import check from "../public/check.svg"
import {Helmet, HelmetProvider} from "react-helmet-async"
import Logo from "../public/slashy_logo.webp"

const Register = () => {
  const [emailPhoneInput, setEmailPhoneInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [message, setMessage] = useState("")
  
  const navigate = useNavigate()

  const SubmitRegForm = async (e) => {
      e.preventDefault()
      setMessage("")
      try {
          const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/register_user`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  emailPhone: emailPhoneInput.trim(),
                  password: passwordInput.trim(),
              }),
              credentials: "include"
          })
  
          const message = await request.json()

          if (!request.ok) {
              throw new Error(message.message)
          }
          
          const purchaseVariantId = sessionStorage.getItem("purchaseVariantId")
          if (purchaseVariantId) {
            setMessage(message.message)
            navigate(`/purchase/${purchaseVariantId}`)
          } else {
            setMessage(message.message)               
            navigate("/")
          }
      } catch (error) {
          setMessage(error.message)
      }
  }

  return (
    <HelmetProvider>
      <Fragment>
      <Helmet>
        <title>
          Slash რეგისტრაცია
        </title>
      </Helmet>
    <div className="xxs:flex xs:block xxs:items-center xxs:justify-center sm:block p-7">
        <a href="/">
          <img loading="lazy" className="xxs:w-[80px] lg:w-[90px] object-cover xxs:h-[50px] lg:h-[40px]" src={Logo} alt="ლოგო"></img>
        </a>
    </div>
      <section className="flex sm:mb-0 xxs:w-[95%] sm:w-[95%] lg:w-[80%] m-auto justify-between">
        <div className="h-full xxs:hidden sm:block flex-[6]">
          <ul className="flex gap-4 pl-5 flex-col justify-center h-[450px]">
            <div className="flex flex-col space-y-3">
              <li className="pl-3 text-sm text-gray-800 font-semibold">
                პოპულარული პროდუქტები
                <div className="flex">
                <img decoding="lazy" src={check} alt="გთავაზობთ"></img>
                  <p className="pl-2 w-full text-xs font-normal">
                    იყავით სინქრონიზებული უახლეს მოთხოვნებთან. გამოიკვლიეთ და
                    ხელახლა განსაზღვრეთ თქვენი სტილი ძალისხმევის გარეშე ჩვენი
                    მოთხოვნადი ნივთებით.
                  </p>
                </div>
              </li>
              <li className="pl-3 text-sm text-gray-800 font-semibold">
                მაღალი ხარისხი
                <div className="flex">
                <img decoding="lazy" src={check} alt="გთავაზობთ"></img>
                  <p className="pl-2 w-full text-xs font-normal">
                    ჩვენი პროდუქტები აკმაყოფილებს ინდუსტრიის სტანდარტებს
                    ხარისხსა და გამძლეობას. ისიამოვნეთ შერჩეული არჩევანით,
                    რომელიც აერთიანებს ფუნქციონალურ ხელმისაწვდომობას.
                  </p>
                </div>
              </li>
              <li className="pl-3 sm:hidden xl:block text-sm text-gray-800 font-semibold">
                სწრაფი მიწოდება
                <div className="flex">
                <img decoding="lazy" src={check} alt="გთავაზობთ"></img>
                  <p className="pl-2 w-full text-xs font-normal">
                    ჩვენ ვუზრუნველყოფთ თქვენი შეკვეთების მიღებას თქვენთან
                    დაუყოვნებლივ. ისარგებლეთ სწრაფი მიწოდების მოხერხებულობით,
                    მიიყვანეთ თქვენი შესყიდვები თქვენს კარამდე უმალვე.
                  </p>
                </div>
              </li>
              <li className="pl-3 text-gray-800 text-sm font-semibold">
                დაბალი ფასები
                <div className="flex">
                <img src={check} decoding="lazy" alt="გთავაზობთ"></img>
                  <p className="pl-2 w-full text-xs font-normal">
                    შეიძინეთ ჩვენი მრავალფეროვანი ხარისხის პროდუქცია შეუდარებელ
                    ფასებში. ისიამოვნეთ დიდი გარიგებებით თქვენი ბიუჯეტის
                    კომპრომისის გარეშე. იყიდეთ ჭკვიანურად, დაზოგეთ მეტი.
                  </p>
                </div>
              </li>
            </div>
          </ul>
        </div>
        <div className="flex h-full flex-[6] flex-col justify-center px-6 py-12 lg:px-8">
          <div className="h-[450px]">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className="mt-10 text-gray-800 text-center text-lg font-bold leading-9 tracking-tight text-gray-900">
                გაიარე რეგისტრაცია
              </h1>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-3" onSubmit={SubmitRegForm}>
                <Fragment>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ტელეფონის ნომერი ან მეილი
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      value={emailPhoneInput}
                      onChange={(e) => setEmailPhoneInput(e.target.value)}
                      required
                      className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm border outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                    />
                  </div>
                </Fragment>

                <Fragment>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    პაროლი
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      name="password"
                      type="password"
                      required
                      className="block px-3 w-full rounded-md py-1.5 text-gray-900 shadow-sm border outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className={`text-[10px] ${message === "რეგისტრაცია წარმატებით დასრულდა" ? "text-green-500" : "text-red-500"} font-semibold`}>{message}</p>
                </Fragment>

                <Fragment>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[rgb(237,123,82)] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[rgb(225,123,70)]"
                  >
                    გაგრძელება
                  </button>
                </Fragment>
              </form>

              <p className="mt-4 text-center text-[13px] text-gray-500">
                გაქვს ექაუნთი?{" "}
                <a
                  href="/login"
                  className="font-semibold leading-6 text-[rgb(237,123,82)] hover:text-[rgb(225,123,70)]"
                >
                  შესვლა
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </Fragment>
    </HelmetProvider>
  );
};

export default Register;