import React, { useEffect, useState } from "react";
import { my_db, auth } from "../Configure"; // Assuming you have auth from Firebase
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

function Datadetails() {
  const { id, userId } = useParams(); // Get id and userId from URL parameters
  const [cardvalue, setCardValue] = useState({});
  const [getReq, setReq] = useState(false);
  const [requestData, setRequestData] = useState({
    Category: "",
    Description: "",
    Charges: "",
  });
  const [date, setDate] = useState("");
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceRef = doc(my_db, "service_data", id);
        const serviceDoc = await getDoc(serviceRef);
        if (serviceDoc.exists()) {
          const serviceData = serviceDoc.data();
          setCardValue(serviceData);
        } else {
          console.log("Service data not found");
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    if (id) {
      fetchServiceData();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Assuming you have a collection called 'users' where user details are stored
          const userRef = doc(my_db, "user_profiles", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handledate = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const docRef = await addDoc(collection(my_db, "requests"), {
        ...requestData,
        date,
        status: "Pending",
        userData: userData,
      });
  
      // Get the ID of the newly created document
      const newRequestId = docRef.id;
  
      console.log("Request submitted with ID: ", newRequestId);
      // alert("Request submitted successfully!");
      toast.success('Request for booking submitted successfully!')
  
      // Update state with the new request ID
      setRequestData({
        Category: "",
        Description: "",
        Charges: "",
      });
      setDate("");
      setReq(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit request. Please try again.");
    }
  };
  
  
  const handleCross = () => {
    setReq(!getReq);
  };

  const handleRequestClick = () => {
    // Update requestData state with service data
    setRequestData({
      Category: cardvalue.Category,
      Description: cardvalue.Description,
      Charges: cardvalue.Charges,
    });
    // Set getReq state to true to display the request form
    setReq(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100 py-8 px-4 md:px-0">
    {cardvalue && (
      <>
        <div className="md:w-1/2 lg:w-2/4 md:ml-10 flex flex-col items-center bg-white rounded-lg shadow-md p-8 mx-4 md:mx-0 mb-8 md:mb-0">
          <p className="text-4xl font-semibold text-[#12372A] mt-2 mb-6">{cardvalue.Sub}</p>
          <p className="text-lg font-bold text-[#12372A] mb-4">{cardvalue.Category}</p>
          <p className="text-xl font-bold text-[#12372A] mb-4">{cardvalue.Charges}*</p>
          <p className="text-lg text-[#12372A] leading-relaxed text-wrap mb-6">{cardvalue.Description}</p>
          <button className="bg-[#12372A] text-white font-semibold uppercase py-3 px-8 rounded-md shadow-md hover:bg-[#436850]" onClick={handleRequestClick}>Book Now</button>
        </div>
        <div className="md:w-1/2 lg:w-2/5 flex mt-6 md:mt-0 justify-center">
          <div className="w-3/4 lg:w-4/5 md:w-96 h-96 flex lg:ml-16 justify-center p-4 rounded-lg overflow-hidden shadow-md">
            <img className="h-full w-full object-cover rounded-md" src={cardvalue.Img} alt="Card" />
          </div>
        </div>
      </>
    )}
    {getReq && (
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div className="bg-[#ADBC9F] shadow-md rounded-lg lg:w-2/4 sm:w-2/3 p-8 ">
          <div className="flex items-end justify-end">
            <button className="bg-[#12372a] h-10 w-10 flex items-center justify-center text-[#B6C4B6] text-xl rounded-full shadow-lg hover:bg-[#436850]" onClick={handleCross}>
              <RxCross2 />
            </button>
          </div>
          <p className="font-semibold text-center text-3xl mb-4 font-serif">{requestData.Category}</p>
          <p className="font-bold text-center text-xl mb-4">{requestData.Charges}*</p>
          <p className="text-lg mb-4">{requestData.Description}</p>
          <input type="date" onChange={handledate} className="text-xl rounded-lg text-center mb-4" />
          {userData && (
            <div className="md:flex-col">
              <p className="text-lg font-semibold mb-4 md:mb-6">Requested Date: {date}</p>
              <div className="flex flex-wrap mb-4 bg-[] ">
                <div className="w-full md:w-1/2">
                  <p className="font-semibold text-lg mb-2 font-mono text-center">{userData.username}</p>
                  <p className="font-semibold text-lg mb-2 font-mono text-center">{userData.email}</p>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="font-semibold text-lg mb-2 font-mono text-center">{userData.contact}</p>
                  <p className="font-semibold text-lg mb-2 font-mono text-center">{userData.address}</p>
                </div>
              </div>
              <button className="bg-[#12372A] text-white font-semibold uppercase py-2 px-4 rounded-md shadow-lg hover:bg-[#436850] mx-auto block" onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}

export default Datadetails;
