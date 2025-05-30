/**
 * Calculates the total sum from a string of amounts
 * @param amountsString - String containing numbers separated by commas, spaces, newlines, or combinations
 * @returns The sum of all valid numbers
 */
export const calculateTotal = (amountsString: string): number => {
    // Handle empty input
    if (!amountsString || amountsString.trim() === '') {
        return 0;
    }

    // Normalize input: replace commas and newlines with spaces
    const normalizedInput = amountsString
        .replace(/,/g, ' ')
        .replace(/\n/g, ' ');

    // Split by spaces and clean up
    const items = normalizedInput
        .split(/\s+/)
        .map(item => item.trim())
        .filter(item => item !== '');

    // REMOVED: All scientific notation handling logic
    // SIMPLIFIED: Now only handles regular numbers
    const totalBigInt = items.reduce((sum, item) => {
        const num = parseFloat(item);
        // ADDED: Only accept positive numbers (>= 0), reject negative values
        return isNaN(num) || num < 0 ? sum : sum + BigInt(Math.floor(num));
    }, BigInt(0));

    console.log("totalBigInt number:", Number(totalBigInt));
    // Convert back to number for return (this is safe for display purposes)
    return Number(totalBigInt);
};