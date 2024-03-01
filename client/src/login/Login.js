import { Footer } from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import {Helmet, HelmetProvider} from "react-helmet-async"

const Login = () => {
  const [emailPhoneInput, setEmailPhoneInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const SubmitLoginForm = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
          const request = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login_user`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  emailPhone: emailPhoneInput,
                  password: passwordInput,
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
          Slashy შესვლა
        </title>
      </Helmet>
    <div className="xxs:flex xs:block xxs:items-center xxs:justify-center sm:block p-7">
        <a href="/">
            <img loading="lazy" width={150} height={150} src="https://prestashop.dostguru.com/ES18/PS_Electronics03/img/electronic-store-logo-1527842815.jpg" alt="logo"></img>
        </a>
    </div>
      <section className="flex items-center justify-center">
        <div className="flex h-full flex-[6] flex-col justify-center px-6 py-12 lg:px-8">
          <div className="h-[450px]">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className="mt-10 text-gray-800 text-center text-lg font-bold leading-9 tracking-tight text-gray-900">
                შესვლა
              </h1>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-3" onSubmit={SubmitLoginForm}>
                <Fragment>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ტელეფონის ნომერი ან მეილი
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setEmailPhoneInput(e.target.value)}
                      value={emailPhoneInput}
                      id="email"
                      name="email"
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
                      name="password"
                      onChange={(e) => setPasswordInput(e.target.value)}
                      value={passwordInput}
                      type="password"
                      required
                      className="block px-3 w-full rounded-md py-1.5 text-gray-900 shadow-sm border outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(237,123,82)] sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className={`text-[10px] ${message === "წარმატებით დასრულდა" ? "text-green-500" : "text-red-500"} font-semibold`}>{message}</p>

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
                არ გაქვს ექაუნთი?{" "}
                <a
                  href="/register"
                  className="font-semibold leading-6 text-[rgb(237,123,82)] hover:text-[rgb(225,123,70)]"
                >
                  რეგისტრაცია
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

export default Login;