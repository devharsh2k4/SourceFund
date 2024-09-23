import { createContext, ReactNode, useContext } from "react";
import {
  ChainId,
  useAddress,
  useConnect,
  useContract,
  useContractWrite,
  useMetadata,
  useMetamask,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface ContextType {
  address: string | undefined;
  contract: any;
  createCampaign: (form: any) => Promise<any>;
  connect: () => Promise<any>;
  getCampaigns: () => Promise<any>;
  getUserCampaigns: () => Promise<any>;
  getDonations: (pId: string) => Promise<{ donator: string; donation: string }[]>;
  donate: (pId:any,amount:any) => Promise<any>;
}

interface StateContextProviderProps {
  children: ReactNode;
}

const StateContext = createContext<ContextType | null>(null);

export const StateContextProvider = ({
  children,
}: StateContextProviderProps): JSX.Element => {
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESS as string
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign" as any
  );
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const connect = async () => {
    try {
      await connectWithMetamask({
        chainId: 11155111,
      });
    } catch (error) {
      console.error("Failed to connect with Metamask to Sepolia:", error);
    }
  };

  const publishCampaign = async (form: any) => {
    try {
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("success", data);
    } catch (err) {
      console.log("contract call failed", err);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract?.call("getCampaigns");
    const parsedCampaigns = campaigns.map((campaign: any, index: Number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: index,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign: any) => campaign.owner === address
    );

    return filteredCampaigns;
  };


  const donate = async (pId: any, amount: any) => {
    if (!contract) {
      throw new Error("Contract is not initialized");
    }
  
    try {
      // Ensure that pId is passed in an array
      const data = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount.toString()),
      });
      return data;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };
  
  

  const getDonations = async (pId:any)=>{
if (!contract) {
  throw new Error("Contract is not initialized");
}
if (!pId) {
  throw new Error("Project ID (pId) is required");
}

const donations = await contract.call('getDonators', pId);
const numberOfDonations = donations[0].length;

const parsedDonations = [];

for(let i = 0; i< numberOfDonations; i++){
  parsedDonations.push({
    donator: donations[0][i],
    donation: ethers.utils.formatEther(donations[1][i].toString())
  })
}
return parsedDonations;
  }
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
