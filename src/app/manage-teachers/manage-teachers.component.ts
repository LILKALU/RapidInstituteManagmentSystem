import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { teacherVM } from '../shared/models/teachersVM';
import { TeacherService } from '../shared/services/teacher.service';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  isloading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  action : number = 1;
  teachersAllData : teacherVM[] = [];
  teachersTabelData : teacherVM[] = [];
  newTeacher : teacherVM = {}
  teacherLoginData : ADAccountVM | undefined
  isTeacherFormVisible : boolean = false;
  isTeacherUpdateFormVisible : boolean = false;
  selectedTeacher : teacherVM = {}
  teacherCreationForm !:FormGroup;
  teacherUpdateForm !:FormGroup;

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get teacher register values
  get getRegisterTeacherFullName(): AbstractControl { return this.teacherCreationForm.get('fullName') as AbstractControl; }
  get getRegisterTeacherTitle(): AbstractControl { return this.teacherCreationForm.get('title') as AbstractControl; }
  get getRegisterTeacherHighestQuli(): AbstractControl { return this.teacherCreationForm.get('highestQuli') as AbstractControl; }
  get getRegisterTeacherBirthday(): AbstractControl { return this.teacherCreationForm.get('birthday') as AbstractControl; }
  get getRegisterTeacherContactNumber(): AbstractControl { return this.teacherCreationForm.get('contactNumber') as AbstractControl; }
  get getRegisterTeacherEmail(): AbstractControl { return this.teacherCreationForm.get('email') as AbstractControl; }

  // get teacher register values
  get getUpdateTeacherFullName(): AbstractControl { return this.teacherUpdateForm.get('fullName') as AbstractControl; }
  get getUpdateTeacherTitle(): AbstractControl { return this.teacherUpdateForm.get('title') as AbstractControl; }
  get getUpdateTeacherHighestQuli(): AbstractControl { return this.teacherUpdateForm.get('highestQuli') as AbstractControl; }
  get getUpdateTeacherBirthday(): AbstractControl { return this.teacherUpdateForm.get('birthday') as AbstractControl; }
  get getUpdateTeacherContactNumber(): AbstractControl { return this.teacherUpdateForm.get('contactNumber') as AbstractControl; }
  get getUpdateTeacherEmail(): AbstractControl { return this.teacherUpdateForm.get('email') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private teachersService : TeacherService,
    private adAccountService : AdAccountServiceService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(): void {
    this.buildForms()
    this.getTeachers()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buildForms(){
    this.selectAction = this.formBuilder.group({
      action : [1 , Validators.required]
    })

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.teacherCreationForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      title : ['', Validators.required],
      highestQuli : ['',Validators.required],
      birthday : ['',Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })

    this.teacherUpdateForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      title : ['', Validators.required],
      highestQuli : ['',Validators.required],
      birthday : ['',Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })
  }

  getTeachers(){
    this.isloading = true;
    this.subs.sink = this.teachersService.getTeachers().subscribe(data => {
      if(data){
        this.teachersAllData = data.content;
        this.teachersTabelData = this.teachersAllData;
        this.teachersTabelData.reverse();
        this.isloading = false;
      }
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
  }

  openTeacherForm(teacherFormVisibility : boolean){
    this.isTeacherFormVisible = teacherFormVisibility;
  }

  searchTeacher(){
    this.teachersTabelData = this.teachersAllData.filter(el => el.tcode == this.getSearchValue.value)
  }

  submitUpdateClick(){
    this.isloading = true;
    let teacher : teacherVM;

    teacher = {
      birthday : this.getUpdateTeacherBirthday.value.toLocaleDateString(),
      contactNumber : this.getUpdateTeacherContactNumber.value,
      email : this.getUpdateTeacherEmail.value,
      fullName : this.getUpdateTeacherFullName.value,
      highestQulification : this.getUpdateTeacherHighestQuli.value,
      id : this.selectedTeacher.id,
      isActive : this.selectedTeacher.isActive,
      tcode : this.selectedTeacher.tcode,
      title : this.getUpdateTeacherTitle.value
    }

    this.subs.sink = this.teachersService.updateTeacher(teacher).subscribe(data =>{
      if(data){
        this.teachersAllData.forEach((element, index) => {
          if(element.id == this.selectedTeacher.id){
            this.teachersAllData.splice(index,1,data.content);
          }
        });
        this.teachersTabelData = this.teachersAllData;
        this.isTeacherUpdateFormVisible = false;
        this.isloading = false;
      }
    })
  }

  reset(){
    this.teachersTabelData = this.teachersAllData;
  }

  submitClick(){
    this.isloading = true;
    let teacher : teacherVM;
    let tcode : string

    teacher = {
      birthday : this.getRegisterTeacherBirthday.value.toLocaleDateString(),
      contactNumber : this.getRegisterTeacherContactNumber.value,
      email : this.getRegisterTeacherEmail.value,
      fullName : this.getRegisterTeacherFullName.value,
      highestQulification : this.getRegisterTeacherHighestQuli.value,
      title : this.getRegisterTeacherTitle.value,
      isActive : true
    }

    this.subs.sink = this.teachersService.addTeacher(teacher).subscribe(data => {
      if(data){
        console.log("data",data);
        this.newTeacher = data?.content;
        console.log("a",this.newTeacher.tcode);
        this.teachersAllData.push(this.newTeacher);
        this.teachersTabelData = this.teachersAllData;
        this.teachersTabelData.reverse();
        this.createUserAccount(this.newTeacher);
        this.closeDialog();
        
        this.isloading = false;

      }
    })
  }

  openUpdateForm(teacher : teacherVM){
    this.selectedTeacher = teacher;
    this.getUpdateTeacherBirthday.patchValue(teacher.birthday);
    this.getUpdateTeacherContactNumber.patchValue(teacher.contactNumber);
    this.getUpdateTeacherEmail.patchValue(teacher.email);
    this.getUpdateTeacherFullName.patchValue(teacher.fullName);
    this.getUpdateTeacherHighestQuli.patchValue(teacher.highestQulification);
    console.log("teacher",teacher);
    
    console.log("title",teacher.birthday);
    
    this.getUpdateTeacherTitle.patchValue(teacher.title);
    this.isTeacherUpdateFormVisible = true;
  }

  createUserAccount(teacher : teacherVM){
    let req : ADAccountVM;
    let usercode : string = teacher.tcode ? teacher.tcode : '';
    let defaultpassword : string = "teacher@1234"
    console.log(usercode);
    console.log("b",teacher);
    
    req = {
      userCode : usercode,
      passWord : defaultpassword
    }

    this.subs.sink = this.adAccountService.createUserAccount(req).subscribe(data =>{
      if(data){
        this.teacherLoginData = data.content
        console.log(this.teacherLoginData);
        
      }
    })
  }

  closeDialog(){
    this.teacherCreationForm.reset();
    this.isTeacherFormVisible = false;
  }

  closeUpdateDialog(){
    this.teacherUpdateForm.reset();
    this.isTeacherUpdateFormVisible = false;
  }

  deleteTeacher(teacherdata : teacherVM){
    let teacher : teacherVM;
    let delteacher : teacherVM;
    delteacher = teacherdata;
    
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isloading = true;
        teacher = {
          ...delteacher,
          isActive : false
        }
    
        this.subs.sink = this.teachersService.deleteTeacher(teacher).subscribe(data =>{
          if(data){
            this.teachersAllData.forEach((element , index) => {
              if(element.id === teacherdata.id){
                this.teachersAllData.splice(index , 1);
                this.teachersTabelData = this.teachersAllData
                this.isloading = false;
              }
            });
          }
        })
      }
  });
    
  }

  
}
