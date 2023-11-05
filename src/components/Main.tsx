import Exercise from "./Exercise";
import Buy from "./Buy";
import Mint from "./Mint";
import Navbar from "./Nav";
import { useEffect, useState } from "react";

export const TABS = {
  MINT: "MINT",
  BUY: "BUY",
  EXERCISE: "EXERCISE",
} as const;

function Main() {
  const [tab, setTab] = useState<keyof typeof TABS>(TABS.MINT);

  return (
    <div className="container p-2 text-center">
      <Navbar setTab={setTab} />

      <h1 className="text-center">BBKIO</h1>
      <h2>Binary Barrier Knock-In Options</h2>
      <div className="d-flex">
        {tab === TABS.MINT && <Mint />}

        {tab === TABS.BUY && <Buy />}

        {tab === TABS.EXERCISE && <Exercise />}
      </div>
      <div className="semi-bold">Open Developer Console to see logs and outputs!</div>
    </div>
  );
}

export default Main;
