"use client";

import InputField from "./ui/InputField";
import TransactionDetails from "./ui/TransactionDetails";
import { useState, useMemo, useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/app/constants";
import { useChainId, useConfig, useAccount, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal, validateToken, validateHasEnoughTokens } from "@/utils";
import { CgSpinner } from "react-icons/cg"
import { useTransactionButton } from "@/hooks/useTransactionButton";

const AirdropForm: React.FC = () => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();

    const { buttonState, writeContractAsync, resetButtonState } = useTransactionButton()

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

    const tokenName = tokenData?.[0]?.result as string
    const tokenDecimals = tokenData?.[1]?.result as number
    const userBalance = tokenData?.[2]?.result as number

    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

    const isValidToken = useMemo(() => validateToken(tokenAddress, tokenName, tokenDecimals), [tokenAddress, tokenName, tokenDecimals])

    const hasEnoughTokens = useMemo(() => validateHasEnoughTokens(isValidToken, userBalance, total), [isValidToken, userBalance, total])

    const isFormValid = useMemo(() => {
        return tokenAddress &&
            recipients &&
            amounts &&
            isValidToken &&
            hasEnoughTokens &&
            total > 0
    }, [tokenAddress, recipients, amounts, isValidToken, hasEnoughTokens, total])

    // Button state logic that combines transaction state with form validation
    const getButtonStateForValidation = () => {
        // If transaction is in progress, return the transaction state
        if (buttonState !== 'idle') {
            return buttonState
        }

        // Validate the form step by step
        if (!tokenAddress) return 'empty'
        if (tokenAddress && !tokenData) return 'loading'
        if (tokenAddress && tokenData && !isValidToken) return 'invalid-token'
        if (!recipients || !amounts) return 'incomplete'

        // Check balance specifically - this is the key fix
        if (isValidToken && total > 0 && userBalance !== undefined) {
            if (!hasEnoughTokens) {
                return 'insufficient-balance'
            }
        }

        // If we have balance data but it's still loading
        if (userBalance === undefined && tokenAddress && tokenData) return 'loading'

        return 'ready'
    }

    const currentButtonState = getButtonStateForValidation()

    const isButtonDisabled = () => {
        return currentButtonState === 'confirming' ||
            currentButtonState === 'waiting' ||
            currentButtonState === 'invalid-token' ||
            currentButtonState === 'insufficient-balance' ||
            currentButtonState === 'incomplete' ||
            currentButtonState === 'empty' ||
            !isFormValid
    }

    const getButtonContent = () => {
        switch (currentButtonState) {
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
                return "Transaction failed - Try again"
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

        if (currentButtonState === 'error') {
            return `${baseStyles} bg-red-500 hover:bg-red-600 focus:ring-red-500/50`
        }

        if (currentButtonState === 'success') {
            return `${baseStyles} bg-green-500 hover:bg-green-600 focus:ring-green-500/50`
        }

        return `${baseStyles} bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500/50 transform hover:scale-[1.01] active:scale-[0.99]`
    }

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
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

    function parseAmount(amountString: string): number {
        const trimmed = amountString.trim()
        if (!trimmed) return 0

        if (/^-?\d+(\.\d+)?e\d+$/.test(trimmed)) {
            const [base, exponent] = trimmed.split('e')
            const expNum = parseInt(exponent, 10)

            if (expNum >= 1 && expNum <= 18) {
                return parseFloat(base) * Math.pow(10, expNum)
            } else {
                return 0
            }
        } else {
            const num = parseFloat(trimmed)
            return isNaN(num) ? 0 : num
        }
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

            const parsedAmounts = amounts
                .split(/[,\n\s]+/)
                .map(amt => amt.trim())
                .filter(amt => amt !== '')
                .map(amt => parseAmount(amt))
                .filter(amt => amt > 0)
                .map(amt => BigInt(Math.floor(amt)))

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    parsedAmounts,
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
        <div>
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
                    placeholder="100, 200 300e18"
                    value={amounts}
                    large={true}
                    onChange={e => setAmounts(e.target.value)}
                />

                <TransactionDetails name={tokenName} decimals={tokenDecimals} amount={total} />

                <button
                    className={getButtonStyles()}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled()}
                >
                    {getButtonContent()}
                </button>

                {/* Manual reset button for error states */}
                {currentButtonState === 'error' && (
                    <button
                        onClick={resetButtonState}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    )
}

export default AirdropForm;