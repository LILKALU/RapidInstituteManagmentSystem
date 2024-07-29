import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADAccountResponseVM } from '../models/adAccountResponseVM';
import { ADAccountVM } from '../models/adAccountVM';
import { loginDetailsResponseVM } from '../models/loginDetailsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class AdAccountServiceService {

  private BaseURL = "http://localhost:8080/api/v1/adaccountctrl"

  constructor(private httpClient: HttpClient) { }

  createUserAccount(adAccountVM : ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/createuseraccount`,adAccountVM);
  }

  updateUserAccount(adAccountVM : ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.put<ADAccountResponseVM>(`${this.BaseURL}/updateadacoount`,adAccountVM);
  }

  login(adAccountVM : ADAccountVM) : Observable<loginDetailsResponseVM>{
    return this.httpClient.post<loginDetailsResponseVM>(`${this.BaseURL}/checklogin`,adAccountVM);
  }

  getALogin(adAccount :ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/getalogin`,adAccount);
  }
}