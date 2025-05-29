import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/captaincontext";
import axios from "axios";
// Added import to mimic UI from home.jsx
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    const handleNewRide = (data) => {
      if (!data || !data.pickup || !data.destination) {
        console.error("Invalid ride data received:", data);
        return;
      }
      setRide(data);
      setRidePopupPanel(true);
    };
    socket.on("new-ride", handleNewRide);
    return () => socket.off("new-ride", handleNewRide);
  }, [socket]);

  useEffect(() => {
    // Emit "join" event when the component mounts
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });
  }, [socket, captain]);

  useEffect(() => {
    // Function to update the captain's location
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: Number(position.coords.latitude),
              lng: Number(position.coords.longitude),
            },
          });
        });
      }
    };

    // Set an interval to update the location every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation(); // Call it immediately on mount

    return () => clearInterval(locationInterval); // Cleanup on unmount
  }, [socket, captain]);

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen flex">
      {/* Left Column - Header & Captain Details */}
      <div className="w-1/3 h-screen bg-white p-6 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-4xl font-extrabold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent mb-4 md:mb-6 drop-shadow-lg border-b-4 border-red-700 pb-2">
            RapidRide
          </h1>
          <Link
            to="/captain-home"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
          >
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
        <div className="pt-6">
          <CaptainDetails />
        </div>
      </div>
      {/* Right Column - Map */}
      <div className="w-2/3 h-screen">
        <LiveTracking />
      </div>
      {/* Ride Popup Panels (positioned over Left Column) */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-1/3 z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-1/3 h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
