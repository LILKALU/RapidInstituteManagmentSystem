import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'subsink';
import { AppIconService } from '../shared/services/app-icon.service';
import { appIconVM } from '../shared/models/appIconVM';

@Component({
  selector: 'app-app-icons',
  templateUrl: './app-icons.component.html',
  styleUrls: ['./app-icons.component.css']
})
export class AppIconsComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  appIconCreationForm !:FormGroup;
  appIconUpdateForm !:FormGroup;
  private subs = new SubSink();
  action : number =2;
  isCreateAppIconsFormButtonVisible: boolean = false
  isAppIconFormVisible : boolean = false;
  isAppIconUpdateFormVisible : boolean = false;
  newlyAddedAppIcon : appIconVM | undefined
  selectedAppIcone : appIconVM|undefined;
  allAppIcons : appIconVM[]=[]
  tableAppIcons : appIconVM[]=[]
  

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get app icone creation value
  get getAppIconCreationName(): AbstractControl { return this.appIconCreationForm.get('name') as AbstractControl; }
  get getAppIconCreationIcon(): AbstractControl { return this.appIconCreationForm.get('icon') as AbstractControl; }

  // get app icon update value
  get getAppIconUpdateName(): AbstractControl { return this.appIconUpdateForm.get('name') as AbstractControl; }
  get getAppIconUpdateIcon(): AbstractControl { return this.appIconUpdateForm.get('icon') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private appIconService : AppIconService,
    private confirmationService: ConfirmationService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getAppIcons()
  }

  getAppIcons(){
    this.isLoading = true;
    this.subs.sink = this.appIconService.getAppIcons().subscribe(data =>{
      if(data && data.content){
        this.allAppIcons = data.content;
        this.tableAppIcons = this.allAppIcons;
        console.log(this.allAppIcons);
        this.isLoading = false;
      }
    })
  }

  openUpdateForm(appIcon : appIconVM){
    this.selectedAppIcone = appIcon;
    this.getAppIconUpdateName.patchValue(appIcon.name);
    this.getAppIconUpdateIcon.patchValue(appIcon.icon);
    this.isAppIconUpdateFormVisible = true;

  }

  deleteAppIcon(appIcon : appIconVM){
    let selectedAppIcon : appIconVM = appIcon;
    let delAppIcon : appIconVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () =>{
        this.isLoading = true;

        delAppIcon = {
          ...selectedAppIcon,
          isActive : false
        }

        this.subs.sink = this.appIconService.updateOrDeleteAppIcons(delAppIcon).subscribe(data =>{
          if(data && data.content){
            let updatedAppIcon : appIconVM;
            updatedAppIcon = data.content;
            let index : number;
            index = this.allAppIcons.indexOf(selectedAppIcon);
            this.allAppIcons.splice(index,1);
            this.isLoading = false;
          }
        })
      }
    })
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : [2 , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.appIconCreationForm = this.formBuilder.group({
      name : ['',Validators.required],
      icon : ['',Validators.required]
    })

    this.appIconUpdateForm = this.formBuilder.group({
      name : ['',Validators.required],
      icon : ['',Validators.required]
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateAppIconsFormButtonVisible = false;
    }
  }

  openAppIconForm(appIconFormVisibility : boolean){
    this.isAppIconFormVisible = appIconFormVisibility;
  }
  
  searchRole(){
    this.tableAppIcons = this.allAppIcons.filter(el => el.name && el.name.startsWith(this.getSearchValue.value));
  }

  closeAppIconCreatePopup(){
    this.appIconCreationForm.reset();
    this.isAppIconFormVisible = false;
  }

  closeAppIconUpdatePopup(){
    this.appIconUpdateForm.reset();
    this.isAppIconUpdateFormVisible = false
  }

  reset(){
    this.searchForm.reset();
    this.tableAppIcons = this.allAppIcons
  }

  updateClick(){
    if(this.selectedAppIcone){
      this.isLoading = true;
      let appicon : appIconVM;
      appicon = {
        ...this.selectedAppIcone,
        name : this.getAppIconUpdateName.value,
        icon : this.getAppIconUpdateIcon.value
      }

      this.subs.sink = this.appIconService.updateOrDeleteAppIcons(appicon).subscribe(data =>{
        if(data && data.content && this.selectedAppIcone){
          let updatedAppIcon : appIconVM;
          updatedAppIcon = data.content;
          let index : number;
          index = this.allAppIcons.indexOf(this.selectedAppIcone);
          this.allAppIcons.splice(index,1,updatedAppIcon);
          this.tableAppIcons = this.allAppIcons;
          this.closeAppIconUpdatePopup();
          this.isLoading = false;
        }
      })
    }
  }

  submitClick(){
    this.isLoading = true;
    let appIcon : appIconVM;
    appIcon = {
      name : this.getAppIconCreationName.value,
      icon : this.getAppIconCreationIcon.value,
      isActive : true
    }

    this.subs.sink = this.appIconService.addAppIcon(appIcon).subscribe(data =>{
      if(data && data.content){
        console.log(data.content);
        this.newlyAddedAppIcon = data.content
        this.allAppIcons.push(this.newlyAddedAppIcon);
        this.tableAppIcons = this.allAppIcons;
        this.closeAppIconCreatePopup();
        this.isLoading = false;
      }
    })
  }
}
