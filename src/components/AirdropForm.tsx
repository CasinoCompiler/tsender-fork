"use client";

import InputField from "./ui/InputField";
import TransactionDetails from "./ui/TransactionDetails";
import {useState, useMemo, useEffect} from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/app/constants";
import {useChainId, useConfig, useAccount, useWriteContract, useReadContracts} from "wagmi";
import { readContract, waitForTransactionReceipt, WaitForTransactionReceiptErrorType } from "@wagmi/core";
import {calculateTotal} from "@/utils";

const AirdropForm: React.FC = () => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [hasEnoughTokens, setHasEnoughTokens] = useState(true)
    const [isLoading, setIsLoading] = useState(false);
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const { data: hash, isPending, writeContractAsync} = useWriteContract()
    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            }
        ],
    });

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress){
            alert("Address not found, please use a supported chain");
            return 0;
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [
                account.address,
                tSenderAddress as `0x${string}`
            ]
        })
        return response as number;

    }

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const tSenderAddress = chainsToTSender[chainId]["tsender"];
            const approvedAmount = await getApprovedAmount(tSenderAddress);
            console.log("approved amount: ", approvedAmount);

            if (approvedAmount < total) {
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [
                        tSenderAddress as `0x${string}`,
                        BigInt(total)
                    ]
                });
                    const approvalReceipt = await waitForTransactionReceipt(config, {hash: approvalHash});
                    console.log("Approval confirmed");
            }

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })

        } catch (error){
            // This catches other errors like RPC errors, wallet connection issues, etc.
            console.error("Error in approval process: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedTokenAddress = localStorage.getItem('tokenAddress')
        const savedRecipients = localStorage.getItem('recipients')
        const savedAmounts = localStorage.getItem('amounts')

        if (savedTokenAddress) setTokenAddress(savedTokenAddress)
        if (savedRecipients) setRecipients(savedRecipients)
        if (savedAmounts) setAmounts(savedAmounts)
    }, [])

    useEffect(() => {
        localStorage.setItem('tokenAddress', tokenAddress)
    }, [tokenAddress])

    useEffect(() => {
        localStorage.setItem('recipients', recipients)
    }, [recipients])

    useEffect(() => {
        localStorage.setItem('amounts', amounts)
    }, [amounts])

    useEffect(() => {
        if (tokenAddress && total > 0 && tokenData?.[2]?.result as number !== undefined) {
            const userBalance = tokenData?.[2].result as number;
            setHasEnoughTokens(userBalance >= total);
        } else {
            setHasEnoughTokens(true);
        }
    }, [tokenAddress, total, tokenData]);

    return (
        <div >
            <div className="space-y-5">
                <InputField 
                    label="Token Address"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={e => setTokenAddress(e.target.value)}
                />
                <InputField
                    label="Recipients (comma or new line separated)"
                    placeholder="0x123, 0x456"
                    value={recipients}
                    large={true}
                    onChange={e => setRecipients(e.target.value)}
                />
                <InputField
                    label="Amounts (wei; comma, space or new line separated)"
                    placeholder="100, 200, 300e18"
                    value={amounts}
                    large={true}
                    onChange={e => setAmounts(e.target.value)}
                />

                <TransactionDetails name={tokenData?.[0]?.result as string} decimals={tokenData?.[1]?.result as number} amount={total} />

                <button onClick={handleSubmit}
                    disabled={isLoading}
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        opacity: isLoading ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#2563eb"; // Darker blue on hover
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#3b82f6"; // Back to original color
                    }}
                >
                    {isLoading ? (
                        <>
                            <div
                                style={{
                                    width: "1rem",
                                    height: "1rem",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255, 255, 255, 0.3)",
                                    borderTopColor: "white",
                                    animation: "spin 1s linear infinite"
                                }}
                            ></div>
                            Processing...
                        </>
                    ) : (
                        "Send Tokens"
                    )}
                </button>
            </div>
        </div>
    )
}

export default AirdropForm;