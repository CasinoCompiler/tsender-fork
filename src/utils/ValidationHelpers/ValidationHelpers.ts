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
