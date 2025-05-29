import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const { user, setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
      alert("There was an error registering the user. Please try again later.");
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: `url("https://img.freepik.com/premium-photo/traffic-light-that-is-street-with-lights_975681-254390.jpg")`,
        }}
      ></div>
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Section */}
        <div className="mb-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-4 md:mb-6">
            RapidRide
          </h1>
        </div>

        {/* Login Form Container */}
        <div className="bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md text-white">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-cyan-500 mb-6">
            Register
          </h2>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="space-y-4"
          >
            {/* Name Input */}
            <label className="block text-gray-400 mb-1">What's your name</label>
            <div className="flex gap-4">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="First name"
                className="w-1/2 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none text-white"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-1/2 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none text-white"
              />
            </div>
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
              Register
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Click here to login
            </Link>
          </p>
        </div>

        {/* Captain Login Link */}
        <div className="mt-15">
          <p className="text-s text-center text-gray-400">
            By proceeding, you agree to our{" "}
            <Link to="/terms" className="text-cyan-400 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
