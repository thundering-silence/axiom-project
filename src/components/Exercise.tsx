import { Marketplace } from "@/abis/Marketplace";
import { MARKETPLACE_ADDRESS } from "@/constants";
import { AxiomV2Callback } from "@axiom-crypto/experimental";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { writeContract } from "wagmi/actions";
import { useAxiomCircuit } from "./axiom/AxiomCircuitProvider";
import { circuit, CircuitInputs } from "./axiom/worker/circuit";
import { Remote, wrap } from "comlink";
import { TxFinder } from "./txFinder";
import ApproveExecute from "./ApproveExecute";
import OptionCard from "./OptionCard";


function Exercise() {
    const [input, setInput] = useState<string>(JSON.stringify(circuit));
    const target = MARKETPLACE_ADDRESS;
    const [extraData, setExtraData] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBuilt, setIsBuilt] = useState<boolean>(false);
    const { address } = useAccount();
    const { axiom, setParams, build, reset } = useAxiomCircuit();

  const txFinderWorker = useRef<Remote<TxFinder>>();
    useEffect(() => {
      const setupTxFinder = async () => {
        const txFinder = new Worker(
          new URL("./txFinder", import.meta.url),
          { type: "module" }
        );
        const Finder = wrap<typeof TxFinder>(txFinder);
        txFinderWorker.current = await new Finder();
      };
      setupTxFinder();
    }, []);

  const {data: myContractAddresses, isLoading: isLoadingMyContractAddresses} = useContractRead({
    abi: Marketplace,
    address: MARKETPLACE_ADDRESS,
    functionName: "getOptionsBoughtByBuyer",
    args: [address],
}) as {data: Array<`0x${string}`>, isLoading: boolean}

const {data: myContracts, isLoading: isLoadingMyContracts} = useContractReads({
    contracts: (myContractAddresses || []).map(address => ({
        address,
        abi: [{
            inputs: [],
            name: "getOtokenDetails",
            outputs: [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            stateMutability: "view",
            type: "function"
          },],
          functionName: "getOtokenDetails",
    }))
}) as {
    data: Array<({
        error: Error;
        result?: undefined;
        status: "failure";
    } | {
        error?: undefined;
        result: [bigint, bigint, bigint, boolean, `0x${string}`];
        status: "success";
    })> | undefined;
    isLoading: boolean
}

const fetchCircuitInputs = async ({validFrom, expiry, address, thresholdPrice, isLess}: any) => {
    if(!txFinderWorker.current) throw new Error("Worker not ready");
    console.log(address, thresholdPrice, isLess);
    const t = toast.loading("Fetching inputs...")
    const res = await txFinderWorker.current!.run('0x9b0FC4bb9981e5333689d69BdBF66351B9861E62', address, thresholdPrice, isLess, validFrom, expiry);
    if(!res) {
      toast.error("Option was never activated.");
    } else {
      toast.success(`Found valid price at block ${res.blockNum}`);
    }
    toast.dismiss(t);
    setInput(JSON.stringify(res));
    console.log(res);
    return res;
}

  useEffect(() => {
    const inputs: CircuitInputs = JSON.parse(input);
    const callback: AxiomV2Callback = {
      target,
      extraData,
    };
    setParams(inputs, callback);
  }, [input, target, extraData, setParams]);

  const generateAndSendQuery = async () => {
    setIsLoading(true);
    const buildRes = await build();
    if (buildRes === null) {
      setIsLoading(false);
      console.error("Unable to build Query");
      return;
    }
    const { builtQuery, payment } = buildRes;
    setIsBuilt(true);
    setIsLoading(false);

    const queryArgs = [
      builtQuery.sourceChainId,
      builtQuery.dataQueryHash,
      builtQuery.computeQuery,
      builtQuery.callback,
      builtQuery.userSalt,
      builtQuery.maxFeePerGas,
      builtQuery.callbackGasLimit,
      address,
      builtQuery.dataQuery,
    ];
    console.log(builtQuery);
    return
    const preparedContract = {
      address: axiom.getAxiomQueryAddress() as `0x${string}`,
      abi: axiom.getAxiomQueryAbi(),
      functionName: "sendQuery",
      value: BigInt(payment),
      args: queryArgs,
    };
    const { hash } = await writeContract(preparedContract);

    console.log(`Sent query: https://goerli.etherscan.io/tx/${hash}`);
  };

  const resetBuiltQuery = () => {
    reset();
    setIsBuilt(false);
    setIsLoading(false);
  }

  const builtOrLoading = isBuilt || isLoading;

  const exerciseOption = ({address, thresholdPrice, isLess}: {address: `0x${string}`, thresholdPrice: bigint, isLess: boolean}) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetchCircuitInputs({address, thresholdPrice, isLess});
    if(!res) return;
    const t = toast.loading("Generating and sending query...");
    try {
      await generateAndSendQuery();
      toast.success("Query sent!");
    } catch(e) {
      toast.error("Error sending query");
      console.error(e);  
    }
    toast.dismiss(t);
}

  return (
    <div>
    <h2 className="pb-2">Your Options</h2>
    <ul className="container-xl list-unstyled row overflow-x-auto">
    {(isLoadingMyContractAddresses || isLoadingMyContracts) && <div>Loading...</div>}
    {myContracts?.map(({result}, i) => result && (<OptionCard key={i} data={result}>
      <form onSubmit={exerciseOption({address: myContractAddresses.at(i) as `0x${string}`, thresholdPrice: result.at(0) as bigint, isLess: result.at(3) as boolean})}>
      <ApproveExecute
        approveERC20={myContractAddresses.at(i) as `0x${string}`}
        approveAmount={BigInt(1e18)}
        spender={MARKETPLACE_ADDRESS}
        executeLabel="Exercise"
      />
      </form>
    </OptionCard>))}
    </ul>
</div>
    )
}

export default Exercise;