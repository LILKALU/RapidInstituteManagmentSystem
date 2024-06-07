import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'RapidInstituteManagmentSystem';
  isLoginSuccess : boolean = false;
  private subs = new SubSink();

  constructor( 
    private localStorageService : LocalStorageService
  ){}

  ngOnInit(): void {
    this.checkLocalStorage()
  }

  checkLocalStorage(){
    if(this.localStorageService.getItem('login').length > 0){
      this.isLoginSuccess = true;
    }else{
      this.isLoginSuccess = false;
    }
  }

  logout(event : boolean){
    if(event){
      this.isLoginSuccess = false;
    }else{
      this.isLoginSuccess = true;
    }
  }

  login(event : boolean){
    if(event){
      this.isLoginSuccess = true;
    }else{
      this.isLoginSuccess = false;
    }
  }
}
