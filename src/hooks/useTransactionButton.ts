import { useState, useEffect, useRef } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

type ButtonState = 'idle' | 'confirming' | 'waiting' | 'success' | 'error'

export const useTransactionButton = () => {
    const [buttonState, setButtonState] = useState<ButtonState>('idle')
    const { data: hash, isPending, writeContractAsync } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    // Track when confirming state started to detect cancellations
    const confirmingStartTime = useRef<number | null>(null)

    // Update button state based on transaction status
    useEffect(() => {
        if (isPending) {
            setButtonState('confirming')
            // Record when confirming started
            if (confirmingStartTime.current === null) {
                confirmingStartTime.current = Date.now()
            }
        } else if (isConfirming) {
            setButtonState('waiting')
            confirmingStartTime.current = null // Clear timeout tracking
        } else if (isError) {
            setButtonState('error')
            confirmingStartTime.current = null
        } else if (isConfirmed) {
            setButtonState('success')
            confirmingStartTime.current = null

            // Reset to idle after showing success for 2 seconds
            const timer = setTimeout(() => {
                setButtonState('idle')
            }, 2000)

            return () => clearTimeout(timer)
        } else {
            // If we're not pending anymore and haven't confirmed, user likely cancelled
            if (confirmingStartTime.current !== null) {
                setButtonState('idle')
                confirmingStartTime.current = null
            }
        }
    }, [isPending, isConfirming, isError, isConfirmed])

    // Timeout to detect stuck confirming state (user cancelled)
    useEffect(() => {
        if (buttonState === 'confirming') {
            // After 30 seconds in confirming state, assume cancellation
            const timeout = setTimeout(() => {
                console.log('Transaction confirmation timeout - resetting state')
                setButtonState('idle')
                confirmingStartTime.current = null
            }, 30000) // 30 second timeout

            return () => clearTimeout(timeout)
        }
    }, [buttonState])

    // Reset function for manual reset
    const resetButtonState = () => {
        setButtonState('idle')
        confirmingStartTime.current = null
    }

    return {
        buttonState,
        writeContractAsync,
        resetButtonState,
        hash
    }
}