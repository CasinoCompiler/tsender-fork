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

    // Convert to numbers and sum
    return items.reduce((sum, item) => {
        // Handle scientific notation with 'e'
        if (/^-?\d+(\.\d+)?e\d+$/.test(item)) {
            const [base, exponent] = item.split('e');
            const expNum = parseInt(exponent, 10);

            // Validate the exponent is between 1 and 18
            if (expNum >= 1 && expNum <= 18) {
                return sum + parseFloat(base) * Math.pow(10, expNum);
            } else {
                // Invalid exponent range, ignore this item
                return sum;
            }
        } else {
            const num = parseFloat(item);
            // Only add valid numbers to the sum
            return isNaN(num) ? sum : sum + num;
        }
    }, 0);
  };