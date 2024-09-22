import React from "react";
import { Route, Routes } from "react-router-dom";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import { Navbar, Sidebar } from "./components";

const App = () => {
  return (
    <>
  <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
    <div className="sm:flex hidden mr-10 relative">
      <Sidebar />
    </div>

    <div className="flex-1 w-full max-w-[1280px] mx-auto sm:pr-5">
      <Navbar />
      <div className="mt-[70px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  </div>
</>

  );
};

export default App;
