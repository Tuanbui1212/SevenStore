import "../../GlobalStyles/GlobalStyles.scss";
import clsx from "clsx";

import Sidebar from "./Sidebar";
import { useState } from "react";

function Dashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(2);

  return (
    <div>
      <div className={clsx("container")}>
        <div className={clsx("row")}>
          <div
            className={clsx(
              `col col-${isCollapsed} col-lg-3 col-md-3 display-sm-none`
            )}
          >
            <Sidebar onToggle={(val) => setIsCollapsed(val)} />
          </div>
          <div
            className={clsx(`col col-${12 - isCollapsed} col-lg-9 col-md-9`)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
