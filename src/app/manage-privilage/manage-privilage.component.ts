import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { RoleService } from '../shared/services/role.service';
import { roleVM } from '../shared/models/roleVM';
import { AppIconService } from '../shared/services/app-icon.service';
import { appIconVM } from '../shared/models/appIconVM';
import { actionVM } from '../shared/models/actionVM';
import { ActionService } from '../shared/services/action.service';
import { privilagesVM } from '../shared/models/privilagesVM';
import { PrivilageService } from '../shared/services/privilage.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manage-privilage',
  templateUrl: './manage-privilage.component.html',
  styleUrls: ['./manage-privilage.component.css']
})
export class ManagePrivilageComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  privilageCreationForm !:FormGroup;
  privilageUpdateForm !:FormGroup;
  filterDataForm !: FormGroup
  private subs = new SubSink();
  action : number =2;
  isCreatePrivilageFormButtonVisible: boolean = false
  isPrivilageFormVisible : boolean = false;
  isPrivilageUpdateFormVisible : boolean = false;
  roles : roleVM[]=[]
  appIcons : appIconVM[]=[]
  actions : actionVM[]=[]
  isActionsVisible : boolean = false
  isAppIconsVisible : boolean = false
  privilages : privilagesVM[]=[];
  allprivilages : privilagesVM[]=[];
  tableprivilages : privilagesVM[]=[];

   // get action value
   get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
   // get search value
   get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }
 
   // get app icone creation value
   get getPrivilageCreationRole(): AbstractControl { return this.privilageCreationForm.get('role') as AbstractControl; }
   get getPrivilageCreationAppIcon(): AbstractControl { return this.privilageCreationForm.get('appIcon') as AbstractControl; }
   get getPrivilageCreationActions(): AbstractControl { return this.privilageCreationForm.get('action') as AbstractControl; }
 
   // get app icon update value
   get getPrivilageUpdateRole(): AbstractControl { return this.privilageUpdateForm.get('role') as AbstractControl; }
   get getPrivilageUpdateAppIcon(): AbstractControl { return this.privilageUpdateForm.get('appIcon') as AbstractControl; }
   get getPrivilageUpdateActions(): AbstractControl { return this.privilageUpdateForm.get('action') as AbstractControl; }

  //  get filter values
  get getFormFilterRole(): AbstractControl { return this.filterDataForm.get('role') as AbstractControl; }
  get getFormFilterAppIcon(): AbstractControl { return this.filterDataForm.get('appIcon') as AbstractControl; }
  get getFormFilterAction(): AbstractControl { return this.filterDataForm.get('action') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private roleService : RoleService,
    private appIconService : AppIconService,
    private actionService : ActionService,
    private privilageService : PrivilageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getPrivilages();
    this.getRoles()
  }

  getPrivilages(){
    this.isLoading = true;
    this.subs.sink = this.privilageService.getPrivilages().subscribe(data =>{
      if(data && data.content){
        this.allprivilages = data.content;
        this.tableprivilages = this.allprivilages
        console.log("this.allprivilages",this.allprivilages);
        this.isLoading = false;
      }
    })
  }

  getRoles(){
    this.isLoading = true
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        this.roles = data.content
        this.getAppIcons()
      }
    })
  }

  addCreatePrivilage(){
    
    let role : roleVM = this.getPrivilageCreationRole.value;
    let appicon : appIconVM = this.getPrivilageCreationAppIcon.value;
    let action : actionVM[] = this.getPrivilageCreationActions.value;
    console.log(this.getPrivilageCreationRole.value);
    console.log(this.getPrivilageCreationAppIcon.value);
    console.log(this.getPrivilageCreationActions.value);
    
    if(role && appicon && action && action.length && action.length > 0){
      action.forEach(element => {
        let countAdd : number = this.privilages.filter(el => el.role.id == role.id && el.appIcon.id == appicon.id && el.action.id == element.id).length;
        let countAll : number = this.allprivilages.filter(el => el.role.id == role.id && el.appIcon.id == appicon.id && el.action.id == element.id).length;
        if(countAdd == 0 && countAll == 0){
          let privilage : privilagesVM;
          privilage = {
            role : role,
            appIcon : appicon,
            action : element,
            isActive : true
          }
          this.privilageCreationForm.reset();
          this.privilages.push(privilage);
        }
      });
    }
    
    
  }

  addUpdatePrivilage(){
    
    let role : roleVM = this.getPrivilageUpdateRole.value;
    let appicon : appIconVM = this.getPrivilageUpdateAppIcon.value;
    let action : actionVM[] = this.getPrivilageUpdateActions.value;
    console.log(this.getPrivilageCreationRole.value);
    console.log(this.getPrivilageCreationAppIcon.value);
    console.log(this.getPrivilageCreationActions.value);
    
    if(role && appicon && action && action.length && action.length > 0){
      action.forEach(element => {
        let countAdd : number = this.privilages.filter(el => el.role.id == role.id && el.appIcon.id == appicon.id && el.action.id == element.id).length;
        let countAll : number = this.allprivilages.filter(el => el.role.id == role.id && el.appIcon.id == appicon.id && el.action.id == element.id).length;
        if(countAdd == 0 && countAll == 0){
          let privilage : privilagesVM;
          privilage = {
            role : role,
            appIcon : appicon,
            action : element,
            isActive : true
          }
          this.privilageCreationForm.reset();
          this.privilages.push(privilage);
        }
      });
    }
    
    
  }

  getAppIcons(){
    this.isLoading = true;
    this.subs.sink = this.appIconService.getAppIcons().subscribe(data =>{
      if(data && data.content){
        this.appIcons = data.content;
        this.getActions();
      }
    })
  }

  getActions(){
    this.subs.sink = this.actionService.getActions().subscribe(data =>{
      if(data && data.content){
        this.actions = data.content;
        this.isLoading = false;
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

    this.privilageCreationForm = this.formBuilder.group({
      role : ['',Validators.required],
      appIcon : ['',Validators.required],
      action: [[] ,Validators.required]
    })

    this.privilageUpdateForm = this.formBuilder.group({
      role : ['',Validators.required],
      appIcon : ['',Validators.required],
      action : ['',Validators.required]
    })

    this.filterDataForm = this.formBuilder.group({
      role : null,
      appIcon : null,
      action : null
    })
  }

  filterAttendanceData(){
    let filterData : privilagesVM[] = this.allprivilages;
    console.log(this.getFormFilterAction.value);
    

    if(filterData && filterData.length && this.getFormFilterRole && this.getFormFilterRole.value && this.getFormFilterRole.value.id){
      filterData = filterData.filter(el => el.role && el.role.id == this.getFormFilterRole.value.id);
    }

    if(filterData && filterData.length && this.getFormFilterAppIcon && this.getFormFilterAppIcon.value && this.getFormFilterAppIcon.value.id){
      filterData = filterData.filter(el => el.appIcon && el.appIcon.id == this.getFormFilterAppIcon.value.id);
    }

    if(filterData && filterData.length && this.getFormFilterAction && this.getFormFilterAction.value && this.getFormFilterAction.value.id){
      filterData = filterData.filter(el => el.action && el.action.id == this.getFormFilterAction.value.id);
    }

    this.tableprivilages = filterData;
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreatePrivilageFormButtonVisible = false;
    }
  }

  setCreateAppIcon(){
    this.getPrivilageCreationAppIcon.reset();
    this.getPrivilageCreationActions.reset();
    this.isActionsVisible = false;
    this.isAppIconsVisible = true;
  }

  openUpdateForm(privilage : privilagesVM){
    let actions : actionVM[]=[];
    actions.push(privilage.action)
    this.getPrivilageUpdateActions.patchValue(actions);
    this.getPrivilageUpdateAppIcon.patchValue(privilage.appIcon);
    this.getPrivilageUpdateRole.patchValue(privilage.role);
    this.privilages = [];
    this.isActionsVisible = true;
    this.isAppIconsVisible = true;
    this.isPrivilageUpdateFormVisible = true;
  }

  deletePrivilage(privilage : privilagesVM){
    let selectedPrivilage : privilagesVM = privilage;

    let delPrivilage : privilagesVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isLoading = true;

        delPrivilage = {
          ...selectedPrivilage,
          isActive : false
        }

        this.subs.sink = this.privilageService.deletePrivilage(delPrivilage).subscribe(data =>{
          if(data && data.content){
            let deletedPrivilage : privilagesVM;
            let index : number;
            index = this.allprivilages.indexOf(selectedPrivilage);
            delPrivilage = data.content
            this.allprivilages.splice(index,1);
            this.filterAttendanceData();
            this.isLoading = false;
          }
        })
      }
    })
  }

  setCreateActions(){
    this.getPrivilageCreationActions.reset();
    this.isActionsVisible = true;
    this.isAppIconsVisible = true;
  }

  openPrivilageForm(appIconFormVisibility : boolean){
    this.isPrivilageFormVisible = appIconFormVisibility;
  }
  

  closePrivilagesCreatePopup(){
    this.privilageCreationForm.reset();
    this.isPrivilageFormVisible = false;
    this.privilages = [];
  }

  closePrivilagesUpdatePopup(){
    this.privilageUpdateForm.reset();
    this.isPrivilageUpdateFormVisible = false;
  }

  submitClick(){
    this.isLoading = true;
    if(this.privilages.length>0){
      this.subs.sink = this.privilageService.addPrivilages(this.privilages).subscribe(data =>{
        if(data && data.content){
          data.content.forEach(element => {
            this.allprivilages.push(element);
          });
          this.tableprivilages = this.allprivilages;
          console.log(data.content);
          this.closePrivilagesCreatePopup();
          this.isLoading =false;
        }
      })
    }
  }

  remove(privilage : privilagesVM){
    let index : number = this.privilages.indexOf(privilage);
    this.privilages.splice(index,1)
  }

  reset(){
    this.filterDataForm.reset();
    this.tableprivilages = this.allprivilages
  }
}
