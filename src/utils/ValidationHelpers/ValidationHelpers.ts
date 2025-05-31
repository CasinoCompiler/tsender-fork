export const validateToken = (tokenAddress: string | undefined, tokenName: string | undefined, tokenDecimals: number | undefined): boolean => {
    if (tokenAddress === undefined) return false;
    if (!tokenAddress) return false;

    const hasValidData = (tokenDecimals !== undefined) && (tokenName !== undefined && tokenName !== "")
    return hasValidData
}

export const validateHasEnoughTokens = (isValid: boolean, userBalance: number, total: number): boolean => {
    if (!isValid || total === 0) return false;
    if (userBalance === undefined) return false;
    return userBalance >= total;
}

export const validateRecipientsAmountsMatch = (recipients: string, amounts: string): boolean => {
    // Handle empty inputs
    if (!recipients.trim() || !amounts.trim()) return false;

    // Parse recipients (same logic as in handleSubmit)
    const parsedRecipients = recipients
        .split(/[,\n]+/)
        .map(addr => addr.trim())
        .filter(addr => addr !== '');

    // Parse amounts (similar logic as in handleSubmit, but simplified for validation)
    const parsedAmounts = amounts
        .split(/[,\n\s]+/)
        .map(amt => amt.trim())
        .filter(amt => amt !== '')
        .filter(amt => {
            // Handle scientific notation with 'e'
            if (/^-?\d+(\.\d+)?e\d+$/.test(amt)) {
                const [, exponent] = amt.split('e');
                const expNum = parseInt(exponent, 10);
                return expNum >= 1 && expNum <= 18;
            } else {
                const num = parseFloat(amt);
                return !isNaN(num) && num > 0;
            }
        });

    // Check if counts match
    return parsedRecipients.length === parsedAmounts.length && parsedRecipients.length > 0;
};