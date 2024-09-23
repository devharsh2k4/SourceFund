import React from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "../assets";
import FundCard from "./FundCard";

interface CustomDisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: any;
}

const DisplayCampaigns: React.FC<CustomDisplayCampaignsProps> = ({
  title,
  isLoading,
  campaigns,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign: any) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div >
      <h1
        className="font-epilogue font-semibold
       text-[18px] text-white text-left"
      >
        {title}({campaigns.length})
      </h1>
      <div className="flex flex-wrap mt-[20px] gap-[26px] ">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-gray-400">
            No campaigns Created
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign: any) => (
           
              <FundCard
                key={campaign.id}
                {...campaign}
                handleClick={() => handleNavigate(campaign)}
              />
           
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
