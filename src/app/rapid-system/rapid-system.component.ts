import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { appIconVM } from '../shared/models/appIconVM';
import { AppIconService } from '../shared/services/app-icon.service';

@Component({
  selector: 'app-rapid-system',
  templateUrl: './rapid-system.component.html',
  styleUrls: ['./rapid-system.component.css']
})
export class RapidSystemComponent implements OnInit, OnDestroy {
  selectedModuleEnum : number = 14;
  private subs = new SubSink();
  appIcons : appIconVM[]=[]
  isLoading : boolean = false;

  constructor(
    private appIconService : AppIconService,
  ){}

  changeModule(moduleEnum : number=0){
    this.selectedModuleEnum = moduleEnum;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    // this.buildForm();
    this.getAppIcons()
  }

  getAppIcons(){
    this.isLoading = true;
    this.subs.sink = this.appIconService.getAppIcons().subscribe(data =>{
      if(data && data.content){
        this.appIcons = data.content;
        console.log(this.appIcons);
        this.isLoading = false;
      }
    })
  }
}
