import "../../GlobalStyles/GlobalStyles.scss";
import Sidebar from "./Sidebar";
import { useState } from "react";

function Dashboard({ children }) {
  // isCollapsed = 2 (expanded), 0 (collapsed)
  const [isCollapsed, setIsCollapsed] = useState(2);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f7f6" }}>
      <Sidebar onToggle={(val) => setIsCollapsed(val)} />
      
      <div
        style={{
          flexGrow: 1,
          marginLeft: isCollapsed === 2 ? "260px" : "80px",
          transition: "margin-left 0.3s ease-in-out",
          width: `calc(100% - ${isCollapsed === 2 ? '260px' : '80px'})`,
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
