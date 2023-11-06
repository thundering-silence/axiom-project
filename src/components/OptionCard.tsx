import { formatUnits } from "viem";

type Props = {
    data: [bigint, bigint, bigint, boolean, `0x${string}`];
    children: React.ReactNode;
}

function OptionCard({data, children}: Props) {
    return <li className="container card row p-2">
        <div className="p-1">Strike (Barrier): {formatUnits(data[0] as bigint, 6)} USD</div>
        <div className="p-1">Valid From: {new Date(Number(data[1] as bigint) * 1000).toLocaleString()}</div>
        <div className="p-1">Expires: {new Date(Number(data[2] as bigint) * 1000).toLocaleString()}</div>
        <div className="p-1">Put: {(data[3] as boolean).toString()}</div>
        {/* <div className="p-1">Collateral: USDC</div> */}
        {children}
    </li>
}

export default OptionCard;