import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Landing } from "./Components/Landing/Landing";
import NotFound from "./NotFound";
import Cart from "./cart/Cart";
import Dashboard from "./dashboard/Dashboard";
import Addresses from "./dashboard/addresses/Addresses";
import Login from "./login/Login";
import Layout from "./dashboard/layout";
import AddAddresses from "./dashboard/addresses/add/AddAddress"
import Register from "./register/Register";
import ViewMore from "./view-more/ViewMore"
import Boards from "./boards/Boards"
import Search from "./search/Search";
import Product from "./product/Product";
import Purchase from "./purchase/Purchase"
import Category from "./category/Category"

const App = () => {
  return  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="cart" element={<Cart />} />
    <Route path="dashboard" element={<Layout />}>
      <Route path="" element={<Dashboard />}></Route>
      <Route path="addresses" element={<Addresses />}></Route>
      <Route path="add" element={<AddAddresses />}></Route>
    </Route>
    <Route path="login" element={<Login />} />
    <Route path="view-more/:id" element={<ViewMore />} />
    <Route path="boards/:id" element={<Boards />} />
    <Route path="search" element={<Search />} />
    <Route path="register" element={<Register />} />
    <Route path="*" element={<NotFound />} />
    <Route path="product/:id" element={<Product />} />
    <Route path="category" element={<Category />} />
    <Route path="purchase/:id" element={<Purchase />} />
  </Routes>
</BrowserRouter>
}

export default App;
