import { calculateDistance } from './utils';
describe('utils', () => {
  describe('calculateDistance', () => {
    it('should correctly calculate the distance between two nearby points', () => {
      // London
      const lat1 = 51.5074;
      const lng1 = -0.1278;

      // Paris
      const lat2 = 48.8566;
      const lng2 = 2.3522;

      // Known distance between London and Paris (approx. 344 km)
      const expectedDistance = 344;

      // Call the function and get the result
      const distance = calculateDistance(lat1, lng1, lat2, lng2) / 1000;

      // Use Jest's `expect` to compare the result to the expected distance
      expect(distance).toBeCloseTo(expectedDistance, 0);
    });
    it('should return 0 for the same point', () => {
      const lat1 = 51.5074;
      const lng1 = -0.1278;

      // Since the points are the same, the distance should be 0
      const distance = calculateDistance(lat1, lng1, lat1, lng1);
      expect(distance).toBe(0);
    });
  });
});
