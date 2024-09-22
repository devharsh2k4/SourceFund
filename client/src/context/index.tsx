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
    const parsedCampaigns = campaigns.map((campaign: any , index:Number) => ({
      owner: campaign.owner,
      title:campaign.title,
      description:campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId : index

    }));

    return parsedCampaigns;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
