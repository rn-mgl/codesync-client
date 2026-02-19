import { IconType } from "react-icons";
import {
  FaRegChartBar,
  FaRegFlag,
  FaRegHourglass,
  FaRegStar,
  FaRegUser,
} from "react-icons/fa";

export const BASE_NAVIGATIONS: { name: string; url: string; icon: IconType }[] =
  [
    {
      name: "Dashboard",
      url: "/codesync",
      icon: FaRegChartBar,
    },
    {
      name: "Problems",
      url: "/codesync/problems",
      icon: FaRegFlag,
    },
    {
      name: "Achievements",
      url: "/codesync/achievements",
      icon: FaRegStar,
    },
    {
      name: "Sessions",
      url: "/codesync/sessions",
      icon: FaRegHourglass,
    },
    {
      name: "Friends",
      url: "/codesync/friends",
      icon: FaRegUser,
    },
  ];
