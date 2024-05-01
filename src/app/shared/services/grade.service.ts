import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gradesResponse } from '../models/gradesResponseVM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private BaseURL = "http://localhost:8080/api/v1/gradectrl"

  constructor(private httpClient: HttpClient) { }

  getGrades() : Observable<gradesResponse>{
    return this.httpClient.get<gradesResponse>(`${this.BaseURL}/getgrades`);
  }
}
