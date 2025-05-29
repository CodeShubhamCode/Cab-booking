import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import polyline from "@mapbox/polyline";

const LiveTracking = ({ pickup, destination }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 28.7041, // Default location (Delhi)
    lng: 77.1025,
  });
  const [routeCoords, setRouteCoords] = useState([]);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);

  // Live tracking using geolocation.watchPosition
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch route using gomaps.pro directions API when pickup and destination are provided
  useEffect(() => {
    if (pickup && destination) {
      const fetchRoute = async () => {
        try {
          const payload = {
            origin: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: pickup,
            },
            destination: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: destination,
            },
            travelMode: "driving",
            routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
            polylineQuality: "high_quality",
            computeAlternativeRoutes: false,
            routeModifiers: {
              avoidTolls: false,
              avoidHighways: false,
              avoidFerries: false,
              avoidIndoor: false,
            },
          };

          const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://routes.gomaps.pro/directions/v2:computeRoutes",
            headers: {
              accept: "*/*",
              "content-type": "application/json",
              "x-goog-api-key": import.meta.env.VITE_GOMAPS_API_KEY,
              "x-goog-fieldmask": "*",
            },
            data: JSON.stringify(payload),
          };

          const response = await axios(config);
          const polylineStr =
            response.data.routes[0].overview_polyline.points;
          const coords = polyline
            .decode(polylineStr)
            .map((p) => ({ lat: p[0], lng: p[1] }));
          setRouteCoords(coords);
          if (coords.length > 0) {
            setPickupCoord(coords[0]);
            setDestinationCoord(coords[coords.length - 1]);
          }
        } catch (error) {
          console.error("Route fetch error:", error);
        }
      };
      fetchRoute();
    }
  }, [pickup, destination]);

  return (
    <MapContainer
      center={currentPosition}
      zoom={14}
      style={{ width: "100%", height: "100vh" }}
    >
      {/* Tile layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Current Location Marker */}
      <Marker position={currentPosition} />

      {/* Pickup Marker */}
      {pickupCoord && (
        <Marker
          position={pickupCoord}
          icon={new L.Icon({
            iconUrl:
              "https://cdn-icons-png.flaticon.com/512/25/25694.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        />
      )}

      {/* Destination Marker */}
      {destinationCoord && (
        <Marker
          position={destinationCoord}
          icon={new L.Icon({
            iconUrl:
              "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        />
      )}

      {/* Highlighted Route */}
      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          color="red"
          weight={4}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
};

export default LiveTracking;
