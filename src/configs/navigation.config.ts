import { IconType } from "react-icons";
import { FaChartBar, FaFlag, FaStar, FaTags } from "react-icons/fa";
import { FaFileCode, FaLightbulb } from "react-icons/fa6";

export const BASE_NAVIGATIONS: { name: string; url: string; icon: IconType }[] =
  [
    {
      name: "Dashboard",
      url: "/codesync",
      icon: FaChartBar,
    },
    {
      name: "Problems",
      url: "/codesync/problems",
      icon: FaFlag,
    },
    {
      name: "Topics",
      url: "/codesync/topics",
      icon: FaTags,
    },
    {
      name: "Hints",
      url: "/codesync/hints",
      icon: FaLightbulb,
    },
    {
      name: "Test Cases",
      url: "/codesync/test-cases",
      icon: FaFileCode,
    },
    {
      name: "Achievements",
      url: "/codesync/achievements",
      icon: FaStar,
    },
    // {
    //   name: "Sessions",
    //   url: "/codesync/sessions",
    //   icon: FaHourglass,
    // },
    // {
    //   name: "Friends",
    //   url: "/codesync/friends",
    //   icon: FaUser,
    // },
  ];
