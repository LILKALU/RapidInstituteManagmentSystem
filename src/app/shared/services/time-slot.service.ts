import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeSlotsResponse } from '../models/timeSlotsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {

  private BaseURL = "http://localhost:8080/api/v1/timeslotctrl";

  constructor(
    private httpClient: HttpClient
  ) { }

  getTimeSlots() : Observable<timeSlotsResponse>{
    return this.httpClient.get<timeSlotsResponse>(`${this.BaseURL}/gettimeslot`);
  }
}
