import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "./Navbar";
import useWindowDimensions from "./../hooks/useWindowDimensions";
import Footer from "./footer";
import Header from "../components/header";

const Layout = ({ children }) => {
  const { height, width } = useWindowDimensions();
  const [mobileScreen, setMobileScreen] = useState(false);

  useEffect(() => {
    console.log(width);
    if (width <= 1000) {
      setMobileScreen(true);
    }
    if (width >= 1000) {
      setMobileScreen(false);
    }
  }, [width]);
  return (
    <div>
      <Header />
      {mobileScreen && (<NavBar />)}
      <div className="flex flex-row">
        {!mobileScreen && <Sidebar />}
        <div className="bg-white flex-1 p-4 text-white lg:pt-28 lg:pl-80 pb-32">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
