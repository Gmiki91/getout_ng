import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeUntil',
    standalone: true,
})
export class TimeUntilPipe implements PipeTransform {
    transform(value: string): string {
        const eventDate = new Date(value);
        const now = new Date();
        const millisecondsDiff = eventDate.getTime() - now.getTime();

        if (millisecondsDiff < 0) {
            return 'Started at ' + this.formatTime(eventDate);
        }

        const minutesDiff = Math.round(millisecondsDiff / (1000 * 60));
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);

        if (daysDiff >= 1) {
            return daysDiff === 1 ? '1 day left' : `${daysDiff} days left`;
        }

        if (hoursDiff >= 1) {
            return hoursDiff === 1 ? '1 hour left' : `${hoursDiff} hours left`;
        }

        return minutesDiff === 1 ? '1 minute left' : `${minutesDiff} minutes left`;
    }

    private formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}