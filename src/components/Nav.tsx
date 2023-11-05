import { ConnectKitButton } from "connectkit";
import { TABS } from "./Main";

type Props = {
  setTab: (tab: keyof typeof TABS) => void;
};

function Navbar({ setTab }: Props) {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light px-2 rounded my-2 d-flex flex-row"
      style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
    >
      <h3 className="my-0">BBKIO</h3>
      <div className="flex-grow-1">
        {Object.values(TABS).map((value) => (
          <a
            href="#"
            key={value}
            onClick={() => setTab(value)}
            className="px-2 py-1 bold mx-2 text-black"
          >
            {value}
          </a>
        ))}
      </div>
      <ConnectKitButton />
    </nav>
  );
}

export default Navbar;
