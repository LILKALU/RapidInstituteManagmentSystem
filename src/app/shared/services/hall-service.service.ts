import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { hallResponse } from '../models/hallResponseVM';
import { HallVM } from '../models/hallVM';
import { HallsResponseVM } from '../models/hallsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class HallServiceService {

  private BaseURL = "http://localhost:8080/api/v1/hallctrl";
  
  constructor(private httpClient: HttpClient) { }

  createHall(hall :HallVM) : Observable<hallResponse> {
    return this.httpClient.post<hallResponse>(`${this.BaseURL}/addhall`,hall);
  }

  getHalls() : Observable<HallsResponseVM> {
    return this.httpClient.get<HallsResponseVM>(`${this.BaseURL}/gethall`);
  }

  updateHall(hall :HallVM) : Observable<hallResponse> {
    return this.httpClient.put<hallResponse>(`${this.BaseURL}/updatehall`,hall);
  }

  deleteHall(hall :HallVM) : Observable<hallResponse> {
    return this.httpClient.put<hallResponse>(`${this.BaseURL}/deletehall`,hall);
  }
}
