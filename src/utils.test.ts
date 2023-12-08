import { findLeastCommonMultiple, getDivisors, getPrimes } from './utils';

describe('utils.ts', () => {
  describe('getPrimes', () => {
    it('should return correct primes', () => {
      expect(getPrimes(25)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23]);
    });
  });

  describe('getDivisors', () => {
    it('should return correct divisors', () => {
      expect(getDivisors(2)).toEqual([2]);
      expect(getDivisors(4)).toEqual([2, 2]);
      expect(getDivisors(5)).toEqual([5]);
      expect(getDivisors(6)).toEqual([2, 3]);
      expect(getDivisors(12)).toEqual([2, 2, 3]);
      expect(getDivisors(15)).toEqual([3, 5]);
    });
  });

  describe('findLeastCommonMultiple', () => {
    it('should return correct value', () => {
      expect(findLeastCommonMultiple([2, 2])).toEqual(2);
      expect(findLeastCommonMultiple([2, 3])).toEqual(6);
      expect(findLeastCommonMultiple([3, 5])).toEqual(15);
      expect(findLeastCommonMultiple([3, 5, 3])).toEqual(15);
      expect(findLeastCommonMultiple([9, 5, 3])).toEqual(45);
      expect(findLeastCommonMultiple([2, 3, 5])).toEqual(30);
    });
  });
});
