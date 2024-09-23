import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "./index.css";
import { StateContextProvider } from "./context";
import App from "./App";
import { createThirdwebClient} from "thirdweb";


const client = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID, // Use client ID from the environment variable
 }).clientId;

// Sepolia testnet chain ID
const sepoliaChainId = 11155111; // Numeric chain ID for Sepolia




createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider activeChain={sepoliaChainId} clientId={client}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
