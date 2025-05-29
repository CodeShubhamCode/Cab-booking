import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/captaincontext";
import { SocketContext } from "../context/SocketContext"; // Added import

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext); // Retrieve socket
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainCredentials = { email, password };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainCredentials);
    if (response.status === 200) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);

      // Emit join event to update socket id in the backend
      socket.emit("join", { userId: data.captain._id, userType: "captain" });
      
      navigate("/captain-home");
    }
    
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1601277009345-82ac72a55816?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")` }}
      ></div>
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-75"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Section */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent mb-4 md:mb-6 drop-shadow-lg border-b-4 border-red-700 pb-2">
            RapidRide
          </h1>
        </div>

        {/* Login Form Container */}
        <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-red-700 mb-6">Captain Login</h2>

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com" 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password" 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
              />
            </div>
            
            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-4">
            Join the fleet? <Link to='/captain-register' className="text-red-600 hover:underline">Register as a captain</Link>
          </p>
        </div>

        {/* Captain Login Link */}
        <div className="mt-18">
          <Link to='/login' className="inline-block text-red-600 hover:underline">
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
