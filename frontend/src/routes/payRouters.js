import Payment from "../pages/Payment";

import OnlyHeader from "../components/Layout/OnlyHeader";

export const paymentRoutes = [
  {
    path: "/payment",
    component: Payment,
    layout: OnlyHeader,
  },
];
