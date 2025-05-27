import { describe, it, expect } from 'vitest';
import { calculateTotal } from './CalculateTotal';

describe('calculateTotal', () => {
    // Empty or invalid inputs
    it('should return 0 for empty input', () => {
        expect(calculateTotal('')).toBe(0);
        expect(calculateTotal('   ')).toBe(0);
        expect(calculateTotal(null as unknown as string)).toBe(0);
        expect(calculateTotal(undefined as unknown as string)).toBe(0);
    });

    // Single number inputs
    it('should calculate correctly for a single number', () => {
        expect(calculateTotal('100')).toBe(100);
        expect(calculateTotal('  100  ')).toBe(100);
        expect(calculateTotal('0')).toBe(0);
        expect(calculateTotal('-50')).toBe(-50);
        expect(calculateTotal('123.45')).toBe(123.45);
    });

    // Comma-separated inputs
    it('should calculate correctly for comma-separated numbers', () => {
        expect(calculateTotal('100, 200')).toBe(300);
        expect(calculateTotal('100,200,300')).toBe(600);
        expect(calculateTotal('  100 , 200  ,  300  ')).toBe(600);
        expect(calculateTotal('10.5,20.3,30.7')).toBe(61.5);
        expect(calculateTotal('-10,20,-30')).toBe(-20);
    });

    // Newline-separated inputs
    it('should calculate correctly for newline-separated numbers', () => {
        expect(calculateTotal('100\n200')).toBe(300);
        expect(calculateTotal('100\n200\n300')).toBe(600);
        expect(calculateTotal('  100 \n 200  \n  300  ')).toBe(600);
        expect(calculateTotal('10.5\n20.3\n30.7')).toBe(61.5);
        expect(calculateTotal('-10\n20\n-30')).toBe(-20);
    });

    // Space-separated inputs (new)
    it('should calculate correctly for space-separated numbers', () => {
        expect(calculateTotal('100 200')).toBe(300);
        expect(calculateTotal('100 200 300')).toBe(600);
        expect(calculateTotal('  100   200    300  ')).toBe(600);
        expect(calculateTotal('10.5 20.3 30.7')).toBe(61.5);
        expect(calculateTotal('-10 20 -30')).toBe(-20);
    });

    // Scientific notation inputs (new)
    it('should handle scientific notation within allowed range (e1-e18)', () => {
        expect(calculateTotal('1e6')).toBe(1000000);
        expect(calculateTotal('100e6')).toBe(100000000);
        expect(calculateTotal('1.5e3')).toBe(1500);
        expect(calculateTotal('-2e3')).toBe(-2000);
        expect(calculateTotal('1e1')).toBe(10);
        expect(calculateTotal('1e18')).toBe(1e18);
    });

    it('should ignore scientific notation outside the allowed range', () => {
        expect(calculateTotal('1e0')).toBe(0); // Ignores 1e0 as invalid
        expect(calculateTotal('1e19')).toBe(0); // Ignores 1e19 as invalid
        expect(calculateTotal('1e19 100')).toBe(100); // Ignores 1e19, keeps 100
    });

    // Mixed format inputs (both commas, spaces, and newlines)
    it('should calculate correctly for mixed format inputs', () => {
        expect(calculateTotal('100, 200\n300')).toBe(600);
        expect(calculateTotal('100\n200, 300, 400\n500')).toBe(1500);
        expect(calculateTotal('  100 , 200  \n  300 , 400  \n  500  ')).toBe(1500);
        expect(calculateTotal('100 200, 300\n400')).toBe(1000);
        expect(calculateTotal('100,200 300')).toBe(600);
    });

    // Mixed with scientific notation
    it('should correctly mix regular numbers with scientific notation', () => {
        expect(calculateTotal('100 1e3')).toBe(1100);
        expect(calculateTotal('1e6, 200, 300')).toBe(1000500);
        expect(calculateTotal('100\n1e3\n200')).toBe(1300);
        expect(calculateTotal('1.5e2 200 1e3')).toBe(1350);
    });

    // Inputs with invalid values mixed in
    it('should ignore invalid values in the input', () => {
        expect(calculateTotal('100, abc, 200')).toBe(300);
        expect(calculateTotal('100\nabc\n200')).toBe(300);
        expect(calculateTotal('100, , 200')).toBe(300);
        expect(calculateTotal('abc')).toBe(0);
        expect(calculateTotal('100, NaN, 200')).toBe(300);
        expect(calculateTotal('100 xyz 200')).toBe(300);
    });

    // Multiple consecutive separators
    it('should handle multiple consecutive separators', () => {
        expect(calculateTotal('100,,200')).toBe(300);
        expect(calculateTotal('100,,,200')).toBe(300);
        expect(calculateTotal('100\n\n200')).toBe(300);
        expect(calculateTotal('100,\n,200')).toBe(300);
        expect(calculateTotal('100   200')).toBe(300);
        expect(calculateTotal('100, ,\n 200')).toBe(300);
    });

    // Very large inputs
    it('should handle large numbers correctly', () => {
        expect(calculateTotal('9999999, 9999999')).toBe(19999998);
        expect(calculateTotal('0.1, 0.2')).toBeCloseTo(0.3, 5); // Handling floating point precision
    });
});