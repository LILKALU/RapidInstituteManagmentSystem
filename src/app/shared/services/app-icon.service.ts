import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appIconVM } from '../models/appIconVM';
import { Observable } from 'rxjs';
import { appiconResponse } from '../models/appIconResponseVM';
import { appiconsResponse } from '../models/appIconsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class AppIconService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = "http://localhost:8080/api/v1/appiconctrl";

  addAppIcon(appIcon : appIconVM) :Observable<appiconResponse>{
    return this.httpClient.post<appiconResponse>(`${this.BaseURL}/addappicon`,appIcon);
  }

  getAppIcons():Observable<appiconsResponse>{
    return this.httpClient.get<appiconsResponse>(`${this.BaseURL}/getappicons`)
  }

  updateOrDeleteAppIcons(appIcon : appIconVM):Observable<appiconResponse>{
    return this.httpClient.put<appiconResponse>(`${this.BaseURL}/updateappicon`,appIcon);
  }

}
