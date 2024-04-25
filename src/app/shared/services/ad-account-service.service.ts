import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADAccountResponseVM } from '../models/adAccountResponseVM';
import { ADAccountVM } from '../models/adAccountVM';

@Injectable({
  providedIn: 'root'
})
export class AdAccountServiceService {

  private BaseURL = "http://localhost:8080/api/v1/adaccountctrl"

  constructor(private httpClient: HttpClient) { }

  createUserAccount(adAccountVM : ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/createuseraccount`,adAccountVM);
  }
}
