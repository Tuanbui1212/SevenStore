import "../../GlobalStyles/GlobalStyles.scss";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

function Dashboard({ children }) {
  // isCollapsed = 2 (expanded), 0 (collapsed)
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 1024 ? 0 : 2
  );
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 740 : false
  );

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobileView(w < 740);
      if (w < 1024) {
        setIsCollapsed(0);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebarOffset = isCollapsed === 2 ? "260px" : "80px";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar onToggle={(val) => setIsCollapsed(val)} />

      <div
        style={{
          flexGrow: 1,
          marginLeft: sidebarOffset,
          transition: "margin-left 0.3s ease-in-out",
          width: `calc(100% - ${sidebarOffset})`,
          minWidth: 0,
          padding: isMobileView ? "12px" : "24px 28px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
