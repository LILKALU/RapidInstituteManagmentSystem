import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { GradeService } from '../shared/services/grade.service';
import { GradeVM } from '../shared/models/gradeVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-grade',
  templateUrl: './manage-grade.component.html',
  styleUrls: ['./manage-grade.component.css']
})
export class ManageGradeComponent implements OnInit, OnDestroy {
  
  private subs = new SubSink();
  appIconId : number = 8
  isLoading : boolean = false;
  selectAction !: FormGroup
  isCreateGradeFormButtonVisible : boolean = false;
  action : number | undefined
  gradeCreationForm !: FormGroup
  gradeUpdateForm !: FormGroup
  searchForm !: FormGroup;
  isGradeFormVisible : boolean = false;
  isGradeUpdateFormVisible : boolean = false;
  allGrades : GradeVM[] = [];
  tableGrades : GradeVM[] = [];
  newlyCreatedGrade : GradeVM | undefined;
  deletedGrade : GradeVM | undefined;
  updatingGrade : GradeVM | undefined;
  updatedGrade : GradeVM | undefined;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];


  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get grade create value
  get getGradeCreationName(): AbstractControl { return this.gradeCreationForm.get('name') as AbstractControl; }

  // get grade update value
  get getGradeUpdateName(): AbstractControl { return this.gradeUpdateForm.get('name') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private gradeService : GradeService,
    private localStorageService : LocalStorageService,
    private messageService: MessageService,
    private router : Router
  ){}
  
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscriptions();
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

  subscriptions(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.getGrades();
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
  }

  getGrades(){
    this.isLoading = true;
    this.subs.sink = this.gradeService.getGrades().subscribe(data =>{
      if(data){
        this.allGrades = data.content;
        this.tableGrades = this.allGrades;
        this.isLoading = false;
      }
    })
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.gradeCreationForm = this.formBuilder.group({
      name : ['',Validators.required]
    })

    this.gradeUpdateForm = this.formBuilder.group({
      name : ['',Validators.required]
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateGradeFormButtonVisible = false;
    }
  }

  openGradeForm(gradeFormVisibility : boolean){
    this.isGradeFormVisible = gradeFormVisibility;
  }

  searchGrade(){
    this.tableGrades = this.allGrades.filter(el => el.code === this.getSearchValue.value)

    if(!(this.tableGrades.length > 0)){
      this.tableGrades = this.allGrades;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Grade Code'});
    }
  }

  openUpdateForm(grade : GradeVM){
    this.updatingGrade = grade;
    this.isGradeUpdateFormVisible = true;
    this.getGradeUpdateName.patchValue(this.updatingGrade.name)
  }

  deleteGrade(selectedGrade : GradeVM){
    let grade : GradeVM = selectedGrade;

    let delGrade : GradeVM;

    if(grade.id && grade.id >0){
      this.subs.sink = this.gradeService.checkGradeDeleteAvailability(grade.id).subscribe(data =>{
        if(data && data.content){
          let isDeleteAvailable : Boolean = false;
          isDeleteAvailable = data.content.isDeleteAvailable ? data.content.isDeleteAvailable : false;

          if(isDeleteAvailable){
            this.confirmationService.confirm({
              message: 'Are you sure that you want to delete',
              accept: () => {
                this.isLoading = true;
                delGrade = {
                  ...grade,
                  isActive : false
                }
            
                this.subs.sink = this.gradeService.deleteGrade(delGrade).subscribe(data =>{
                  if(data){
                    this.deletedGrade = data.content
                    this.allGrades.forEach((element,index) => {
                      if(element.id == grade.id){
                        this.allGrades.splice(index , 1);
                      }
                    });
                    this.tableGrades = this.allGrades
                    this.isLoading = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Grade Removed' });
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

  reset(){
    this.tableGrades = this.allGrades
  }

  closeGradeCreationPopup(){
    this.gradeCreationForm.reset()
    this.isGradeFormVisible = false;
  }

  closeGradeUpdatePopup(){
    this.gradeUpdateForm.reset();
    this.isGradeUpdateFormVisible = false;
  }

  updateClick(){
    this.isLoading = true;
    let delGrade : GradeVM;

    delGrade = {
      id : this.updatingGrade?.id,
      name : this.getGradeUpdateName.value,
      code : this.updatingGrade?.code,
      isActive : true
    }

    this.subs.sink = this.gradeService.updateGrade(delGrade).subscribe(data =>{
      if(data){
        this.updatedGrade = data.content;
        this.allGrades.forEach((element , index) => {
          if(element.id === this.updatingGrade?.id){
            this.allGrades.splice(index , 1 , data.content);
            this.tableGrades = this.allGrades
          }
        });
        this.gradeCreationForm.reset();
        this.isGradeUpdateFormVisible = false;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Grade Updated' });
      }
    })
  }

  submitClick(){
    this.isLoading = true;
    let grade : GradeVM;
    
    grade = {
      name : this.getGradeCreationName.value,
      isActive : true
    }

    this.subs.sink = this.gradeService.createGrade(grade).subscribe(data =>{
      if(data){
        this.newlyCreatedGrade = data.content;
        this.allGrades.unshift(this.newlyCreatedGrade);
        this.tableGrades = this.allGrades;
        this.isGradeFormVisible = false;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Grade Created' });
      }
    })
  }

}
