"use client";

import InputField from "./ui/InputField";
import TransactionDetails from "./ui/TransactionDetails";
import {useState, useMemo, useEffect} from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/app/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts, useWaitForTransactionReceipt } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import {calculateTotal} from "@/utils";
import { CgSpinner } from "react-icons/cg"

const AirdropForm: React.FC = () => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    //const [hasEnoughTokens, setHasEnoughTokens] = useState(true)
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
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    const tokenDecimals = tokenData?.[0]?.result as number
    const tokenName = tokenData?.[1]?.result as string
    const userBalance = tokenData?.[2]?.result as number

    const isValidToken = useMemo(() => {
        if (!tokenAddress) return false
        if (!tokenData) return false

        // Debug logging
        console.log("Token validation debug:", {
            tokenAddress,
            tokenData,
            tokenDecimals,
            tokenName,
            userBalance,
            hasErrors: tokenData.some(result => result.error)
        })

        // Check if any of the contract calls failed
        const hasErrors = tokenData.some(result => result.error)
        if (hasErrors) return false

        // Check if we got valid responses (decimals should be a number, name should be a string)
        const hasValidData = (tokenDecimals !== undefined) && (tokenName !== undefined && tokenName !== "")
        return hasValidData
    }, [tokenAddress, tokenData, tokenDecimals, tokenName, userBalance])

    const hasEnoughTokens = useMemo(() => {
        // If token is invalid or no balance data, assume true (handled elsewhere)
        if (!isValidToken || !userBalance || total === 0) return true

        console.log("Balance check:", {
            userBalance,
            total,
            hasEnough: userBalance >= total
        })

        return userBalance >= total
    }, [isValidToken, userBalance, total])

    const isFormValid = useMemo(() => {
        return tokenAddress &&
            recipients &&
            amounts &&
            isValidToken &&
            hasEnoughTokens &&
            total > 0
    }, [tokenAddress, recipients, amounts, isValidToken, hasEnoughTokens, total])

    // Button state logic
    const getButtonState = () => {
        if (isPending) return 'confirming'
        if (isConfirming) return 'waiting'
        if (isError) return 'error'
        if (isConfirmed) return 'success'
        if (!tokenAddress) return 'empty'

        // If we have a token address but no token data yet, we're still loading
        if (tokenAddress && !tokenData) return 'empty'

        // If token data loaded but invalid
        if (tokenAddress && tokenData && !isValidToken) return 'invalid-token'

        // If missing recipients or amounts
        if (!recipients || !amounts) return 'incomplete'

        // If valid token but insufficient balance (check this AFTER incomplete fields)
        if (isValidToken && total > 0 && !hasEnoughTokens) return 'insufficient-balance'

        return 'ready'
    }

    const buttonState = getButtonState()

    const getButtonContent = () => {
        switch (buttonState) {
            case 'confirming':
                return (
                    <div className="flex items-center justify-center gap-2">
                        <CgSpinner className="animate-spin" size={20} />
                        <span>Confirm in wallet...</span>
                    </div>
                )
            case 'waiting':
                return (
                    <div className="flex items-center justify-center gap-2">
                        <CgSpinner className="animate-spin" size={20} />
                        <span>Processing transaction...</span>
                    </div>
                )
            case 'error':
                return "Transaction failed"
            case 'success':
                return "Transaction confirmed!"
            case 'empty':
                return tokenAddress && !tokenData ? "Loading token data..." : "Enter token address"
            case 'invalid-token':
                return "Invalid token address"
            case 'insufficient-balance':
                return "Insufficient token balance"
            case 'incomplete':
                return "Complete all fields"
            case 'ready':
                return "Send Tokens"
            default:
                return "Send Tokens"
        }
    }

    const isButtonDisabled = () => {
        const state = buttonState
        return isPending ||
            isConfirming ||
            state === 'invalid-token' ||
            state === 'insufficient-balance' ||
            state === 'incomplete' ||
            state === 'empty' ||
            state === 'error' ||
            !isFormValid
    }

    const getButtonStyles = () => {
        const baseStyles = `
            relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 
            focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-lg
            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b 
            before:from-white/20 before:to-transparent before:pointer-events-none
            after:absolute after:inset-[1px] after:rounded-[11px] after:border 
            after:border-white/20 after:pointer-events-none
        `

        if (isButtonDisabled()) {
            return `${baseStyles} bg-gray-400 cursor-not-allowed opacity-60`
        }

        if (buttonState === 'error') {
            return `${baseStyles} bg-red-500 hover:bg-red-600 focus:ring-red-500/50`
        }

        if (buttonState === 'success') {
            return `${baseStyles} bg-green-500 hover:bg-green-600 focus:ring-green-500/50`
        }

        return `${baseStyles} bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500/50 transform hover:scale-[1.01] active:scale-[0.99]`
    }

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

    async function handleSubmit() {
        if (isButtonDisabled()) return

        try {
            const tSenderAddress = chainsToTSender[chainId]["tsender"]
            const approvedAmount = await getApprovedAmount(tSenderAddress)

            if (approvedAmount < total) {
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, BigInt(total)],
                })

                await waitForTransactionReceipt(config, { hash: approvalHash })
            }

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        } catch (err) {
            console.error("Transaction error:", err)
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

                <button
                    className={getButtonStyles()}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled()}
                >
                    {getButtonContent()}
                </button>
            </div>
        </div>
    )
}

export default AirdropForm;