import React, { useState } from "react";
// import { UilAngleDown, UilAngleUp } from "@iconscout/react-unicons";
// import arr from "../Images/lefta.svg";
import logo from "../Images/sidelogo.png";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa"

function Sidebar() {
  const [open, setOpen] = useState();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const Menu = [
    { id: 1, title: "Home Cleaning" },
    { id: 2, title: "Appliance Repair" },
    { id: 3, title: "Salon" },
  ];

  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  // };

  const toggleDropdownOnClick = () => {
    setOpen(!open);
    setShowDropdown(false);
  };

  return (
    <div>
      <div
        className={` ${
          open ? "w-72" : "w-24"
        } duration-300 h-screen bg-[#436850] fixed z-50 `}
      >
          {/* <button
            className="flex items-center justify-center w-7 h-7 p-2 absolute top-9 -right-4 bg-[#436850] rounded-full bg-border-black border-2"
            onClick={toggleDropdownOnClick}
          >
          <FaChevronRight/>
          </button> */}
        <div className="p-5 pt-5">
          <div className="flex gap-x-2 items-center">
            <img
              src={logo}
              alt=""
              className="cursor-pointer duration-500 bg-[#436850] mx-2 w-10 h-10"
            />
            <h1
              className={`text-[#FBFADA] origin-left font-medium text-xl duration-300 ${
                !open && "scale-0"
              }`}
            >
              ServingU
            </h1>
          </div>
          <div>
            <ul className="cursor-pointer mr-10 mt-5 flex flex-col space-y-4 text-[#FBFADA]  uppercase rounded">
            <li>
                <Link to="/homepage">Home</Link>
              </li>
              <li>
              <Link to="/private" className={location.pathname === "/private" ? "text-blue-500 text-lg font-semibold" : ""}>Service</Link>
            </li>
              <li>
              <Link to="/request/:id"  className={location.pathname === "/request/:id" ? "text-blue-500 text-lg font-semibold" : ""}>Request</Link>
              </li>
              {/* <li className="float-left">
                <span className="flex items-center cursor-pointer">
                  Services
                  {showDropdown ? (
                    <UilAngleUp
                      className={`ml-1 ${!open && "scale-0"}  `}
                      onClick={toggleDropdown}
                    />
                  ) : (
                    <UilAngleDown
                      className={`ml-1 ${!open && "scale-0"} `}
                      onClick={toggleDropdown}
                    />
                  )}
                </span>
              </li> */}
            </ul>
            {showDropdown && (
              <ul className="text-[#FBFADA] text-center  mt-2">
                {Menu.map((item) => (
                  <li
                    key={item.id}
                    className="text-md cursor-pointer hover:text-[#FBFADA] hover:font-bold duration-300  py-2  hover:bg-[#4E7D68] rounded-lg"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* <div className={` fixed p-7 text-2xl items-center justify-center font-semibold mx-24  ${open ? 'hidden' : ''}`}>
          <h1 className=" truncate"> Home Page</h1>
          
        </div> */}
      </div>
    </div>
  );
}

export default Sidebar;
