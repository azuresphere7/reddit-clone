import HomeIcon from "@/components/icons/HomeIcon";
import MyPostsIcon from "@/components/icons/MyPostsIcon";
import LoginIcon from "@/components/icons/LoginIcon";
import type { SidebarItem } from "@/utils/interface";
import { ROUTES } from "@/utils/enums";

export const authorizedUserSidebar: SidebarItem[] = [
  {
    id: 1,
    name: "Home",
    href: ROUTES.HOMEPAGE,
    icon: HomeIcon,
  },
  {
    id: 2,
    name: "My posts",
    href: ROUTES.MY_POSTS,
    icon: MyPostsIcon,
  },
];

export const unauthorizedUserSidebar: SidebarItem[] = [
  {
    id: 1,
    name: "Home",
    href: ROUTES.HOMEPAGE,
    icon: HomeIcon,
  },
  {
    id: 2,
    name: "Log In",
    href: ROUTES.SIGN_IN,
    icon: LoginIcon,
  },
];
