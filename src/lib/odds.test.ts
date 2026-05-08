import { describe, it, expect } from 'vitest';
import {
  americanToDecimal, decimalToAmerican, decimalToFractional, fractionalToDecimal,
  decimalToImplied, impliedToDecimal, fmtPct, fmtMoney, fmtNum,
} from './odds';

describe('odds conversions', () => {
  describe('americanToDecimal', () => {
    it('converts +150 to 2.5', () => { expect(americanToDecimal(150)).toBeCloseTo(2.5, 5); });
    it('converts -200 to 1.5', () => { expect(americanToDecimal(-200)).toBeCloseTo(1.5, 5); });
    it('converts +100 to 2.0', () => { expect(americanToDecimal(100)).toBeCloseTo(2.0, 5); });
    it('returns NaN for 0', () => { expect(americanToDecimal(0)).toBeNaN(); });
  });

  describe('decimalToAmerican', () => {
    it('converts 2.5 to +150', () => { expect(decimalToAmerican(2.5)).toBe(150); });
    it('converts 1.5 to -200', () => { expect(decimalToAmerican(1.5)).toBe(-200); });
    it('converts 2.0 to +100', () => { expect(decimalToAmerican(2.0)).toBe(100); });
    it('returns NaN for <=1', () => { expect(decimalToAmerican(1)).toBeNaN(); });
  });

  describe('decimalToFractional', () => {
    it('converts 2.5 to 3/2', () => { expect(decimalToFractional(2.5)).toBe('3/2'); });
    it('converts 2.0 to 1/1', () => { expect(decimalToFractional(2.0)).toBe('1/1'); });
    it('converts 3.0 to 2/1', () => { expect(decimalToFractional(3.0)).toBe('2/1'); });
  });

  describe('fractionalToDecimal', () => {
    it('converts 3/2 to 2.5', () => { expect(fractionalToDecimal(3, 2)).toBeCloseTo(2.5, 5); });
    it('returns NaN on 0 denominator', () => { expect(fractionalToDecimal(1, 0)).toBeNaN(); });
  });

  describe('implied probability', () => {
    it('decimalToImplied 2.0 -> 0.5', () => { expect(decimalToImplied(2.0)).toBeCloseTo(0.5, 5); });
    it('decimalToImplied 4.0 -> 0.25', () => { expect(decimalToImplied(4.0)).toBeCloseTo(0.25, 5); });
    it('impliedToDecimal 0.5 -> 2.0', () => { expect(impliedToDecimal(0.5)).toBeCloseTo(2.0, 5); });
  });

  describe('formatters', () => {
    it('fmtPct', () => { expect(fmtPct(0.5)).toBe('50.00%'); });
    it('fmtPct on NaN', () => { expect(fmtPct(NaN)).toBe('—'); });
    it('fmtMoney default EUR', () => { expect(fmtMoney(123.456)).toBe('€123.46'); });
    it('fmtNum digits', () => { expect(fmtNum(1.2345, 3)).toBe('1.234'); });
  });
});
