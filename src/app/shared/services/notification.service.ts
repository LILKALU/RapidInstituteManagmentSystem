import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { notificationVM } from '../models/notificationVM';
import { Observable } from 'rxjs';
import { notificationResponseVM } from '../models/notificationResponseVM';
import { notificationResponsesVM } from '../models/notificationResponsesVM';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = "http://localhost:8080/api/v1/notificationctrl"

  addNotification(notification : notificationVM): Observable<notificationResponseVM>{
    return this.httpClient.post<notificationResponseVM>(`${this.BaseURL}/addnotification`,notification);
  }

  getNotification():Observable<notificationResponsesVM>{
    return this.httpClient.get<notificationResponsesVM>(`${this.BaseURL}/getnotification`);
  }

  
}
