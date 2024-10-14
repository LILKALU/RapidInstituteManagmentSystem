import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../shared/services/subject.service';
import { SubSink } from 'subsink';
import { SubjectVM } from '../shared/models/subjectVM';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-subject',
  templateUrl: './manage-subject.component.html',
  styleUrls: ['./manage-subject.component.css']
})
export class ManageSubjectComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  appIconId : number = 5
  isloading : boolean = false;
  isUpdating: boolean = false;
  subjectTableData: SubjectVM[] = [];
  newlyCreatedSubject : SubjectVM = {};
  selectAction !: FormGroup;
  subjectCreationForm !: FormGroup;
  subjectUpdateForm !: FormGroup;
  updateSubjectData : SubjectVM = {};
  searchForm !: FormGroup;
  isCreateSubjectFormButtonVisible : boolean = false;
  action : number | undefined
  isSubjectFormVisible : boolean = false;
  isUpdateFormVisible : boolean = false;
  subjectsAllData : SubjectVM[] = [];
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get create subject form data 
  get getCreateSubjectName(): AbstractControl { return this.subjectCreationForm.get('subName') as AbstractControl; }
  get getCreateFirstTermModulesCount(): AbstractControl { return this.subjectCreationForm.get('moduleCountFirst') as AbstractControl; }
  get getCreateSecondTermModulesCount(): AbstractControl { return this.subjectCreationForm.get('moduleCountSecond') as AbstractControl; }
  get getCreateThirdTermModulesCount(): AbstractControl { return this.subjectCreationForm.get('moduleCountThird') as AbstractControl; }

  // get update subject form data 
  get getUpdateSubjectName(): AbstractControl { return this.subjectUpdateForm.get('subName') as AbstractControl; }
  get getUpdateFirstTermModulesCount(): AbstractControl { return this.subjectUpdateForm.get('moduleCountFirst') as AbstractControl; }
  get getUpdateSecondTermModulesCount(): AbstractControl { return this.subjectUpdateForm.get('moduleCountSecond') as AbstractControl; }
  get getUpdateThirdTermModulesCount(): AbstractControl { return this.subjectUpdateForm.get('moduleCountThird') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private subjectservice : SubjectService,
    private confirmationService: ConfirmationService,
    private localStorageService : LocalStorageService,
    private messageService: MessageService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.getsubjects();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    })

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.subjectCreationForm = this.formBuilder.group({
      subName : ['' , Validators.required],
      moduleCountFirst : ['' , Validators.required],
      moduleCountSecond : ['' , Validators.required],
      moduleCountThird : ['' , Validators.required],
    })

    this.subjectUpdateForm = this.formBuilder.group({
      subName : ['' , Validators.required],
      moduleCountFirst : ['' , Validators.required],
      moduleCountSecond : ['' , Validators.required],
      moduleCountThird : ['' , Validators.required],
    })
  }

  openUpdateForm(subdata : SubjectVM){
    this.updateSubjectData = subdata;
    this.getUpdateSubjectName.patchValue(subdata.name);
    this.getUpdateFirstTermModulesCount.patchValue(subdata.firstTermModuleCount);
    this.getUpdateSecondTermModulesCount.patchValue(subdata.secondTermModuleCount);
    this.getUpdateThirdTermModulesCount.patchValue(subdata.thirdTermModuleCount);
    this.isUpdateFormVisible = true;
  }

  submitClick(){
    this.isloading = true;
    
    let sub : SubjectVM = {
      name : this.getCreateSubjectName.value,
      firstTermModuleCount : this.getCreateFirstTermModulesCount.value,
      secondTermModuleCount : this.getCreateSecondTermModulesCount.value,
      thirdTermModuleCount : this.getCreateThirdTermModulesCount.value,
      isActive : true
    }

    this.subs.sink = this.subjectservice.createSubject(sub).subscribe(data =>{
      if(data){
        this.newlyCreatedSubject = data.content;
        this.subjectsAllData.unshift(this.newlyCreatedSubject);
        this.isloading = false;
        this.closeDialog();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subject Created' });
      }
    });
  }

  deleteHall(subdata : SubjectVM){
    let subject : SubjectVM;
    let delsub : SubjectVM;
    delsub = subdata;

    if(delsub.id && delsub.id>0 ){
      this.subs.sink = this.subjectservice.checkGradeDeleteAvailability(delsub.id).subscribe(data =>{
        if(data && data.content){
          let isDeleteAvailable : Boolean = false;
          isDeleteAvailable = data.content.isDeleteAvailable ? data.content.isDeleteAvailable : false;

          if(isDeleteAvailable){
            this.confirmationService.confirm({
              message: 'Are you sure that you want to delete',
              accept: () => {
                this.isloading = true;
                subject = {
                  ...delsub,
                  isActive : false
                }
            
                this.subs.sink = this.subjectservice.deleteSubject(subject).subscribe(data =>{
                  if(data){
                    this.subjectsAllData.forEach((element , index) => {
                      if(element.id === subdata.id){
                        this.subjectsAllData.splice(index , 1);
                        this.subjectTableData = this.subjectsAllData
                        this.isloading = false;
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subject Removed' });
                      }
                    });
                  }
                })
              }
            });
          }else{
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Delete Cannot Proceed.'});
          }
        }
      })
    }
    
    

  }

  submitUpdateClick(){
    this.isloading = true
    let sub : SubjectVM;

    sub = {
      code : this.updateSubjectData.code,
      course : this.updateSubjectData.course,
      firstTermModuleCount : this.getUpdateFirstTermModulesCount.value,
      id : this.updateSubjectData.id,
      isActive : this.updateSubjectData.isActive,
      name : this.getUpdateSubjectName.value,
      secondTermModuleCount : this.getUpdateSecondTermModulesCount.value,
      thirdTermModuleCount : this.getUpdateThirdTermModulesCount.value
    }

    this.subs.sink = this.subjectservice.updateSubject(sub).subscribe(data =>{
      if(data){
        this.subjectsAllData.forEach((element, index) => {
          if(element.id == this.updateSubjectData.id){
            this.subjectsAllData.splice(index,1,data.content);
          }
        });
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subject Updated' });
      this.isloading = false;
      this.closeUpdateDialog();
    });
  }

  closeDialog(){
    this.subjectCreationForm.reset();
    this.isSubjectFormVisible = false;
  }

  closeUpdateDialog(){
    this.subjectUpdateForm.reset();
    this.isUpdateFormVisible = false;
  }

  getsubjects(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isloading = true;
        this.subs.sink = this.subjectservice.getSubjects().subscribe(data =>{
          if(data){
            this.subjectsAllData = data.content;
            this.subjectTableData = this.subjectsAllData
            this.subjectTableData.reverse();
          }
          this.isloading = false;
        })
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
  }

  openSubjectForm(hallFormVisibility : boolean){
    this.isSubjectFormVisible = hallFormVisibility;
  }

  searchSubject(){
    this.subjectTableData = this.subjectsAllData.filter(el => el.code == this.getSearchValue.value);

    if(!(this.subjectTableData.length > 0)){
      this.subjectTableData = this.subjectsAllData;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Subject Code'});
    }
  }
  
  reset(){
    this.subjectTableData = this.subjectsAllData;
  }
}
