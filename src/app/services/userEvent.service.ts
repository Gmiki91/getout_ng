import { computed, inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserEventService {
    url = environment.url + 'user-events';
    userService = inject(UserService);
    userId = computed(() => this.userService.user().id);
    constructor(private http: HttpClient) { }
    joinEvent(eventId: string): void {
        this.http.post<any>(`${this.url}/join/${this.userId()}/${eventId}`, null,).subscribe((response) => {
            console.log(response);
        });
    }
}