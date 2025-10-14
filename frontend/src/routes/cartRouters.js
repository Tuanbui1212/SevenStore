import Cart from "../pages/Cart";

import OnlyHeader from "../components/Layout/OnlyHeader";

export const cartRoutes = [
  {
    path: "/cart",
    component: Cart,
    layout: OnlyHeader,
  },
];
