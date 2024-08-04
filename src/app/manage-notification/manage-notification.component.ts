import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { notificationVM } from '../shared/models/notificationVM';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.css']
})
export class ManageNotificationComponent implements OnInit{
  
  logedDetails : loginDetailsVM | undefined;
  private subs = new SubSink();
  privilages : privilagesVM[] = [];
  isLoading : boolean = false;
  appIconId : number = 17
  allNotifications : notificationVM[] = [];

  constructor(
    private notificationService : NotificationService,
    private localStorageService : LocalStorageService,
  ){}

  ngOnInit(): void {
    this.getLoginData();
    // this.buildForm();
    this.subscription();
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
  }

  isActionAllowed(action : number):boolean{
    if(this.privilages.filter(el => el.appIcon.id == this.appIconId && el.action.id == action).length > 0){
      return true;
    }else{
      return false;
    }
  }

  subscription(){
    this.isLoading = true;
    this.subs.sink = this.notificationService.getNotification().subscribe(data =>{
      if(data && data.content){
        this.allNotifications = data.content;
        this.isLoading = false
      }
    })
  }

}
