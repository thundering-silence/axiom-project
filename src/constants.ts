import { defineChain } from "viem";

export const WETH = "0xdB7df1f6c68F122012f48141D575A44942e2C377";
export const USDC = "0xC992496A87B873276964029d3Dc6f7F33F7E0722";
export const MARKETPLACE_ADDRESS = "0x7eac4d493b0388E9b254b7561fc3460B25819dE1";

export const localhost = defineChain({
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
});
