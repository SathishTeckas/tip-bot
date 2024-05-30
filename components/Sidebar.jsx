import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect } from "react";
import {
  Home,
  About,
  Wallet,
  Telegram,
} from "../public/icons/sidebarIcon";
import useWindowDimensions from "./../hooks/useWindowDimensions";

const menuItems = [
  { id: 1, label: "Home", icon: Home, link: "/" },
  { id: 2, label: "Deposit / Withdraw", icon: Wallet, link: "/deposit" },
  { id: 4, label: "About", icon: About, link: "/about" },
  { id: 3, label: "Telegram App", icon: Telegram, link: process.env.NEXT_PUBLIC_BOT_URL },
];

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const { height, width } = useWindowDimensions();
  const router = useRouter();

  const activeMenu = useMemo(() => menuItems.find((menu) => menu.link === router.pathname), [router.pathname]);

  const wrapperClasses = classNames("h-screen px-4 pt-8 pb-4 mt-20 z-20 bg-backgroundColorLight fixed flex justify-between flex-col", {
    "w-80": !toggleCollapse,
    "w-26": toggleCollapse,
  });

  const collapseIconClasses = classNames("p-4 rounded", {
    "rotate-180": toggleCollapse,
  });

  const getNavItemClasses = (menu) => {
    return classNames("flex items-center cursor-pointer py-4 mt-4 hover:bg-backgroundColorLight2 rounded-full px-5 w-full overflow-hidden whitespace-nowrap", {
      "bg-backgroundColorLight2": activeMenu?.id === menu.id,
    });
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  useEffect(() => {
    if (width <= 1100) {
      setToggleCollapse(true);
    }

    if (width >= 1100) {
      setToggleCollapse(false);
    }
  }, [width]);

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div className={wrapperClasses} onMouseEnter={onMouseOver} onMouseLeave={onMouseOver} style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}>
      <div className="flex flex-col">
        <div className="flex relative w-full items-center justify-center bg-textBackgroundLight h-8">
          <button className={collapseIconClasses} onClick={handleSidebarToggle}>
            {/* Replace CollapsIcon with an actual icon */}
          </button>
        </div>

        <div className="flex flex-col items-start mt-16">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            const colors1 = {
              stopColor1: "#074A5F",
              stopColor2: "#048B5B",
            };

            const colots2 = {
              stopColor1: "#5FD149",
              stopColor2: "#2C8F6A",
            };
            return (
              <div key={menu.id} className={classes}>
                <Link href={menu.link || "#"} className="flex py-4 items-center w-full h-full">
                  <div className="w-full h-full flex items-center">
                    <div>
                      <Icon colors={activeMenu?.id === menu.id ? colots2 : colors1} />
                    </div>
                    {!toggleCollapse && (
                      <span className={classNames("text-md font-medium ml-5 text-text-light")}>
                        {menu.label}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
