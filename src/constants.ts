import { defineChain } from "viem";

export const WETH = "0x40caeBe224cEC7412E22E83Dfe0b804e1402BE19";
export const USDC = "0x91Bcffe837B0E25c907e777D25638795DF5b990e";
export const MARKETPLACE_ADDRESS = "0x95c50eF05A11a0EB9308a74d8b22B18fd27a8341";

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
