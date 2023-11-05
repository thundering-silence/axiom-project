import { defineChain } from "viem";

export const MARKETPLACE_ADDRESS = "0x077740AC705E689B6e020D2BD51904182F82de3b";
export const WETH = "0x4866Bc57E99baB364f08d45104E698624A53A111";
export const USDC = "0xD20c1152b42431AD70FbDa1a5374206F92209D5A";

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
