import { IconType } from "react-icons";
import { FaChartBar, FaFlag, FaStar, FaTags, FaTasks } from "react-icons/fa";
import { FaFileCode, FaKey, FaLightbulb, FaUser } from "react-icons/fa6";

type NAVIGATION = { name: string; url: string; icon: IconType }[];

export const BASE_NAVIGATIONS: NAVIGATION = [
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
  //   name: "Settings",
  //   url: "/codesync/settings",
  //   icon: FaGear,
  // },
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

const ADMIN_NAVIGATIONS: NAVIGATION = [
  {
    name: "Queue",
    url: "/codesync/queue?action=count",
    icon: FaTasks,
  },

  {
    name: "Roles",
    url: "/codesync/roles",
    icon: FaUser,
  },
  {
    name: "Permissions",
    url: "/codesync/permissions",
    icon: FaKey,
  },
];

const GUARDED_NAVIGATIONS: Record<string, NAVIGATION> = {
  "admin.actions": ADMIN_NAVIGATIONS,
};

export const getNavigations = (permissions: string[]) => {
  const NAVIGATIONS = [...BASE_NAVIGATIONS];

  for (const permission of permissions) {
    const value =
      GUARDED_NAVIGATIONS[permission as keyof typeof GUARDED_NAVIGATIONS];

    if (value !== undefined) {
      NAVIGATIONS.push(...value);
    }
  }

  return NAVIGATIONS;
};
