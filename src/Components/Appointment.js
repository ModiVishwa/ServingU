import React, { useEffect, useState } from "react";
import { auth, my_db } from "../Configure";
import { collection, updateDoc, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import Navbar from "./Navbar";
import AppointCard from "./AppointCard";
import { Link } from "react-router-dom";

function Appointment() {
  const [requests, setRequests] = useState([]);
  const [custom, setCustom] = useState("");
  const [authent, setAuthent]=useState(false)
  

useEffect(()=>{
    onSnapshot(query(collection(my_db, "requests"),where("userData.userId", "==", auth?.currentUser?.uid)),(snap)=>{
    const data=snap.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    console.log(data)
    setRequests(data)
    })
    
},[auth?.currentUser])

useEffect(()=>{})




  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     try {
  //       const user = auth?.currentUser;
  //       if (!user) return; // No user logged in, do nothing
        
  //       const userId = user?.uid;
  //       console.log(userId)
  //       const querySnapshot = await getDocs(
  //         collection(my_db, "requests"),where("userData.userId", "==",auth?.currentUser?.uid));
  //           console.log("userdata:" ,querySnapshot)
  //       const requestData = querySnapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         return {
  //           id: doc.id,
  //           ...data,
  //           userData: data.userData || {},
  //         };
  //       });
  //       console.log(requestData)
  //       setRequests(requestData);
  //     } catch (error) {
  //       console.error("Error fetching requests:", error);
  //     }
  //   };
  //   fetchRequests();
  // }, [auth?.currentUser]);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setAuthent(false);
      } else {
        setAuthent(true);
        setCustom(user.displayName || "");
        const userId = user.uid;
        console.log("Current user ID:", userId);
        // You can do further processing with the userId here
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="">
      <div className="">
        <Navbar name={custom} />
        <div className=" mt-16">
          <h1 className="text-4xl font-bold items-center justify-center flex py-10 font-serif ">
            Bookings
          </h1>
          <div className="overflow-x-auto  mr-20  md:ml-20 md:mr-20">
            <table className="w-full table-auto">
              <thead className="">
                <tr className="bg-[#12372A] text-[#FBFADA]  font-bold">
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request, index) => (
                  <tr
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                    key={request.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.Category}
                    </td>
                    <td className="px-6 py-4 whitespace-wrap text-sm text-[#436850] ">
                      {request.Description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.Charges}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-serif text-[#436850] ">
                      {request.userData.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#436850] ">
                      {request.userData.address}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-wrap text-sm font-bold font-serif text-[#436850] ">
                      {request.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-4 m-auto ">
          {requests.map((value) => (
            <Link key={value.id} to={`/appointment/${value.id}`}>
              <AppointCard appoint_details={value} />
            </Link>
          ))}
        </div> */}
        </div>
      </div>
    </div>
  )
}

export default Appointment