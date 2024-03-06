import React, { useState } from "react";
import cover from "./Images/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, my_db } from "./Configure";
import {  doc, getDoc } from "firebase/firestore";
import Toast, { toast } from "react-hot-toast";
function Signin() {

  const [log, setLog] = useState({
    email: '',
    password: ''
  });

  const logChange = (e) => {
    const { name, value } = e.target;
    setLog((prevLog) => ({
      ...prevLog,
      [name]: value,
    }));
  };

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate('')

  
  const onLogin = () => {
    if (!log.email || !log.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setDisable(true);
  
    signInWithEmailAndPassword(auth, log.email, log.password).then(async (res) => {
      localStorage.setItem('user', JSON.stringify(res.user.displayName));
      localStorage.setItem('Signin', true);
      setDisable(false);
      const user = res.user;
      const uid = user.uid;
  
      // Check if the user is an admin
      const isAdmin = await checkAdminStatus(uid);
      if (isAdmin) {
        // If the user is admin, navigate to the private page
        navigate('/private');
      } else {
        // If the user is not an admin, navigate to the homepage
        navigate('/homepage');
        toast.success('Successfully signed in')
      }
      
      console.log(res);
    }).catch((err) => {
      setDisable(false);
      setError(err.message);
    });
  };
  
  // Function to check if the user is an admin
  const checkAdminStatus = async (uid) => {
    try {
      const docSnapshot = await getDoc(doc(my_db, 'user_profiles', uid));
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        return userData.roles === 'admin';
      } else {
        // User profile document does not exist
        return false;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // Default to false if there's an error
      return false;
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-2/3 relative">
        <div className="absolute top-1/3 left-1/4 flex flex-col">
          <h1 className="text-4xl font-serif font-extrabold text-[#436850] my-8 mx-10 pb-0">
            We are here to serve you.
          </h1>
          <p className="text-base font-serif font-semibold text-[#436850] mx-12">
            Start for free and get attractive offers.
          </p>
        </div>
        <img
          src={cover}
          className="w-full h-full object-cover"
          alt="cover"
        />
      </div>
      <div className="md:w-1/3 bg-[#436850] p-14 flex flex-col justify-between">
        <h1 className="text-2xl text-[#FBFADA] font-semibold">
          Service Based App
        </h1>
        <div className="flex flex-col">
          <div className="max-w-md">
            <h3 className="text-3xl text-[#FBFADA] font-semibold mb-4">
              Login
            </h3>
            <p className="text-base text-[#FBFADA] mb-5">
              Welcome Back! Please enter your details.
            </p>
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              onChange={logChange}
              placeholder="Email"
              className="w-full text-[#12372A] placeholder-[#12372A] my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
            />
            <input
              type="password"
              name="password"
              onChange={logChange}
              placeholder="Password"
              className="w-full text-[#12372A] placeholder-[#12372A] my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
            />
          </div>
          <div className="flex flex-col my-4">
            <p>{error}</p>
            <button
              className="w-full bg-[#12372A] my-2 text-[#FBFADA] font-semibold rounded-md p-4 text-center"
              disabled={disable}
              onClick={onLogin}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm font-normal text-[#FBFADA]">
            Don't have an account?{" "}
            <span className="text-base font-normal text-[#12372A] hover:underline">
              <Link to='/register'>Sign up for free</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
