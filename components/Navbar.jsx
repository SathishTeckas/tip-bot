import React, { useMemo } from "react";
import { Home, About, Wallet, Telegram } from "../public/icons/sidebarIcon";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

const menuItems = [
  { id: 1, label: "Home", icon: Home, link: "/" },
  { id: 2, label: "Deposit / Withdraw", icon: Wallet, link: "/deposit" },
  { id: 4, label: "About", icon: About, link: "/about" },
  { id: 3, label: "Telegram App", icon: Telegram, link: "https://t.me/aurora_tip_bot" },
];

const NavBar = () => {
  const router = useRouter();

  const activeMenu = useMemo(() => menuItems.find((menu) => menu.link === router.pathname), [router.pathname]);

  const getNavItemClasses = (menu) => {
    return classNames("flex items-center cursor-pointer flex hover:bg-backgroundColorLight2 rounded-full px-5 w-full overflow-hidden whitespace-nowrap", {
      "bg-backgroundColorLight2": activeMenu?.id === menu.id,
    });
  };

  return (
    <div>
      <nav className="flex bg-navBarBackground pt-20">
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
              <Link href={menu.link || "#"} className="flex py-4 items-center justify-center w-full h-full">
                <div>
                  <Icon colors={activeMenu?.id === menu.id ? colots2 : colors1} />
                </div>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default NavBar;
