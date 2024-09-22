import React,{useState,useEffect} from 'react'
import { useStateContext } from '../context';
import DisplayCampaigns from '../components/DisplayCampaigns';


const Home = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [campaigns,setCampaigns] = useState([]);

  const context = useStateContext();
  if (!context) {
    return <div>Error: Context not found</div>;
  }
  const { address, contract, getCampaigns } = context;

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(()=>{
if(contract) fetchCampaigns();
  },[address,contract]);
  return (

      <DisplayCampaigns
    title="All Campaigns"
    isLoading={isLoading}
    campaigns={campaigns}
    />

  )
}

export default Home