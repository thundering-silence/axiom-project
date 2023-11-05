import { expose } from 'comlink';
import { createPublicClient, http, Log } from 'viem';
import { localhost } from '../../constants';

const client = createPublicClient({ 
  chain: localhost,
  transport: http(localhost.rpcUrls.default.http[0]),
})

export class TxFinder {
    BLOCK_RANGE = BigInt(10_000);
    // BLOCK_RANGE = BigInt(1000);

    constructor() {}

    async queryEvents(aggregatorAddress: `0x${string}`, fromBlock: bigint, toBlock: bigint | 'latest' = 'latest'): Promise<Array<Log>> {
        const events = await client.getLogs({
            address: aggregatorAddress,
            event: {
                anonymous: false,
                inputs:[
                    {
                        "indexed":true,
                        "internalType":"int256",
                        "name":"current",
                        "type":"int256"
                    },
                    {
                        "indexed":true,
                        "internalType":"uint256",
                        "name":"roundId",
                        "type":"uint256"
                    },
                    {
                        "indexed":false,
                        "internalType":"uint256",
                        "name":"updatedAt",
                        "type":"uint256"
                    }
                ],
                "name":"AnswerUpdated",
                "type":"event"
            },
            fromBlock,
            toBlock
        })
        return events;
    }

    async processEvents(
        events: Array<Log>, 
        oToken: `0x${string}`, 
        thresholdPrice: bigint, 
        isLess: boolean, 
        fromTimestamp: bigint, 
        toTimestamp: bigint,
    ) {
        let event: Log | null = null;
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (!e.blockNumber) continue;
            if (!e.topics[1]) continue;
            const block = await client.getBlock({blockNumber: e.blockNumber});
            if (BigInt(block.timestamp) > toTimestamp) continue;
            if (BigInt(block.timestamp) < fromTimestamp) continue;
            const price = BigInt(e.topics[1]);
            if (price === thresholdPrice) {
                event = e;
                break;
            }
            if (isLess) {
                if (price < thresholdPrice) {
                    event = e;
                    break;
                }
            } else {
                if (price > thresholdPrice) {
                    event = e;
                    break;
                }
            }
        }
        if (!event) return null;
        return {
            aggregator: event.address,
            blockNum: Number(event.blockNumber!),
            txIndex: Number(event.transactionIndex!),
            thresholdPrice: Number(thresholdPrice),
            shouldBeLess: isLess ? 1 : 0,
            oToken
        }
    }

    /**
     * Query events from the blockchain and return the first one that matches the threshold price
     * @param aggregatorAddress - the address of the aggregator contract
     * @param oToken - the address of the oToken
     * @param thresholdPrice - the price to compare against
     * @param isLess - 0 | 1 - whether the price should be less than or greater than the threshold
     * @returns - inputs for the circuit or null if no matching event is found
     */
    async run(aggregatorAddress: `0x${string}`, oToken: `0x${string}`, thresholdPrice: bigint, isLess: boolean, fromTimestamp: bigint, toTimestamp: bigint) {
        let currentBlockNum = await client.getBlockNumber();
        console.log('currentBlockNum', currentBlockNum);
        let i = 0;
        let inputs: any | null = null;
        do {
            const events = await this.queryEvents(aggregatorAddress, currentBlockNum - this.BLOCK_RANGE, currentBlockNum);
            // chainlink aggregator uses 8 decimals but we use 6
            inputs = await this.processEvents(
                events, 
                oToken, 
                thresholdPrice * BigInt(100), 
                isLess, 
                fromTimestamp, 
                toTimestamp,
            )
            currentBlockNum -= this.BLOCK_RANGE;
        } while (!inputs && i < 10 && currentBlockNum > 0);
        return inputs;
    }

}

expose(TxFinder);