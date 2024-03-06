import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Configure";
import { useNavigate } from "react-router-dom";
import { UilUserCircle, UilBars } from "@iconscout/react-unicons";
import toast from "react-hot-toast";

function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Change the breakpoint as per your design
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const onsignout = () => {
    signOut(auth).then(() => {
      navigate("/");
      toast.success('Signed Out!!')
    });
  };

  useEffect(() => {
    let Signin = localStorage.getItem("Signin");
    if (Signin == null) {
      navigate("/");
    }
  }, []);

  // Check if the user is an admin
  useEffect(() => {
    // Assuming you have a way to determine the user's role, such as from Firebase custom claims or user data
    if (props.name === "Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [props.name]);

  return (
    <div className="">
      <nav className="bg-[#436850] text-[#FBFADA] top-0 left-0 right-0 h-20 w-full fixed bottom-14 flex items-center justify-between px-4">
        <label className="text-[#FBFADA] font-serif text-lg md:text-lg lg:text-2xl xl:text-3xl">
          ServingU
        </label>
        {isSmallScreen ? (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center text-[#FBFADA] focus:outline-none"
            >
              <UilBars className="w-6 h-6 mr-2" />
            </button>
            {showMenu && (
              <ul className="absolute md:hidden lg:flex flex-col bg-[#436850] text-[#FBFADA] top-full right-0 mt-6 space-y-2">
                <li>
                  <Link
                    to="/homepage"
                    className={`block px-4 py-2 ${location.pathname === "/homepage" ? "text-blue-500" : ""}`}
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </li>
                 <li>
                  <Link
                    to="/appointment"
                    className={`block px-4 py-2 ${location.pathname === "/appointment" ? "text-blue-500" : ""}`}
                    onClick={toggleMenu}
                  >
                    Bookings
                  </Link>
                </li>
                {isAdmin && ( // Render the link only if the user is an admin
                  <li>
                    <Link
                      to="/private"
                      className={`block px-4 py-2 ${location.pathname === "/private" ? "text-blue-500" : ""}`}
                      onClick={toggleMenu}
                    >
                      Service
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#12372A]"
                    onClick={onsignout}
                  >
                    Sign Out
                  </button>
                </li>
                <li>
                  <div className="border-t border-white border-opacity-20" />
                </li>
                <li>
                  <div className="flex items-center px-4 py-2">
                    <UilUserCircle className="w-6 h-6 mr-2" />
                    <p className="text-sm md:text-base xl:text-lg capitalize">
                      {props.name ? props.name : "Please Login!"}
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <ul className="hidden md:flex lg:flex items-center space-x-4">
            <li>
              <Link to="/homepage" className={location.pathname === "/homepage" ? "text-blue-500 text-lg font-bold" : ""}>Home</Link>
            </li>
            <li>
              <Link to="/appointment" className={location.pathname === "/appointment" ? "text-blue-500 text-lg font-bold" : ""}>Bookings</Link>
            </li>
            {isAdmin && ( // Render the link only if the user is an admin
              <li>
                <Link to="/private" className={location.pathname === "/private" ? "text-blue-500 text-xl font-bold" : ""}>Service</Link>
              </li>
            )}
            <li>
              <button
                className="w-24 h-10 bg-[#12372A] text-[#FBFADA] text-sm font-semibold rounded-md"
                onClick={onsignout}
              >
                Sign Out
              </button>
            </li>
            <li className="border-white border-5">
              <UilUserCircle className="w-6 h-6 mx-3 md:w-8 md:h-8 lg:w-10 lg:h-10 cursor-pointer" />
              <p className="ml-4 text-sm md:text-base xl:text-lg capitalize">
                {props.name ? props.name : "Please Login!"}
              </p>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
