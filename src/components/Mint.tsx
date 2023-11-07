import { useContractWrite } from "wagmi";
import { Marketplace } from "../abis/Marketplace";
import { MARKETPLACE_ADDRESS, WETH } from "../constants";
import { parseEther, parseUnits } from "viem";
import ApproveExecute from "./ApproveExecute";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Mint() {
  const { write: mintOption, isSuccess } = useContractWrite({
    abi: Marketplace,
    address: MARKETPLACE_ADDRESS,
    functionName: "sellOption",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = e.target as typeof e.target & {
      strike: { value: string };
      startts: { value: string };
      exp: { value: string };
      put: { checked: boolean };
      price: { value: string };
    };
    const strike = parseUnits(t.strike.value, 6);
    const start = Math.ceil(Date.parse(t.startts.value) / 1000);
    const exp = Math.ceil(Date.parse(t.exp.value) / 1000);
    const price = parseEther(t.price.value);
    console.log({
      strike,
      start,
      exp,
      put: t.put.checked,
      price,
    });
    mintOption({
      args: [strike, start, exp, t.put.checked, price],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Mint request submitted");
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "auto" }} className="text-left">
      <h2>Mint</h2>
      <div className="mb-3">
        <label className="form-label fw-bold" htmlFor="strike">
          Strike (Barrier) in USD
        </label>
        <input type="number" className="form-control" id="strike" name="strike" />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold" htmlFor="startts">
          Valid from
        </label>
        <input type="datetime-local" className="form-control" id="startts" name="startts" />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold" htmlFor="exp">
          Expires
        </label>
        <input type="datetime-local" className="form-control" id="exp" name="exp" />
      </div>
      <div className="mb-3">
        <input type="checkbox" className="form-check-input me-2" id="put" name="put" />
        <label className="form-check-label fw-bold" htmlFor="put">
          Put
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold" htmlFor="price">
          Price (WETH)
        </label>
        <input type="float" className="form-control" id="price" name="price" />
      </div>
      <ApproveExecute
        approveERC20={WETH}
        approveAmount={BigInt(1e18)}
        spender={MARKETPLACE_ADDRESS}
        executeLabel="Mint"
      />
    </form>
  );
}

export default Mint;
