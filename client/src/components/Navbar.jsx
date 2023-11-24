import { FaAlignLeft } from "react-icons/fa";
import { useDashboardContext } from "../pages/DashboardLayout";
import LogoutContainer from "./LogoutContainer";
import logo from "../assets/images/slogan_main.png";

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <nav className="absolute flex justify-between h-32 w-screen bg-primary text-forth dark:bg-gray-800 pl-12 py-9 font-extrabold">
      <button
        type="button"
        className="relative text-forth text-2xl hover:cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaAlignLeft />
      </button>

      <img
        src={logo}
        alt="teacher test creator slogan"
        className="flex h-8 md:h-16 md:-mt-4"
      />

      <div className="mx-4">
        <LogoutContainer />
      </div>
    </nav>
  );
};

export default Navbar;
