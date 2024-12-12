import { Pipe, PipeTransform } from '@angular/core';

/**
 * Shows how much time passed since - or how much time is left until - date.
 * @param value  a date as a string value in ISO format (new Date().toISOString())
 * @param type changes return value based on whether it's a comment or an event (comments are only in the past, events can be in the future and in the past)
 */

@Pipe({
  name: 'timeText',
  standalone: true,
})
export class TimeTextPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    type: 'comment' | 'event'
  ): string {
    if (value == null) {
      return 'unknown time';
    }
    const eventDate = new Date(value);
    const now = new Date();
    const millisecondsDiff =
      type === 'event'
        ? eventDate.getTime() - now.getTime()
        : now.getTime() - eventDate.getTime();

    //only applicable for event in the past
    if (millisecondsDiff < 0) {
      return this.eventInThePast(millisecondsDiff);
    }
    const appendix = type === 'event' ? 'left' : 'ago';

    const minutesDiff = Math.floor(millisecondsDiff / (1000 * 60));
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);

    if (daysDiff >= 1) {
      return daysDiff === 1
        ? `1 day ${appendix}`
        : `${daysDiff} days ${appendix}`;
    }

    if (hoursDiff >= 1) {
      return hoursDiff === 1
        ? `1 hour ${appendix}`
        : `${hoursDiff} hours ${appendix}`;
    }
    if (minutesDiff >= 1) {
      return minutesDiff === 1
        ? `1 minute ${appendix}`
        : `${minutesDiff} minutes ${appendix}`;
    }
    return 'just now';
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private eventInThePast(millisecondsDiff: number): string {
    const minutesDiff = Math.floor(Math.abs(millisecondsDiff) / (1000 * 60));
    const hoursDiff = Math.floor(minutesDiff / 60);

    if (hoursDiff >= 1) {
      return hoursDiff === 1
        ? `1 hour ago`
        : `${hoursDiff} hours ago`;
    }

    if (minutesDiff >= 1) {
      return minutesDiff === 1
        ? `1 minute ago`
        : `${minutesDiff} minutes ago`;
    }

    return 'Just now';
  }
}
