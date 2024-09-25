import { Injectable, inject,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Komment, NewKommentData } from '../models/komment.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KommentService {
  private http = inject(HttpClient);
  private url = environment.url + 'comments';
  private _comments = signal<Komment[]>([]);
  comments=this._comments.asReadonly();

  public addKomment(komment: NewKommentData){
    this.http.post<Komment>(this.url,komment)
    .pipe(tap({error: (err) => console.error('Failed to add comment:', err)}))
    .subscribe(komment=>{
      this._comments.update(comments=>[komment,...comments])
    });
  }
  public getKomments(eventId:string){
    this.http.get<Komment[]>(`${this.url}/${eventId}`).subscribe(result=>this._comments.set(result));
  }
}
