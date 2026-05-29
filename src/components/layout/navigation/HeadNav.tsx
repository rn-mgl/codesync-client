import { useSession } from "next-auth/react";
import { FaBars } from "react-icons/fa6";

const HeadNav = (props: {
  showSideNav: boolean;
  handleShowSideNav: () => void;
}) => {

  const {data : session} = useSession()
  const user = session?.user

  return (
    <div className="w-full flex flex-row items-center justify-between p-4 bg-neutral-800 rounded-md">
      <div className="flex flex-row items-center justify-start gap-2 bg-inherit">
        <button
          onClick={props.handleShowSideNav}
          className="p-2 rounded-full bg-inherit transition-all l-s:hidden"
        >
          <FaBars className="text-secondary" />
        </button>
        <p className="text-sm font-medium text-secondary">
          {user?.name}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary" />
    </div>
  );
};

export default HeadNav;
