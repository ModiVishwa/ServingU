import React, { useEffect, useState } from "react";
import { auth, my_db } from "../Configure";
import { collection, updateDoc, doc, getDocs } from "firebase/firestore";
import Sidebar from "./Sidebar";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getAdditionalUserInfo, signOut } from "firebase/auth";
function RequestComponent() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage to 1
  const itemsPerPage = 4; // Number of items to display per page
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate("");
  const onsignout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };
  useEffect(() => {
    const checkAdminPrivileges = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Retrieve additional user info which includes custom claims
          const additionalUserInfo = await getAdditionalUserInfo(currentUser);
          const isAdmin = additionalUserInfo && additionalUserInfo.claims.admin;
          setIsAdmin(isAdmin);
        }
      } catch (error) {
        console.error("Error checking admin privileges:", error);
      }
    };
    checkAdminPrivileges();
  }, []);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(my_db, "requests"));
        const requestData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            userData: data.userData || {},
          };
        });
        requestData.sort((a,b)=> new Date(b.date)-new Date(a.date))
        setRequests(requestData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = requests.length;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };
  

  const handleApproval = async (newRequestId) => {
    try {
      const reqdocref = doc(my_db, "requests", newRequestId);
      await updateDoc(reqdocref, {
        status: "Approved !",
      });
      console.log("Request was approved");

      // Fetch updated requests
      const updatedReqSnapshot = await getDocs(collection(my_db, "requests"));
      const updatedReqData = updatedReqSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          userData: data.userData || {},
        };
      });
      setRequests(updatedReqData);
    } catch (error) {
      console.error("Error approving requests:", error);
    }
  };

  const handleComplete = async (newRequestId) => {
    try {
      const reqdocref = doc(my_db, "requests", newRequestId);
      await updateDoc(reqdocref, {
        status: "Completed!",
      });
      console.log("Request was completed");

      // Fetch updated requests
      const updatedReqSnapshot = await getDocs(collection(my_db, "requests"));
      const updatedReqData = updatedReqSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          userData: data.userData || {},
        };
      });
      setRequests(updatedReqData);
    } catch (error) {
      console.error("Error approving requests:", error);
    }
  };
  const handleReject = async (newRequestId) => {
    try {
      const reqdocref = doc(my_db, "requests", newRequestId);
      await updateDoc(reqdocref, {
        status: "Rejected !",
      });
      console.log("Request was rejected");

      // Fetch updated requests
      const updatedReqSnapshot = await getDocs(collection(my_db, "requests"));
      const updatedReqData = updatedReqSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          userData: data.userData || {},
        };
      });
      setRequests(updatedReqData);
    } catch (error) {
      console.error("Error rejecting requests:", error);
    }
  };

  return (
    <div className="">
      <div className="">
        <Sidebar />
        <div className="ml-28 pt-12">
          <h1 className="text-4xl font-bold items-center justify-center flex py-10 font-serif ">
            Requests
          </h1>
          <div className="overflow-x-auto  mr-20  md:ml-20 md:mr-20">
            <table className="w-full table-auto">
              <thead className="">
                <tr className="bg-[#12372A] text-[#FBFADA]  font-bold">
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Category
                  </th>
                  {/* <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Description
                  </th> */}
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                
                {currentItems.map((request, index) => (
                  <tr
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                    key={request.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.Category}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-wrap text-sm text-[#436850] ">
                      {request.Description}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.Charges}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-wrap text-sm font-bold font-serif text-[#436850] ">
                      {request.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.userData.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#436850] ">
                      {request.userData.address}
                    </td>
                    <td className="px-6 py-4 whitespace-wrap space-y-2 text-sm text-[#436850] ">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-2 rounded focus:outline-none focus:shadow-outline mr-2 w-20"
                        onClick={() => handleApproval(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-400 hover:bg-red-500 text-white font-bold px-4 py-2 rounded focus:outline-none focus:shadow-outline mr-2 w-20"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-2 py-2 rounded focus:outline-none focus:shadow-outline w-20"
                        onClick={() => handleComplete(request.id)}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-20">
            <IoIosArrowBack
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md  ${
                currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            />
            <div className=" pl-2 text-center">{currentPage}</div>
            <IoIosArrowForward
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= totalItems}
              className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md ${
                indexOfLastItem >= totalItems
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestComponent;
