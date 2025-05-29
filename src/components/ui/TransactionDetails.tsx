import { NEXT_INTERCEPTION_MARKER_PREFIX } from "next/dist/lib/constants";
import React from "react";

interface TransactionDetailsProps {
    name: string;
    decimals: number;
    amount?: number;
  }

interface handleNormalAmountProps{
    amount: number;
    decimals: number;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    name,
    decimals,
    amount=0
}) => {

    //Convert wei amount to normal amount by dividing by 10^decimals
    let outputName;
    let outputWei
    let outputAmount;
    if (decimals === undefined) {
        outputName = "-";
        outputWei = "-";
        outputAmount = "-";
    } else{
        outputName = name;
        outputWei = amount;
        outputAmount = amount ===0 ? 0 : amount / Math.pow(10, decimals);
    }

    return (
        <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full">
            <h2 className="text-sm font-semibold mb-2">Transaction Details</h2>
            <div className="flex flex-col space-y-2 w-full">
                <div className="text-sm font-medium flex justify-between">
                    <span>Token Name:</span>
                    <span>{outputName}</span>
                </div>
                <div className="text-sm font-medium flex justify-between">
                    <span>Amount in wei:</span>
                    <span>{outputWei}</span>
                </div>
                <div className="text-sm font-medium flex justify-between">
                    <span>Amount in tokens:</span>
                    <span className="font-mono">{outputAmount}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;