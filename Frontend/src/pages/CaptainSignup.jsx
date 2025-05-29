import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity), 
        vehicleType: vehicleType,
      },
    };

    // // Debug log (optional)
    // console.log("Submitting captainData:", captainData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      if (error.response?.data?.errors) {
        const messages = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        alert(messages);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed. Please check your input and try again.");
      }
    }

    // Reset form fields
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1601277009345-82ac72a55816?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
      ></div>
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-75"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Section */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent mb-2 md:mb-6 drop-shadow-lg border-b-4 border-red-700 pb-2">
            RapidRide
          </h1>
        </div>

        {/* Signup Form Container */}
        <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
            Captain Signup
          </h2>

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Name Input */}
            <label className="block text-gray-400 mb-1">
              What's your name?
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-1/2 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-1/2 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
              />
            </div>

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

            {/* Vehicle Information Heading */}
            <h3 className="text-xl font-semibold text-white mt-4">
              Vehicle Information
            </h3>
            {/* Vehicle Details - Row 1 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  required
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  placeholder="Vehicle Color"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1">
                  Vehicle Plate
                </label>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="Vehicle Plate"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
                />
              </div>
            </div>
            {/* Vehicle Details - Row 2 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1">
                  Vehicle Capacity
                </label>
                <input
                  type="number"
                  required
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  placeholder="Vehicle Capacity"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-400 mb-1">Vehicle Type</label>
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-700 focus:outline-none text-white"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="motorcycle">Bike</option>
                </select>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              Create Captain Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-red-600 hover:underline">
              Login as Captain
            </Link>
          </p>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-5">
          <p className="text-s text-center text-gray-400">
            By proceeding, you agree to our{" "}
            <Link to="/terms" className="text-red-600 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-red-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
