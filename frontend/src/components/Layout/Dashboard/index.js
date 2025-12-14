import "../../GlobalStyles/GlobalStyles.scss";
import clsx from "clsx";

import Sidebar from "./Sidebar";

function Dashboard({ children }) {
  return (
    <div>
      <div className={clsx("container")}>
        <div className={clsx("row")}>
          <div className={clsx("col col-2 col-lg-3 col-md-3 display-sm-none")}>
            <Sidebar />
          </div>
          <div className={clsx("col col-10 col-lg-9 col-md-9")}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
