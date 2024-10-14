import { DistanceFormatPipe } from './distance-format.pipe';

describe('DistanceFormatPipe', () => {
  let pipe: DistanceFormatPipe;

  beforeEach(() => {
    pipe = new DistanceFormatPipe();
  });

  it('should return the distance in kilometers when greater than 1000 meters', () => {
    const result = pipe.transform(1500);
    expect(result).toBe('1.5 km');
  });

  it('should return the distance in meters when less than 1000 meters', () => {
    const result = pipe.transform(500);
    expect(result).toBe('500 m');
  });

  it('should return "1 km" when distance is exactly 1000 meters', () => {
    const result = pipe.transform(1000);
    expect(result).toBe('1 km');
  });

  it('should return "0 m" for a distance of 0', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0 m');
  });

  it('should handle negative values', () => {
    const result = pipe.transform(-500);
    expect(result).toBe('unkown distance');
  });

  it('should handle null values', () => {
    const result = pipe.transform(null);
    expect(result).toBe('unkown distance');
  });
  it('should handle undefined values', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('unkown distance');
  });
});
