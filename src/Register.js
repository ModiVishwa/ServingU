import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, my_db } from "./Configure";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import cover from './Images/login.jpg'
import toast from "react-hot-toast";

function Register() {
  const [reginput, setReginput] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [disable, setDisable] = useState(false);
  const [userid, setUserid] = useState(""); // State to store userid
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setReginput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const onRegister = async () => {
    if (!reginput.username || !reginput.email || !reginput.password || !reginput.contact || !reginput.address) {
      setError("Please fill all the fields");
      return;
    }
    setError("");
    setDisable(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, reginput.email, reginput.password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: reginput.username,
      });

      // Save user details to the database using uid as the document ID
      const userRef = doc(my_db, "user_profiles", user.uid);
      await setDoc(userRef, {
        username: reginput.username,
        email: reginput.email,
        contact: reginput.contact,
        address: reginput.address,
        userId: user.uid, // Add user ID to the document
      });

      // Fetch the userid and set it in state
      const docSnap = await getDoc(userRef);
      setUserid(docSnap.id);

      // Redirect to homepage after successful registration
       navigate("/");
       toast.success('Registered Successfully') // Use navigate if you want to use React Router navigation
    } catch (err) {
      setError(err.message);
      setDisable(false);
    }
  };

  // If user is already authenticated, render a message indicating they are already signed in
  
  

  return (
    <div>
      <div className="w-full h-screen flex item">
        <div className="relative w-2/3 h-full flex flex-col">
          <div className="absolute top-[30%] left-1/4 flex flex-col">
            <h1 className="text-4xl font-serif font-extrabold text-[#436850] my-8 mx-10 pb-0">
              We are here to serve you.
            </h1>
            <p className="text-base font-serif font-semibold text-[#436850] mx-12">
              Start for free and get attractive offers.
            </p>
          </div>
          <img
            src={cover}
            className="w-full h-full object-cover "
            alt="cover"
          />
        </div>
        <div className=" w-1/3 h-full bg-[#436850] flex flex-col p-14 justify-between">

          <h1 className=" text-4xl text-[#FBFADA] font-semibold font-fredoka">
            ServingU
          </h1>
          <div className=" w-full flex flex-col">
            <div className="w-full flex flex-col max-w-[400px]">
              <h3 className=" text-3xl text-[#FBFADA] font-semibold mb-2">
                Register
              </h3>
              <p className=" text-base text-[#FBFADA] mb-4">
                SignUp for our great services.
              </p>
            </div>
            <div className=" w-full flex flex-col">
              <div className=" w-full flex">
                <input
                  type="text"
                  name="username"
                  value={reginput.username}
                  placeholder="Name"
                  onChange={inputChange}
                  className="w-full text-[#12372A] placeholder-[#12372A] pl-[6px] my-2 py-2  bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={reginput.email}
                  onChange={inputChange}
                  placeholder="Email"
                  className=" w-full text-[#12372A] placeholder-[#12372A] pl-[6px] my-2 py-2 mx-3 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
              </div>
              <div className="w-full flex">
                <input
                  type="tel"
                  name="contact"
                  value={reginput.contact}
                  placeholder="Contact No."
                  onChange={inputChange}
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"    
                  className=" w-full text-[#12372A] placeholder-[#12372A] pl-[6px] my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
                <input
                  type="password"
                  name="password"
                  value={reginput.password}
                  placeholder="Password"
                  onChange={inputChange}
                  className=" w-full text-[#12372A] placeholder-[#12372A] pl-[6px] my-2 py-2 mx-3 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
              </div>
              <textarea
                type="text"
                name="address"
                value={reginput.address}
                placeholder="Address"
                onChange={inputChange}
                className=" w-[97%] text-[#12372A] placeholder-[#12372A] pl-[6px] my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
              />
              {/* <input
                type=""
                placeholder="Contact No."
                className=" w-full text-[#FBFADA] my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
              /> */}
            </div>
            <div className=" w-[97%] flex flex-col my-4">
              <p>{error}</p>
              <button
                className=" w-full bg-[#12372A] my-2 text-[#FBFADA]  font-semibold rounded-md p-4 text-center flex items-center justify-center"
                disabled={disable}
                onClick={onRegister}
              >
                Register
              </button>
              {/* <button className=' w-full bg-[#FBFADA] my-2 text-[#12372A] font-semibold border-[#12372A] border-2 rounded-md p-4 text-center flex items-center justify-center'>
              Signup</button> */}
            </div>
          </div>
          <div className=" w-full flex items-center justify-center">
            <p className=" text-sm font-normal text-[#FBFADA]">
              Already have an account?{" "}
              <span className="text-base font-normal text-[#12372A] hover:underline">
                <Link to="/">Login here</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default Register;
