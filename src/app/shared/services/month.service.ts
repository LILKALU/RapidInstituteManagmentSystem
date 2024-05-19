import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthsResponseVM } from '../models/monthsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class MonthService {

  private BaseURL = "http://localhost:8080/api/v1/monthctrl"

  constructor(private httpClient: HttpClient) { }

  getMonths() : Observable<MonthsResponseVM>{
    return this.httpClient.get<MonthsResponseVM>(`${this.BaseURL}/getmonths`);
  }
}
