import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { privilagesVM } from '../models/privilagesVM';
import { privilageResponse } from '../models/privilageResponseVM';
import { privilagesResponse } from '../models/privilagesResponseVM';

@Injectable({
  providedIn: 'root'
})
export class PrivilageService {

  private BaseURL = "http://localhost:8080/api/v1/privilagectrl";

  constructor(private httpClient: HttpClient) { }

  addPrivilages(privilage : privilagesVM[]) : Observable<privilagesResponse>{
    return this.httpClient.post<privilagesResponse>(`${this.BaseURL}/addprivilages`,privilage);
  }

  getPrivilages() : Observable<privilagesResponse> {
    return this.httpClient.get<privilagesResponse>(`${this.BaseURL}/getprivilages`);
  }

  deletePrivilage(privilage : privilagesVM) : Observable<privilageResponse>{
    return this.httpClient.put<privilageResponse>(`${this.BaseURL}/deleteprivilage`,privilage);
  }
}
