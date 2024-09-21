import { createContext, ReactNode, useContext } from "react";
import { ChainId, useAddress, useConnect, useContract, useContractWrite, useMetadata, useMetamask } from "@thirdweb-dev/react";

interface ContextType {
  address: string | undefined;
  contract: any;
  createCampaign: (form: any) => Promise<void>;
  connect: () => Promise<void>;
}

interface StateContextProviderProps {
  children: ReactNode;
}

const StateContext = createContext<ContextType | null>(null);

export const StateContextProvider = ({ children }: StateContextProviderProps): JSX.Element => {
  const { contract } = useContract("0x84BFb5b78CD3A511aF627057F4F3f1E6557c0742");
  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign" as any);
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

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);