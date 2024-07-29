import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AttendanceService } from '../shared/services/attendance.service';
import { attendanceCountByMonthAndCourseVM } from '../shared/models/attendanceCountByMonthAndCourseVM';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy  {

  isLoading : boolean = false;
  today = new Date();
  thisFullYear : number = this.today.getFullYear();
  fullyear : string = this.thisFullYear.toString();
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
  yearFilterForm !: FormGroup;
  classFeeChartData : chartVM|undefined
  teacherPaymentChartData : chartVM|undefined
  profitChartData : chartVM|undefined
  studentCountByCourseChartData : chartVM|undefined
  attendanceCountByMonthAndCourseChartData : chartVM|undefined
  payments : number[]=[]
  classFees : number[]=[]
  months : MonthVM[]=[]
  monthWiseClassFees : monthWiseIncomeVM[]=[]
  monthWiseTeacherPayments : monthWiseIncomeVM[]=[]
  studentCountByCourse : courseWiseStudentCountVM[]=[]
  attendanceCountByMonthAndCourse : attendanceCountByMonthAndCourseVM[]=[]
  basicOptions: any;
  basicOptionsForPie: any;
  basicOptionsForstack: any;

  get getSelectedYearForFilter(): AbstractControl { return this.yearFilterForm.get('year') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    // private confirmationService: ConfirmationService,
    private localStorageService : LocalStorageService,
    private classFeeCourseService : ClassFeeCourseService,
    private teacherPaymentCourseService : TeacherPaymentCourseService,
    private attendanceService : AttendanceService,
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
    this.buildForm();
    this.subscriptions();
  }

  buildForm(){
    this.yearFilterForm = this.formBuilder.group({
      year : [this.fullyear,Validators.required],
    })
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
    let date = new Date(this.getSelectedYearForFilter.value)
    let year : number = date.getFullYear();
    this.subs.sink = this.classFeeCourseService.getMonthWiseIncomes(year).subscribe(data =>{
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
        
      }else{
        this.monthWiseClassFees = []
        this.setClassFeeChartData();
        this.getTeacherPaymentsByMonth()
      }
    })
  }

  getTeacherPaymentsByMonth(){
    let date = new Date(this.getSelectedYearForFilter.value)
    let year : number = date.getFullYear();
    this.subs.sink = this.teacherPaymentCourseService.getTeacherPaymentByMonth(year).subscribe(data =>{
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
      }else{
        this.monthWiseTeacherPayments = [];
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
        this.setStudentCountByCourseChartData();
        this.getAttendanceCountByMonthAndCourse()
        this.isLoading = false;
      }
    })
  }

  getAttendanceCountByMonthAndCourse(){
    let date = new Date(this.getSelectedYearForFilter.value)
    let year : number = date.getFullYear();
    this.subs.sink = this.attendanceService.getAttendanceCountByMonthAndCourse(year).subscribe(data =>{
      if(data && data.content){
        this.attendanceCountByMonthAndCourse = data.content;

        let red : number = Math.floor(Math.random() * 256);
        let green : number = Math.floor(Math.random() * 256);
        let blue : number = Math.floor(Math.random() * 256);

        this.attendanceCountByMonthAndCourse.forEach((element,index) => {
          let scc : attendanceCountByMonthAndCourseVM;
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
              color : color
            }

            this.attendanceCountByMonthAndCourse.splice(index,1,scc)
          }
        });
        this.setAttendanceCountByMonthAndCourseChartData();

      }
    })
  }

  setAttendanceCountByMonthAndCourseChartData(){
    let dataset : dataSetsVM
    let datasets : dataSetsVM[]=[]

    let datajan : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datafeb : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datamar : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let dataapr : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datamay : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datajun : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datajul : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let dataaug : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datasep : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let dataoct : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datanov : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    let datadec : number[]=[0,0,0,0,0,0,0,0,0,0,0,0];


    let backgroundColor : string[]=[]
    let labels : string[]=[]

    this.courses.forEach((element,index) => {
      if(element && element.code){
        labels.push(element.code);
      }

      this.months.forEach(month => {
        if(month.id && element.id){
          let data :  number[]=[]
          let x : attendanceCountByMonthAndCourseVM | undefined;
          x = this.attendanceCountByMonthAndCourse.find(el => el.courseId && el.monthId && el.courseId == element.id && el.monthId == month.id);

          if(month.id == 1 && x?.studentCount){
            datajan[index] = x?.studentCount
          }else if(month.id == 2 && x?.studentCount){
            datafeb[index] = x?.studentCount
          }else if(month.id == 3 && x?.studentCount){
            datamar[index] = x?.studentCount
          }else if(month.id == 4 && x?.studentCount){
            dataapr[index] = x?.studentCount
          }else if(month.id == 5 && x?.studentCount){
            datamay[index] = x?.studentCount
          }else if(month.id == 6 && x?.studentCount){
            datajun[index] = x?.studentCount
          }else if(month.id == 7 && x?.studentCount){
            datajul[index] = x?.studentCount
          }else if(month.id == 8 && x?.studentCount){
            dataaug[index] = x?.studentCount
          }else if(month.id == 9 && x?.studentCount){
            datasep[index] = x?.studentCount
          }else if(month.id == 10 && x?.studentCount){
            dataoct[index] = x?.studentCount
          }else if(month.id == 11 && x?.studentCount){
            datanov[index] = x?.studentCount
          }else if(month.id == 12 && x?.studentCount){
            datadec[index] = x?.studentCount
          }
        }
      });
    });
    
    this.months.forEach(element => {
      console.log(element.color);
      
      if(element.color){
        switch(element.id){
          case 1 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datajan
            }
            datasets.push(dataset)
            break;
          case 2 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datafeb
            }
            datasets.push(dataset)
            break;
          case 3 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datamar
            }
            datasets.push(dataset)
            break;
          case 4 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : dataapr
            }
            datasets.push(dataset)
            break;
          case 5 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datamay
            }
            datasets.push(dataset)
            break;
          case 6 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datajun
            }
            datasets.push(dataset)
            break;
          case 7 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datajul
            }
            datasets.push(dataset)
            break;
          case 8 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : dataaug
            }
            datasets.push(dataset)
            break;
          case 9 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datasep
            }
            datasets.push(dataset)
            break;
          case 10 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : dataoct
            }
            datasets.push(dataset)
            break;
          case 11 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datanov
            }
            datasets.push(dataset)
            break;
          case 12 : 
            dataset = {
              type : 'bar',
              label : element.name,
              backgroundColor : [element.color],
              data : datadec
            }
            datasets.push(dataset)
            break;
        }
      }
      
    });

    this.attendanceCountByMonthAndCourseChartData = {
      labels : labels,
      datasets : datasets
    }

    this.basicOptionsForstack = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
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
              stacked: true,
              beginAtZero: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          },
          x: {
              stacked: true,
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

    if(this.monthWiseTeacherPayments.length > 0){
      this.months.forEach((month,index) => {
        this.monthWiseTeacherPayments.forEach(element => {
          if(element.ammount && month.id == element.monthId){
            data[index]=element.ammount
          }else if(!(data[index]>0 || data[index]==0)){
            data[index]=0
          }
        });
      });
    }else{
      this.months.forEach(element => {
        data.push(0);
      });
    }


    

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

    if(this.monthWiseClassFees.length>0){
      this.months.forEach((month,index) => {
        this.monthWiseClassFees.forEach(element => {
          if(element.ammount && month.id == element.monthId){
            data[index]=element.ammount
          }else if(!(data[index]>0 || data[index]==0)){
            data[index]=0
          }
        });
      });
    }else{
      this.months.forEach(element => {
        data.push(0);
      });
    }

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

  reset(){
    this.getSelectedYearForFilter.patchValue(this.today)
    this.filterForYear()
  }

  filterForYear(){
    
    this.getMonthWiseClassFees();
  }

  generatePDF(selectClass : string = ''):any{
    const reciptContainer = document.querySelector(selectClass) as HTMLElement;
    html2canvas(reciptContainer, {scale:2}).then(canvas => {
      if(selectClass == '.cwsChart'){
        console.log("cwsChart");
        
        const pdf = new jsPDF({
          unit: 'mm',
          format: [220,220]
        });
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG' , 0,0,220,220);
        pdf.save('receipt.pdf');
      }else{
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG' , 0,0,pageWidth,pageHeight);
        pdf.save('receipt.pdf');
      }
    })
  }
}
