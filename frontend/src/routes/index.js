import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { customerRoutes } from "./customersRoutes";
import { mainRoutes } from "./mainRoutes";
import { accountRoutes } from "./accountRoutes";
import { cartRoutes } from "./cartRouters";
import { paymentRoutes } from "./payRouters";

const publicRoutes = [...mainRoutes, ...customerRoutes, ...productRoutes];

const privateRoutes = [
  ...paymentRoutes,
  ...employeeRoutes,
  ...accountRoutes,
  ...cartRoutes,
];

export { publicRoutes, privateRoutes };
