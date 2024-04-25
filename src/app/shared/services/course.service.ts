import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseResponse } from '../models/courseResponse';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private BaseURL = "http://localhost:8080/api/v1/coursectrl"

  constructor(private httpClient: HttpClient) { }

  getCourses() : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcourses`)
  }
}
