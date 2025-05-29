import React from "react";
import { FaGooglePlay, FaAppStore } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";

const EntryScreen = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center sm:justify-end px-6 md:px-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515490480959-ce9152f7ea2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-transparent p-6 md:p-10 rounded-2xl shadow-lg max-w-md text-center flex flex-col justify-center w-full sm:w-auto">
        {/* Logo */}
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-4 md:mb-6">
          RapidRide
        </h1>

        {/* Headline & Description */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3 md:mb-4">
          Ride With Confidence
        </h2>
        <p className="text-base md:text-lg text-gray-400 mb-4 md:mb-6">
          Safe, reliable rides at your fingertips
        </p>

        {/* CTA Buttons */}
        <div className="space-y-3 md:space-y-4 w-full">
          <Link to='/register' className="inline-block w-full bg-cyan-500 text-white py-3 rounded-full text-base md:text-lg font-semibold transition hover:bg-cyan-600">
            Get Started
          </Link>
          <Link to='/login' className="inline-block w-full bg-gray-200 text-gray-800 py-3 rounded-full text-base md:text-lg font-semibold transition hover:bg-gray-300">
            Sign In
          </Link>
        </div>

        {/* App Download Buttons */}
        <div className="mt-5 md:mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 w-full sm:w-auto">
            <FaGooglePlay className="mr-2" /> Google Play
          </button>
          <button className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 w-full sm:w-auto">
            <FaAppStore className="mr-2" /> App Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryScreen;
