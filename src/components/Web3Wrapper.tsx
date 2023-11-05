"use client";

import React from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export default function Web3Wrapper(props: { children: React.ReactNode }) {
  const wagmiConfig = createConfig(
    getDefaultConfig({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      appName: "Axiom Starter",
      autoConnect: true,
      chains: [goerli, { ...localhost, id: 31337 }],
    }),
  );

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider theme="minimal">{props.children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
