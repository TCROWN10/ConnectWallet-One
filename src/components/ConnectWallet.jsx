import { useEffect, useState } from "react";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setChainId(await window.ethereum.request({ method: "eth_chainId" }));
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
      console.log("Connected Account:", account);
      console.log("Chain ID:", chainId);
      
    } else {
      alert("MetaMask not found");
    }
  };

  const disconnectWallet = async () => {
    if (window.ethereum) {
      try {
        setAccount(null);
        setChainId(null);
        
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: [] }]
        });
  
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
      console.log("disconnectWallet");
      
    } else {
      console.log("No wallet connected");      
    }
    alert("Wallet disconnected");
    console.log("No wallet connected");
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (chainId) => {
        setChainId(chainId);
      };
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const switchChain = async (newChainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: newChainId }],
      });
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  const addEthereumChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x106a",
            chainName: "Lisk Sepolia",
            rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
            nativeCurrency: {
              name: "LISK",
              symbol: "MATIC",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
          },
        ],
      });
    } catch (error) {
      console.error("Error adding Ethereum chain:", error);
    }
  };

  const sendETH = async (recipient, amount) => {
    if (!account) return alert("Connect wallet first");
    try {
      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: Number(amount * 1e18).toString(16),
          },
        ],
      });
      console.log("Transaction Hash:", tx);
    } catch (error) {
      console.error("Error sending ETH:", error);
    }
  };

  return (
    <div className="p-6 max-w-custom mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-transparent  text-foreground shadow-lg rounded-custom">
      <div className="flex flex-col space-y-3">
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
        >
          Connect Wallet
        </button>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition"
        >
          Disconnect
        </button>
        <button
          onClick={() => switchChain("0x1")}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white transition"
        >
          Switch to Ethereum
        </button>
        <button
          onClick={addEthereumChain}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white transition"
        >
          Add Lisk
        </button>
        <button
          onClick={() => sendETH("0xA1eE1Abf8B538711c7Aa6E2B37eEf1A48021F2bB", 0.000001)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-600 text-white transition"
        >
          Send ETH
        </button>
      </div>
      <div className="mt-4 p-3 bg-callout border border-calloutBorder rounded-custom">
        <p className="text-lg font-mono text-white">
          Connected Account: <span className="font-bold">{account || "Not connected"}</span>
        </p>
        <p className="text-lg font-mono text-white">
          TCROWN ID: <span className="font-bold">{chainId || "N/A"}</span>
        </p>
      </div>
    </div>
  );
}
