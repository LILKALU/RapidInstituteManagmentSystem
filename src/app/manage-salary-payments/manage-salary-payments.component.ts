import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { TeacherService } from '../shared/services/teacher.service';
import { MonthService } from '../shared/services/month.service';
import { teacherVM } from '../shared/models/teachersVM';
import { MonthVM } from '../shared/models/monthVM';
import { courseWiseClassFeeVM } from '../shared/models/courseWiseClassFeeVM';
import { courseWisePaymentVM } from '../shared/models/courseWisePaymentVM';
import { CourseVM } from '../shared/models/coursesVM';
import { CourseService } from '../shared/services/course.service';
import { teacherPayemntVM } from '../shared/models/teacherPaymentVM';
import { teacherPaymentCourseVM } from '../shared/models/teacherPaymentCourseVM';
import { TeacherPaymentService } from '../shared/services/teacher-payment.service';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { teacherPaymentReciptDataVM } from '../shared/models/teacherPaymentReciptDataVM';
import { paymentsVM } from '../shared/models/paymentsVM';

@Component({
  selector: 'app-manage-salary-payments',
  templateUrl: './manage-salary-payments.component.html',
  styleUrls: ['./manage-salary-payments.component.css']
})
export class ManageSalaryPaymentsComponent implements OnInit, OnDestroy {
  isLoading : boolean = false;
  today = new Date();
  thisMonth : number = this.today.getMonth() + 1;
  thisYear : number = this.today.getFullYear();
  selectAction !: FormGroup
  searchForm !: FormGroup;
  appIconId : number = 16
  private subs = new SubSink();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  allTeachers : teacherVM[] =[];
  allMonths : MonthVM[] = [];
  allCourses : CourseVM[]=[]
  isAdvanceFormButtonVisible : boolean = false;
  action : number | undefined;
  isPaymentFormVisible : boolean = false;
  paymentForm !: FormGroup;
  teacherPayemntForm !: FormGroup;
  courseWisePayments : courseWisePaymentVM[] = []
  isNothingEarn: boolean = false;
  total : number = 0;
  institutePayment : number = 0;
  netPayment : number = 0
  activeStepIndex : number = 0;
  teacherPayments : teacherPayemntVM[] = [];
  payementData : teacherPayemntVM | undefined;
  allPayments : paymentsVM[] = [];
  tablePayments : paymentsVM[] = []
  isPaymentPayed : boolean = false;
  teacherPaymentReciptData : teacherPaymentReciptDataVM | undefined

  steps = [
    { label: 'Payemnt' },
    { label: 'Recipt'}
  ];

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get action value
  get getPaymentFormTeacherId(): AbstractControl { return this.paymentForm.get('teacherid') as AbstractControl; }
  get getPaymentFormMonthId(): AbstractControl { return this.paymentForm.get('monthid') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.teacherPayemntForm.get('hasPaymentDone') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }
  
  constructor(
    private formBuilder: FormBuilder,
    // private confirmationService: ConfirmationService,
    private localStorageService : LocalStorageService,
    private router : Router,
    private teachersService : TeacherService,
    private monthService : MonthService,
    private courseService : CourseService,
    private teacherPaymentService : TeacherPaymentService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscriptions()
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
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      teacherid : [0 , Validators.required],
      monthid : [0 , Validators.required]
    })

    this.teacherPayemntForm = this.formBuilder.group({
      hasPaymentDone:['',Validators.required]
    })
  }

  subscriptions(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.getPayments()
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
  }

  getPayments(){
    this.isLoading = true;

    if(this.logedDetails && this.logedDetails.id && this.logedDetails.usercode && this.logedDetails.usercode.startsWith('T')){
      this.subs.sink = this.teacherPaymentService.getTeacherPaymentsByTeacherId(this.logedDetails.id).subscribe(data =>{
        if(data && data.content){
          this.teacherPayments = data.content;
          this.restructureTeacherPayment()
          this.getTeachers();
        }
      })
    }else{
      this.subs.sink = this.teacherPaymentService.getTeacherPayments().subscribe(data =>{
        if(data && data.content){
          this.teacherPayments = data.content;
          this.restructureTeacherPayment()
          this.getTeachers();
        }
      })
    }

    
  }

  restructureTeacherPayment(){
    this.teacherPayments.forEach(element => {
      let initpayment : paymentsVM
      initpayment = {
        reciptNumber : element.reciptNumber,
        teacher : element.teacher,
        date : element.date
      }

      if(element.teacherPaymentCourse){
        element.teacherPaymentCourse.forEach(ele => {
          let payment : paymentsVM
          payment = {
            ...initpayment,
            course : ele.course,
            amount : ele.amount,
            month : ele.month
          }

          this.allPayments.push(payment)
        });
      }
    });
    this.tablePayments = this.allPayments;
    
  }

  getTeachers(){
    this.isLoading = true;
    this.subs.sink = this.teachersService.getTeachers().subscribe(data =>{
      if(data && data.content){
        this.allTeachers = data.content;
        this.getMonths();
      }
    })
  }

  getMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data => {
      if(data && data.content){
        this.allMonths = data.content;
        this.getCourses()
      }
    })
  }

  getCourses(){
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data && data.content){
        this.allCourses = data.content
        this.isLoading = false;
      }
    })
  }
  

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isAdvanceFormButtonVisible = false;
    }
  }

  openPaymentForm(){
    this.isPaymentFormVisible = true;
    if(this.action ==3){
      this.getPaymentFormTeacherId.patchValue(this.logedDetails?.id);
      this.getPaymentFormMonthId.patchValue(this.thisMonth);
      this.getPaymentFormMonthId.disable();
      this.getPaymentFormTeacherId.disable();
      this.getPaymentDetails();
    }
  }

  closePaymentPopup(){
    this.paymentForm.reset();
    this.activeStepIndex = 0
  }

  getPaymentDetails(){
    this.isNothingEarn = false;
    if(this.getPaymentFormMonthId && this.getPaymentFormTeacherId && this.getPaymentFormMonthId.value>0 && this.getPaymentFormTeacherId.value>0){
      this.isLoading = true;
      this.subs.sink = this.teachersService.getCourseWisePayments(this.getPaymentFormTeacherId.value,this.getPaymentFormMonthId.value).subscribe(data =>{
        if(data && data.content){
          this.courseWisePayments = data.content;

          this.courseWisePayments.forEach((element,index) => {
            this.isPaymentPayed = element.isPayed;
            this.allCourses.forEach(course => {
              if(element.courseId == course.id){
                let cwp : courseWisePaymentVM;
                cwp = {
                  ...element,
                  course : course
                }
                this.courseWisePayments.splice(index,1,cwp);
              }
            });
          });
          this.findTotal();
          this.isLoading = false;
          
        }else{
          this.isNothingEarn = true;
          this.isLoading = false;
        }
      })
    }
  }

  findTotal(){
    this.institutePayment = 0;
    this.netPayment = 0;
    this.total = 0;
    this.courseWisePayments.forEach(element => {
      if(element.amount){
        this.total = this.total+element.amount
      }
    });

    this.institutePayment = this.total*25/100;
    this.netPayment = this.total*75/100;
  }

  proceddPayment(){
    this.isLoading = true;
    let teacher : teacherVM;
    let teacherPayment : teacherPayemntVM;
    let teacherPaymentCourses : teacherPaymentCourseVM[]=[];
    let teacherPaymentCourse : teacherPaymentCourseVM;
    let month : MonthVM;

    month = {
      ...this.allMonths.find(el => el.id && this.getPaymentFormMonthId.value && el.id == this.getPaymentFormMonthId.value)
    }

    teacher = {
      ...this.allTeachers.find(el => el && el.id && this.getPaymentFormTeacherId.value && el.id == this.getPaymentFormTeacherId.value)
    }

    if(teacher){
      this.courseWisePayments.forEach(element => {
        if(element && element.amount){
          teacherPaymentCourse = {
            amount : element.amount * 75 /100,
            course : element.course,
            month : month
          }
          teacherPaymentCourses.push(teacherPaymentCourse);
        }
      });

      teacherPayment = {
        teacher : teacher,
        teacherPaymentCourse : teacherPaymentCourses
      }

      this.subs.sink = this.teacherPaymentService.payTeacherPayment(teacherPayment).subscribe(data => {
        if(data && data.content){
          this.payementData = data.content;

          if(this.payementData.teacherPaymentCourse){
            this.teacherPaymentReciptData = {
              teacher : teacher,
              courseWisePayment : this.courseWisePayments,
              netPayment : this.netPayment,
              total : this.total,
              resiptNumber : this.payementData.reciptNumber,
              month : month
            }
          }
          this.activeStepIndex = this.activeStepIndex + 1;
          this.isLoading = false;
        }
      });
    }
  }

  searchPayment(){
    this.tablePayments = this.allPayments.filter(el => el.reciptNumber && this.getSearchValue.value && el.reciptNumber == this.getSearchValue.value)
  }

  reset(){
    this.tablePayments = this.allPayments
  }
}
