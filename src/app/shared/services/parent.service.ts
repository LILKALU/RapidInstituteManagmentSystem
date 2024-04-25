import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { parentResponseVM } from '../models/parentResponseVM';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  private BaseURL = "http://localhost:8080/api/v1/parentctrl";

  constructor(private httpClient: HttpClient) { }

  getParentById(nic : string) : Observable<parentResponseVM>{
    return this.httpClient.get<parentResponseVM>(`${this.BaseURL}/getparentbyid/${nic}`);
  }

}
