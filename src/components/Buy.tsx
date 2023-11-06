import { useAccount, useContractRead, useContractReads, useContractWrite } from "wagmi";
import { Marketplace } from "../abis/Marketplace";
import { MARKETPLACE_ADDRESS, WETH } from "../constants";
import OptionCard from "./OptionCard";
import { formatEther } from "viem";
import ApproveExecute from "./ApproveExecute";
import { useEffect } from "react";

function Buy() {
  const {address} = useAccount();
  const {data: optionAddresses, isLoading: isLoadingAddresses} = useContractRead({
    abi: Marketplace,
    address: MARKETPLACE_ADDRESS,
    functionName: "getOptionsForSale",
  }) as {data: Array<`0x${string}`>, isLoading: boolean}

  const {data: detailsResult, isLoading: isLoadingDetails} = useContractReads({
      contracts: (optionAddresses || []).map(address => ({
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
      })),
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

  const {data: sellingData, isLoading: isLoadingSellingData} = useContractReads({
      contracts: (optionAddresses || []).map(address => ({
          address: MARKETPLACE_ADDRESS, // TODO - replace wiht marketplace address
          abi: [{
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "optionSaleInfo",
              outputs: [
                {
                  internalType: "address",
                  name: "seller",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "currentlyForSale",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "numberContractsMatched",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            }],
          functionName: "optionSaleInfo",
          args: [address],
  }))}) 

  const { write: buyOption } = useContractWrite({
    address: MARKETPLACE_ADDRESS, // MARKETPLACE_ADDRESS
    abi: Marketplace,
    functionName: "buyOption",
  });

  const handleSubmit = (args: [`0x${string}`, string]) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    buyOption({args})
  }

  return  (<div>
    <h2 className="mb-2">Buy Options</h2>
    <ul className="row">
    {(isLoadingAddresses || isLoadingDetails ) && <div>Loading...</div>}
    {detailsResult?.map(({result}, i) => result && (
        <OptionCard key={i} data={result}>
              {!isLoadingSellingData 
              && sellingData?.at(i)?.result 
              && (sellingData?.at(i)?.result?.at(0) as string).toLowerCase() != address?.toLowerCase() 
              && (
                  <form onSubmit={handleSubmit([optionAddresses?.[i], sellingData?.at(i)?.result?.at(0) as string])}>
                    <div>Price: {formatEther(sellingData?.at(i)?.result?.at(2) as bigint)} WETH</div>
                    <ApproveExecute
                      approveERC20={WETH}
                      approveAmount={sellingData?.at(i)?.result?.at(2) as bigint}
                      spender={MARKETPLACE_ADDRESS}
                      executeLabel="BUY"
                    />
                    </form>
              )}
        </OptionCard>
    ))}
    </ul>
  </div>
  )
}

export default Buy;
