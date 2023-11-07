import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount, useContractRead, useContractWrite } from "wagmi";


type Props = {
    approveERC20: `0x${string}`;
    approveAmount: bigint;
    spender: `0x${string}`;
    executeLabel: string;
}

/**
 * Expects to be within a form that that has a `onSubmit` prop that submits a tx
 */
function ApproveExecute({approveERC20, approveAmount, spender, executeLabel}: Props) {   
    const {address} = useAccount()
    const { data: allowance } = useContractRead({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        address: approveERC20,
        functionName: "allowance",
        args: [address, spender],
        watch: true,
        cacheTime: 5_000,
    }) as { data: bigint | undefined };

    const { data: symbol } = useContractRead({
        abi: [
          {
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        address: approveERC20,
        functionName: "symbol",
    }) as { data: string | undefined };

    const { write: approve, isLoading, isSuccess } = useContractWrite({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        address: approveERC20,
        functionName: "approve",
        args: [spender, approveAmount],
      });

    useEffect(() => {
      if (isLoading) {
        toast.loading("Approving...", {
          duration: 3_000,
        });
      }
    },[isLoading])

    useEffect(() => {
      if (isSuccess) {
        toast.success("Approve submitted!", {
          duration: 3_000,
        });
      }
    },[isSuccess])

    const disabled = (allowance || BigInt(0)) < approveAmount

    return (
        <>
        <button
            type="button"
            className={`btn btn-${disabled ? "primary" : "secondary"}`}
            onClick={() => approve()}
        >
            Approve {symbol}
        </button>
        <button
            type="submit"
            className={`btn btn-${disabled ? "secondary" : "primary"}`}
            disabled={disabled}
        >
            {executeLabel}
        </button>
        </>
    );
}

export default ApproveExecute;