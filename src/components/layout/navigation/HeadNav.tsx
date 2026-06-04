import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa6";

const HeadNav = (props: {
  showSideNav: boolean;
  handleShowSideNav: () => void;
}) => {
  const { data: session } = useSession();
  const path = usePathname();
  const user = session?.user;

  return (
    <div className="w-full flex flex-row items-center justify-between p-4 bg-neutral-800 rounded-md">
      <div className="flex flex-row items-center justify-start gap-2 bg-inherit">
        <button
          onClick={props.handleShowSideNav}
          className="p-2 rounded-full bg-inherit transition-all l-s:hidden"
        >
          <FaBars className="text-secondary" />
        </button>
        <p className="text-sm font-medium text-secondary">{user?.name}</p>
      </div>
      <Link
        href="/codesync/profile"
        style={{ backgroundImage: `url(${user?.image})` }}
        className={`w-8 h-8 rounded-full bg-secondary ${path === "/codesync/profile" ? "border-2 border-info" : "border-0"} transition-all bg-center bg-cover`}
      />
    </div>
  );
};

export default HeadNav;
