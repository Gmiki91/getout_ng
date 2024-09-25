import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeText',
    standalone: true,
})
export class TimeTextPipe implements PipeTransform {
    transform(value: string, format:'until' | 'since'): string {
        const eventDate = new Date(value);
        const now = new Date();
        const millisecondsDiff = format === 'until' ? eventDate.getTime() - now.getTime() : now.getTime()-eventDate.getTime();

        //only applicable to until format
        if (millisecondsDiff < 0) {
            return 'Started at ' + this.formatTime(eventDate);
        }

        const appendix = format === 'until' ? 'left' : 'ago';

        const minutesDiff = Math.round(millisecondsDiff / (1000 * 60));
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);

        if (daysDiff >= 1) {
            return daysDiff === 1 ? `1 day ${appendix}` : `${daysDiff} days ${appendix}`;
        }

        if (hoursDiff >= 1) {
            return hoursDiff === 1 ? `1 hour ${appendix}` : `${hoursDiff} hours ${appendix}`;
        }

        return minutesDiff === 1 ? `1 minute ${appendix}` : `${minutesDiff} minutes ${appendix}`;
    }

    private formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}