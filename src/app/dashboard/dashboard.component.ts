import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { StudentService } from '../shared/services/student.service';
import { studentVM } from '../shared/models/studentVM';
import { CourseService } from '../shared/services/course.service';
import { TeacherPaymentService } from '../shared/services/teacher-payment.service';
import { TeacherService } from '../shared/services/teacher.service';
import { MonthService } from '../shared/services/month.service';
import { MonthVM } from '../shared/models/monthVM';
import { ClassFeeCourseService } from '../shared/services/class-fee-course.service';
import { monthWiseIncomeVM } from '../shared/models/monthWiseIncomeVM';
import { chartVM } from '../shared/models/chartVM';
import { dataSetsVM } from '../shared/models/dataSetsVM';
import { ChartModule } from 'primeng/chart';
import { TeacherPaymentCourseService } from '../shared/services/teacher-payment-course.service';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { courseWiseStudentCountVM } from '../shared/models/courseWiseStudentCountVM';
import { CourseVM } from '../shared/models/coursesVM';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy  {

  isLoading : boolean = false;
  selectAction !: FormGroup
  searchForm !: FormGroup;
  appIconId : number = 1
  private subs = new SubSink();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  students : studentVM[]=[]
  courses : CourseVM[]=[]
  studentCount : number = 0;
  courseCount : number = 0
  teacherCount : number = 0;
  classFeeChartData : chartVM|undefined
  teacherPaymentChartData : chartVM|undefined
  profitChartData : chartVM|undefined
  studentCountByCourseChartData : chartVM|undefined
  payments : number[]=[]
  classFees : number[]=[]
  months : MonthVM[]=[]
  monthWiseClassFees : monthWiseIncomeVM[]=[]
  monthWiseTeacherPayments : monthWiseIncomeVM[]=[]
  studentCountByCourse : courseWiseStudentCountVM[]=[]
  basicOptions: any;
  basicOptionsForPie: any;


  constructor(
    private formBuilder: FormBuilder,
    // private confirmationService: ConfirmationService,
    private localStorageService : LocalStorageService,
    private classFeeCourseService : ClassFeeCourseService,
    private teacherPaymentCourseService : TeacherPaymentCourseService,
    private router : Router,
    private studentServices : StudentService,
    private teachersService : TeacherService,
    private monthService : MonthService,
    private courseService : CourseService,
    private enrolmentCourseService : EnrolmentCourseService
    // private teacherPaymentService : TeacherPaymentService
  ){}


  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit(): void {
    this.getLoginData();
    // this.buildForm();
    this.subscriptions();
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    console.log("this.logedDetails",this.logedDetails);
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
        this.getStudents();
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
  }

  getStudents(){
    this.isLoading = true;
    this.subs.sink = this.studentServices.getStudent().subscribe(data =>{
      if(data && data.content){
        this.students = data.content
        this.studentCount = this.students.length;
        this.getcourses();
      }
    })
  }

  getcourses(){
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data && data.content){
        this.courses = data.content
        this.courseCount = data.content.length
        this.getTeachers()
      }
    })
  }

  getTeachers(){
    this.subs.sink = this.teachersService.getTeachers().subscribe(data =>{
      if(data && data.content){
        this.teacherCount = data.content.length;
        this.getMonths()
      }
    })
  }

  getMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data && data.content){
        this.months = data.content;
        this.getMonthWiseClassFees()
      }
    })
  }

  getMonthWiseClassFees(){
    this.subs.sink = this.classFeeCourseService.getMonthWiseIncomes().subscribe(data =>{
      if(data && data.content){
        this.monthWiseClassFees = data.content;

        this.monthWiseClassFees.forEach((element,index) => {
          let month : MonthVM | undefined;
          month = this.months.find(el => el.id == element.monthId);
          let monthWiseClassFee : monthWiseIncomeVM
          monthWiseClassFee ={
            ...element,
            month : month
          }

          this.monthWiseClassFees.splice(index,1,monthWiseClassFee);
        });
        this.setClassFeeChartData();
        this.getTeacherPaymentsByMonth()
        
      }
    })
  }

  getTeacherPaymentsByMonth(){
    this.subs.sink = this.teacherPaymentCourseService.getTeacherPaymentByMonth().subscribe(data =>{
      if(data && data.content){
        this.monthWiseTeacherPayments = data.content;
        

        this.monthWiseTeacherPayments.forEach((element,index) => {
          let month : MonthVM | undefined;
          month = this.months.find(el => el.id == element.monthId);
          let monthWiseTeacherPayment : monthWiseIncomeVM
          monthWiseTeacherPayment ={
            ...element,
            month : month
          }

          this.monthWiseTeacherPayments.splice(index,1,monthWiseTeacherPayment);
        });

        this.setTeacherPaymentChartData();
        this.setProfitChartData();
        this.getCourseWiseStudentCount()
      }
    })
  }

  getCourseWiseStudentCount(){
    
    this.subs.sink = this.enrolmentCourseService.getStudentCountByCourse().subscribe(data =>{
      if(data && data.content){
        this.studentCountByCourse = data.content
        console.log("this.studentCountByCourse",this.studentCountByCourse);
        

        let red : number = Math.floor(Math.random() * 256);
        let green : number = Math.floor(Math.random() * 256);
        let blue : number = Math.floor(Math.random() * 256);

        this.studentCountByCourse.forEach((element,index) => {
          let scc : courseWiseStudentCountVM;
          let course : CourseVM | undefined;
          let color : string;
          color = 'rgba('+ red + ',' + green + ',' + blue+')'

          red = Math.floor(Math.random() * 256);
          green = Math.floor(Math.random() * 256);
          blue = Math.floor(Math.random() * 256);

          course = this.courses.find(el => el.id == element.courseId);
          if(course){
            scc = {
              ...element,
              course : course,
              color : color
            }

            this.studentCountByCourse.splice(index,1,scc)
          }
        });
        this.setStudentCountByCourseChartData()
        this.isLoading = false;
      }
    })
  }

  setStudentCountByCourseChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];
    let backgroundColor : string[]=[]
    let labels : string[]=[]

    this.courses.forEach((course) => {
      this.studentCountByCourse.forEach((element,index) => {
        if(element.studentCount && element.course && element.course.code && element.color && course.id == element.courseId){
          data[index]=element.studentCount;
          backgroundColor[index] = element.color
          labels[index] = element.course.code
        }
        // else if(!(data[index]>0 || data[index]==0) && element.color){
        //   data[index]=0
        //   backgroundColor[index] = element.color
        // }
      });
    });

    console.log(data);
    console.log(backgroundColor);
    console.log(labels);
    
    
    

    dataset = {
      label : 'Student Enrolments',
      data : data,
      backgroundColor : backgroundColor,
      
    }

    console.log("dataset",dataset);
    

    this.studentCountByCourseChartData = {
      labels : labels,
      datasets : [dataset]
    }

    this.basicOptionsForPie = {
      plugins: {
          legend: {
              labels: {
                  color: 'black',
                  font: {
                    size: 15 
                  }
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          }
      }
    };
  }

  setProfitChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];

    data = this.classFees.map((num,index) => num - this.payments[index])

    console.log("prof",data);

    dataset = {
      label : 'Profit',
      data : data,
      backgroundColor : ['rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)',
                         'rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)',
                         'rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)','rgba(54, 162, 235)'
                        ],
      
    }

    this.profitChartData = {
      labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets : [dataset]
    }
    
  }

  setTeacherPaymentChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];

    this.months.forEach((month,index) => {
      this.monthWiseTeacherPayments.forEach(element => {
        if(element.ammount && month.id == element.monthId){
          data[index]=element.ammount
        }else if(!(data[index]>0 || data[index]==0)){
          data[index]=0
        }
      });
    });

    // this.months.forEach(month => {
    //   this.monthWiseTeacherPayments.forEach(element => {
    //     if(month.id == element.monthId && element.ammount){
    //       data.push(element.ammount)
    //     }else{
    //       data.push(0);
    //     }
    //   });
    // });
    this.payments = data;
    console.log("data",data);

    dataset = {
      label : 'Monthly Teacher Payments',
      data : data,
      backgroundColor : ['rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)',
                         'rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)',
                         'rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)','rgba(255, 159, 64)'
                        ],
      
    }

    this.teacherPaymentChartData = {
      labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets : [dataset]
    }
    
  }

  setClassFeeChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];
    let brake : boolean;

    this.months.forEach((month,index) => {
      this.monthWiseClassFees.forEach(element => {
        if(element.ammount && month.id == element.monthId){
          data[index]=element.ammount
        }else if(!(data[index]>0 || data[index]==0)){
          data[index]=0
        }
      });
    });

    this.classFees = data;
    console.log(data);
    

    dataset = {
      label : 'Monthly Class Fee Income',
      data : data,
      backgroundColor : ['rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)'
                        ],
      
    }

    this.classFeeChartData = {
      labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets : [dataset]
    }

    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: 'black',
                  font: {
                    size: 25 
                  }
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          }
      }
    };
  }
}
