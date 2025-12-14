import Employee from "../pages/Employee/List";
import CreateEmployee from "../pages/Employee/Create";
import EditEmployee from "../pages/Employee/Edit";
import TrashEmployee from "../pages/Employee/Trash";

import Dashboard from "../components/Layout/Dashboard";

export const employeeRoutes = [
  {
    path: "/dashboard/employee",
    component: Employee,
    layout: Dashboard,
  },
  {
    path: "/dashboard/employee/create",
    component: CreateEmployee,
    layout: null,
  },
  {
    path: "/dashboard/employee/trash",
    component: TrashEmployee,
    layout: null,
  },
  {
    path: "/dashboard/employee/:id",
    component: EditEmployee,
    layout: null,
  },
];
