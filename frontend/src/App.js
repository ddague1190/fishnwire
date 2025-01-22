import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartScreen from "./pages/CartScreen";
import LoginScreen from "./pages/LoginScreen";
import { HomeScreen } from "./pages/HomeScreen";
import AboutUsScreen from "./pages/AboutUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ShippingScreen from "./pages/ShippingScreen";
import PlaceOrder from "./pages/PlaceOrder";
import OrderScreen from "./pages/OrderScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfileScreen from "./pages/profile/ProfileScreen";
import NotFound from "./pages/404";
import Brands from "./pages/Brands";
import { SpecViewer } from "./pages/SpecViewer";
import { getUserDetails } from "./redux/actions/userActions";
const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(()=>{
    dispatch(getUserDetails())
  },[dispatch])
  return (
    <Routes key={location.pathname}>
      <Route exact path="/" element={<HomeScreen />} />
      <Route path="/products/:url_cat/:url_subcat/" element={<ProductList />} />
      <Route path="/products/:url_cat/" element={<ProductList />} />
      <Route path="/products/" element={<ProductList />} />
      <Route path="/brands/:url_brand/" element={<ProductList />} />
      <Route path="/brands/" element={<Brands />} />
      {/* <Route path="/specification/" element={<SpecViewer />} /> */}
      <Route path="/featured/:url_cat/:url_subcat/" element={<ProductList />} />
      <Route path="/about" element={<AboutUsScreen />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/placeorder" element={<PlaceOrder />} />
      <Route path="/order/:id" element={<OrderScreen />} />
      <Route path="/product/:id/spec" element={<SpecViewer />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart/:id" element={<CartScreen />} />
      <Route path="/cart/" element={<CartScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
