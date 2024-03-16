import { Helmet } from "react-helmet-async";
import { Header } from "../Components/Header"
import searchNav from "../Components/searchNav.json"
import { Fragment, useEffect, useState } from "react"

const Category = () => {
    const [inputText, setInputText] = useState("");
    const [filteredCategoriesState, setFilteredCategoriesState] = useState([])
    const inputHandler = (e) => {
        //convert input text to lower case
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    useEffect(() => {
        const filteredCategories = searchNav.map((cat) => {
            const filteredChildren = cat.children.map((c) => {
              const filteredSubcategories = c.children.filter((subc) => {
                return (
                  inputText === "" ||
                  subc.nameEn.toLowerCase().includes(inputText) ||
                  c.nameEn.toLowerCase().includes(inputText) ||
                  cat.nameEn.toLowerCase().includes(inputText)
                );
              });
          
              // Include the current child only if it has filtered subcategories
              return filteredSubcategories.length > 0 ? { ...c, children: filteredSubcategories } : null;
            });
          
            // Include the current category only if it has filtered children
            const categoryWithFilteredChildren = filteredChildren.filter(Boolean);
            return categoryWithFilteredChildren.length > 0 ? { ...cat, children: categoryWithFilteredChildren } : null;
          });
          
          // Update the state with the filtered categories or original categories based on inputText
          setFilteredCategoriesState(inputText === "" ? searchNav : filteredCategories.filter(Boolean));
    }, [inputText])

    return <Fragment>
            <Helmet>
                <title>Slash - კატეგორიები</title>
            </Helmet>
        <Header></Header>
        <div id="closeScroll" className="mt-10 w-[70%] m-auto">
      <input onChange={inputHandler} value={inputText} className="shadow w-[20%] ml-5 appearance-none border border-t-0 border-l-0 border-r-0 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" autoFocus={true} placeholder="სასურველი კატეგორია" />
    <hr className="border-2 mt-3 border-[rgb(251,77,1)] ml-5" />
        <Fragment>
        <main className="p-5">
        {inputText !== "" ? filteredCategoriesState.map((cat, i) => {
            return (
                <ul key={i} className="grid grid lg:grid-cols-5 xxs:grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 pt-4 gap-10">
                    {cat.children.map((c, ind) => {
                        return <li key={ind} className="text-sm text-gray-700 font-bold">
                            <a href={`/search?category=${c.id}&page=1`}>
                                {c.nameEn}
                            </a>
                            
                            <menu>
                                {c.children.map((subc, index) => {
                                    return <li key={index} className="text-xs pt-2 text-gray-400 font-normal">
                                        <a className="w-min" href={`/search?category=${subc.id}&page=1`}>
                                            <h3 className="lg:hover:text-[rgb(251,77,1)]">
                                                {subc.nameEn}
                                            </h3>
                                        </a>
                                    </li>
                                })}
                            </menu>
                        </li>
                    })}
                </ul>
            );
          }) : searchNav.map((cat, i) => {
            return (
                <ul key={i} className="grid lg:grid-cols-5 xxs:grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 pt-4 gap-10">
                    {cat.children.map((c, ind) => {
                        return <li key={ind} className="text-sm text-gray-700 font-bold">
                            <a href={`/search?category=${c.id}&page=1`}>
                            {c.nameEn}
                            </a>
                            
                            <menu>
                                {c.children.map((subc, index) => {
                                    return <li key={index} className="text-xs pt-2 text-gray-400 font-normal">
                                            <a href={`/search?category=${subc.id}&page=1`}>
                                                <h3 className="lg:hover:text-[rgb(251,77,1)]">
                                                    {subc.nameEn}
                                                </h3>
                                        </a>
                                    </li>
                                })}
                            </menu>
                        </li>
                    })}
                </ul>
            );
          })}
        </main>
        </Fragment>
        </div>
    </Fragment>
} 

export default Category