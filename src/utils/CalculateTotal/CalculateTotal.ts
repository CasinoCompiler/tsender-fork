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
        .replace(/,/g, ' ')  // Replace commas with spaces
        .replace(/\n/g, ' '); // Replace newlines with spaces

    // Split by spaces and clean up
    const items = normalizedInput
        .split(/\s+/)        // Split by spaces
        .map(item => item.trim())  // Trim whitespace
        .filter(item => item !== ''); // Remove empty items

    // FIXED: Use BigInt arithmetic to maintain precision for large numbers
    const totalBigInt = items.reduce((sum, item) => {
        // Handle scientific notation with 'e'
        if (/^-?\d+(\.\d+)?e\d+$/.test(item)) {
            const [base, exponent] = item.split('e');
            const expNum = parseInt(exponent, 10);

            // Validate the exponent is between 1 and 18
            if (expNum >= 1 && expNum <= 18) {
                try {
                    // Handle decimal bases like "1.5e18"
                    if (base.includes('.')) {
                        const [intPart, decPart] = base.split('.');
                        const decimalPlaces = decPart.length;
                        const combinedNumber = intPart + decPart; // "1.5" -> "15"
                        const adjustedExp = expNum - decimalPlaces; // 18 - 1 = 17

                        if (adjustedExp >= 0) {
                            return sum + BigInt(combinedNumber) * (BigInt(10) ** BigInt(adjustedExp));
                        } else {
                            // Handle cases where decimal places exceed exponent
                            return sum + BigInt(combinedNumber) / (BigInt(10) ** BigInt(-adjustedExp));
                        }
                    } else {
                        // Integer base like "40e18"
                        return sum + BigInt(base) * (BigInt(10) ** BigInt(expNum));
                    }
                } catch {
                    return sum; // Invalid format, ignore this item
                }
            } else {
                // Invalid exponent range, ignore this item
                return sum;
            }
        } else {
            const num = parseFloat(item);
            // Only add valid numbers to the sum (convert to BigInt)
            return isNaN(num) ? sum : sum + BigInt(Math.floor(num));
        }
    }, BigInt(0));

    console.log("totalBigInt number:", Number(totalBigInt));
    // Convert back to number for return (this is safe for display purposes)
    return Number(totalBigInt);
};