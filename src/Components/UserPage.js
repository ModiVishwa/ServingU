import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";  
import { auth, my_db } from "../Configure";
import { Link } from "react-router-dom";
import DataCard from "./DataCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function UserPage() {
  const [tableData, setTableData] = useState([]);
  const [custom, setCustom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState("");
  const [options] = useState(["", "Home Cleaning", "Appliance Repair", "Salon"]); // Add your options here
  const [authent, setAuthent]=useState(false)
  const fetchValue = async () => {
    try {
      const mydbref = collection(my_db, "service_data");
      const querySnapshot = await getDocs(mydbref);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setAuthent(false);
        localStorage.removeItem("authenticated");
      } else {
        setAuthent(true);
        localStorage.setItem("authenticated", true);
        setCustom(user.displayName || "");
        const userId = user.uid;
        console.log("Current user ID:", userId);
        // You can do further processing with the userId here
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       setAuthent(false);
  //     } else {
  //       setAuthent(true);
  //       setCustom(user.displayName || "");
  //       const userId = user.uid;
  //       console.log("Current user ID:", userId);
  //       // You can do further processing with the userId here
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      let q = collection(my_db, "service_data");
      if (filterCategory.trim() !== "") {
        q = query(q, where("Category", "==", filterCategory.trim()));
      }
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      fetchedData.sort((a,b)=> new Date(b.date)-new Date(a.date))
      setTableData(fetchedData);
    };
    fetchData();
  }, [filterCategory]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = tableData.length;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1); // Reset page number when filter changes
  };
  
  return (
    <div>
    {localStorage.getItem("authenticated") === "true" ?(
      <div className="">
         <Navbar name={custom} />
        <div className="mt-24 ml-14 space-x-4 flex flex-wrap ">
          <select
            value={filterCategory}
            onChange={handleFilterChange}
            className="peer h-8 w-56 rounded-[7px] border border-[#ADBC9F] bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-400 placeholder-shown:border-t-red-400 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          >
            {options.map((option) => (
              <option key={option} value={option}>{option || "All"}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  p-5 ml-6 mt-0  ">
          {currentItems.map((value) => (
            <Link key={value.id} to={`/details/${value.id}`}>
              <DataCard data_details={value} />
            </Link>
          ))}
        </div>
        {/* Pagination controls */}
        <div className="flex justify-center ">
          <IoIosArrowBack 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1} 
            className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md
            ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
          />
          <div className="pl-2 text-center font-serif">{currentPage}</div>
          <IoIosArrowForward 
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= totalItems} 
            className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md
            ${indexOfLastItem >= totalItems?"cursor-not-allowed" : "cursor-pointer"}`}
            />
        </div>
      </div>
   ) : (
    <div className="h-screen bg-[#ADBC9F] flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg text-center">

      <p className="mb-10 text-3xl text-red-600">You need to sign in or sign up to access this page.</p>
      <div className="flex items-center justify-center ">
        <Link to="/" className="text-xl text-black mb-4 mr-4 hover:text-2xl">Sign In</Link>
        <Link to="/register" className="text-xl text-black mb-4 hover:text-2xl">Sign Up</Link>
      </div>
    </div>
    </div>
  )
  }
  </div>
  );
  
}

export default UserPage;
