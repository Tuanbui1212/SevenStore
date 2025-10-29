import Home from "../pages/Home";
import Service from "../pages/Service";
import Search from "../pages/Search";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";
import AboutUs from "../pages/AboutUS";

import DashBoard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

export const mainRoutes = [
  { path: "/", component: Home },
  { path: "/service", component: Service },
  { path: "/aboutUS", component: AboutUs },
  { path: "/search", component: Search },
  { path: "/login", component: Login, layout: OnlyHeader },
  { path: "/dashboard", component: () => <></>, layout: DashBoard },
  { path: "/product/:brand", component: Product },
  { path: "/product/:brand/:slug", component: ProductDetail },
];
