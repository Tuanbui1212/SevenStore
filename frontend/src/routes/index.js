import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { customerRoutes } from "./customersRoutes";
import { mainRoutes } from "./mainRoutes";
import { accountRoutes } from "./accountRoutes";
import { cartRoutes } from "./cartRouters";
import { paymentRoutes } from "./payRouters";
import { orderRoutes } from "./orderRoutes";

const publicRoutes = [...mainRoutes];

const privateRoutes = [
  ...paymentRoutes,
  ...employeeRoutes,
  ...accountRoutes,
  ...cartRoutes,
  ...orderRoutes,
  ...productRoutes,
  ...customerRoutes,
];

export { publicRoutes, privateRoutes };
