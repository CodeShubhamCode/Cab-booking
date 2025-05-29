const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.Google_MAPS_API;
  const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&language=en&region=en&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    // console.log("Geocode response:", response.data);
    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const location = response.data.results[0].geometry.location;
      const ltd = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      
      if (isNaN(ltd) || isNaN(lng)) {
        throw new Error("Invalid coordinate values received");
      }

      return { ltd, lng };
    } else {
      throw new Error(
        "Unable to fetch coordinates. Response data: " +
          JSON.stringify(response.data)
      );
    }
  } catch (error) {
    console.error("Error in getAddressCoordinate:", error.message);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.Google_MAPS_API;
  // Updated endpoint using Go Maps API with additional parameters and proper adjustments for distance and time
  const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(
    destination
  )}&departure_time=now&avoid=highways&units=metric&language=en&mode=driving&region=en&traffic_model=pessimistic&transit_mode=train|tram|subway&transit_routing_preference=less_walking&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }
      // Values for distance (in meters) and duration (in seconds) remain unchanged.
      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.Google_MAPS_API;
  // Updated endpoint using Go Maps API with additional parameters
  const url = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${encodeURIComponent(
    input
  )}&offset=3&location=40,-110&radius=1000&language=en&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions
        .map((prediction) => prediction.description)
        .filter((value) => value);
    } else if (response.data.status === "ZERO_RESULTS") {
      return []; // Return empty array if no suggestions found
    } else {
      throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius = 5) => {
  const latNum = parseFloat(ltd);
  const lngNum = parseFloat(lng);
  const rad = parseFloat(radius);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(rad)) {
    throw new Error("Invalid parameters provided for geo query");
  }

  // MongoDB expects coordinate order as [lng, lat], and radius in radians.
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lngNum, latNum], rad / 6371], // Radius in radians
      },
    },
  });

  return captains;
};