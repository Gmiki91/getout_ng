import { TimeTextPipe } from "./time-text.pipe";

describe('TimeTextPipe', () => {
  let pipe: TimeTextPipe;

  beforeEach(() => {
    pipe = new TimeTextPipe();
  });

  it('should return "just now" for a comment that just been added', () => {
    const now = new Date().toISOString();
    expect(pipe.transform(now, 'comment')).toBe('just now');
  });

  it('should return "just now" for a comment that was added less than a minute ago', () => {
    const lessThanOneMinuteAgo = new Date(Date.now() - 30 * 1000).toISOString(); // 30 seconds ago
    expect(pipe.transform(lessThanOneMinuteAgo, 'comment')).toBe('just now');
  });

  it('should return "1 minute ago" for a comment that was added 1 minute ago', () => {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000).toISOString();
    expect(pipe.transform(oneMinuteAgo, 'comment')).toBe('1 minute ago');
  });

  it('should return "5 minutes left" for an event in 5 minutes', () => {
    const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    expect(pipe.transform(fiveMinutesLater, 'event')).toBe('5 minutes left');
  });

  it('should return "1 hour ago" for a comment that was added 1 hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(oneHourAgo, 'comment')).toBe('1 hour ago');
  });

  it('should return "1 day ago" for a comment from yesterday', () => {
    const oneDayAgo = new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(); // 30 hours ago
    expect(pipe.transform(oneDayAgo, 'comment')).toBe('1 day ago');
  });

  it('should return "2 days left" for an event 2 days from now', () => {
    const twoDaysLater = new Date(Date.now() + 2 * 25 * 60 * 60 * 1000).toISOString(); // 2 (+2 hours) days in the future
    expect(pipe.transform(twoDaysLater, 'event')).toBe('2 days left');
  });

  it('should return "Started at [time]" when the event has already passed', () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
    const formattedTime = new Date(pastDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    expect(pipe.transform(pastDate, 'event')).toBe(`Started at ${formattedTime}`);
  });


  it('should handle null values', () => {
    const result = pipe.transform(null,'event');
    expect(result).toBe('unknown time');
  });

  it('should handle undefined values', () => {
    const result = pipe.transform(undefined,'comment');
    expect(result).toBe('unknown time');
  });
 
});