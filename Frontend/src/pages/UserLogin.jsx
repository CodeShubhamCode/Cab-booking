import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { user, setUser } =useContext(UserDataContext);

  const submitHandler = async(e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    }

    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
    .then((response) => {
      if(response.status === 200){
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    })  
    .catch((error) => {
      console.error("There was an error logging in the user:", error);
      alert("There was an error logging in the user. Please try again later.");
    });
    setEmail("");
    setPassword("");
    
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url("https://img.freepik.com/premium-photo/traffic-light-that-is-street-with-lights_975681-254390.jpg")` }}
      ></div>
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Section */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-4 md:mb-6">
            RapidRide
          </h1>
        </div>

        {/* Login Form Container */}
        <div className="bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md text-white">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-cyan-500 mb-6">Login</h2>

          <form onSubmit={(e) => {
            submitHandler(e);
          }} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);                  
                }}
                placeholder="example@email.com" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none text-white"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter password" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none text-white"
              />
            </div>
            
            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-4">
            New here? <Link to='/register' className="text-cyan-400 hover:underline">Create an account</Link>
          </p>
        </div>

        {/* Captain Login Link */}
        <div className="mt-20">
          <Link to='/captain-login' className="inline-block text-cyan-400 hover:underline">
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
