"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackIcon from "@/components/icons/BackIcon";
import SidebarIcon from "@/components/icons/SidebarIcon";

import { authorizedUserSidebar, unauthorizedUserSidebar } from "@/utils/config";
import type { SidebarItem } from "@/utils/interface";
import { ROUTES } from "@/utils/enums";
import type { RootState } from "@/redux";
import { getUserState } from "@/redux/userSlice";

const Sidebar = () => {
  const pathname = usePathname(); // Get current url
  const user = useSelector((store: RootState) => getUserState(store));
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebarOpen = () => setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility in mobile device

  return (
    <React.Fragment>
      <Button className="fixed left-4 top-4 h-12 w-12 rounded-full text-white lg:hidden" onClick={toggleSidebarOpen}>
        <SidebarIcon color="white" />
      </Button>

      <div
        className={`fixed top-0 flex flex-col justify-between ${isSidebarOpen ? "left-0" : "-left-64"} z-10 h-full w-60 bg-white p-4 shadow-xl transition-all duration-300 lg:left-0 lg:shadow-none xl:w-80`}
      >
        <div className="flex flex-col">
          <button className="flex items-center p-2 pb-4 lg:hidden" onClick={toggleSidebarOpen}>
            <BackIcon color="black" />
            <p className="ml-2">Close</p>
          </button>

          {user
            ? authorizedUserSidebar.map((item: SidebarItem) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`my-1 flex w-full items-center rounded-xl p-3 hover:bg-secondary [&>p]:hover:text-primary [&_path]:hover:stroke-primary ${pathname === item.href && "bg-secondary text-primary [&_path]:stroke-primary"}`}
                >
                  {React.createElement(item.icon, { color: "black" })}
                  <p className="ml-3">{item.name}</p>
                </Link>
              ))
            : unauthorizedUserSidebar.map((item: SidebarItem) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`my-1 flex w-full items-center rounded-xl p-3 hover:bg-secondary [&>p]:hover:text-primary [&_path]:hover:stroke-primary ${pathname === item.href && "bg-secondary text-primary [&_path]:stroke-primary"}`}
                >
                  {React.createElement(item.icon, { color: "black" })}
                  <p className="ml-3">{item.name}</p>
                </Link>
              ))}
        </div>

        {user && (
          <div className="flex items-center p-2">
            <UserButton afterSignOutUrl={ROUTES.HOMEPAGE} />
            <h1 className="ml-3">{user.name}</h1>
          </div>
        )}

        <Separator orientation="vertical" className="absolute right-0 top-0 h-screen" />
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
