"use client";

import React, { useState, useEffect } from "react";
import { useActionState } from "react"; 
import { FaStore, FaUser, FaAddressCard, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import RegisterVendor from "@/actions/auth/registerVendor";
import { useUser } from "../dashboard/useContext";
import MarketAutocomplete from "@/components/MarketAutocomplete";
import AgentUser from "@/components/agentUser";
import { states } from "@/components/stateLga";

export default function ProfileForm() {
  const [state, action, isPending] = useActionState(RegisterVendor, undefined);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");
  const [selectedState, setSelectedState] = useState('');
  const [lga, setLga] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('afrivendor1');
  const [marketInput, setMarketInput] = useState("");

  const user = useUser();

  // Function to generate a random string
  const generateRandomString = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  // Auto-generate email and username when the component mounts
  useEffect(() => {
    setEmail(`${generateRandomString()}@afrivendor.ng`);
    setUsername(`user_${generateRandomString(6)}`);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          getAddressFromCoordinates(lat, lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Unable to retrieve location. Please enable location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setAddress(data.display_name || "Address not found");
    } catch (error) {
      console.error("Address fetch error:", error);
      setAddress("Error fetching address");
    }
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setLga('');
  };

  const handleLgaChange = (e) => {
    setLga(e.target.value);
  };

  const stateLgas = states.find(s => s.name === selectedState)?.lgas || [];

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Register New Vendor</h2>
      
      <form className="space-y-4 w-full" action={action}>
        <AgentUser />

        <div>
          <label htmlFor="shopname" className="block text-gray-700">Store Name</label>
          <input
            id="shopname"
            type="text"
            name="shopname"
            placeholder="Enter store name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue={state?.shopname}
            required
          />
        </div>


        <div>
       
          <input
          hidden
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <MarketAutocomplete value={marketInput} onChange={setMarketInput} />
        <div>
          <label htmlFor="line" className="block text-gray-700">Store Line</label>
          <input
            id="line"
            type="text"
            name="line"
            placeholder="eg A Line etc"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue={state?.line}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue={state?.phone}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label htmlFor="state" className="block text-gray-700">State</label>
            <select
              id="state"
              name="stat"
              value={selectedState || ""}
              onChange={handleStateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select State</option>
              {states.map((stateOption) => (
                <option key={stateOption.name} value={stateOption.name}>
                  {stateOption.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="lga" className="block text-gray-700">LGA</label>
            <select
              id="lga"
              name="city"
              value={lga || ""}
              onChange={handleLgaChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select LGA</option>
              {stateLgas.map((lgaOption) => (
                <option key={lgaOption} value={lgaOption}>
                  {lgaOption}
                </option>
              ))}
            </select>
          </div>
        </div>


<div>
 <label htmlFor="about" className="block text-gray-700">About Your Business</label>
  <textarea
    id="about"
    name="about"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    defaultValue={state?.about}
  />
</div>



        <div>
      
          <input
          hidden
            id="email"
            type="email"
            name="email"
            placeholder="Enter email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
      
          <input
          hidden
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="hidden">
          <input type="text" name="latitude" readOnly value={latitude || ""} />
          <input type="text" name="longitude" readOnly value={longitude || ""} />
          {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
        </div>

        <input hidden type="text" name="address" readOnly value={address} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
