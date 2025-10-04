import Header from "../components/Header";

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DefaultLayout;
