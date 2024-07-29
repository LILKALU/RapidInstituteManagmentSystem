import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { CourseVM } from '../shared/models/coursesVM';
import { CourseService } from '../shared/services/course.service';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { studentVM } from '../shared/models/studentVM';
import { EnrolmentVM } from '../shared/models/enrolmentVM';
import { MonthVM } from '../shared/models/monthVM';
import { MonthService } from '../shared/services/month.service';
import { attendanceVM } from '../shared/models/attendanceVM';
import { AttendanceService } from '../shared/services/attendance.service';
import { attendanceSearchVM } from '../shared/models/attendanceSearchVM';
import { MessageService } from 'primeng/api';
import { dateVM } from '../shared/models/dateVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { ClassFeeCourseService } from '../shared/services/class-fee-course.service';
import { monthCourseVM } from '../shared/models/monthCourseVM';

@Component({
  selector: 'app-manage-attendance',
  templateUrl: './manage-attendance.component.html',
  styleUrls: ['./manage-attendance.component.css']
})
export class ManageAttendanceComponent implements OnInit, OnDestroy{
  
  today = new Date();
  appIconId : number = 10
  thisMonthId : number = this.today.getMonth() + 1;
  thisFullYear : number = this.today.getFullYear();
  thisDate : number = this.today.getDate();
  thisMonth : MonthVM | undefined
  allMonths : MonthVM[] = [];
  isLoading : boolean = false;
  private subs = new SubSink();
  selectedCourseForm !: FormGroup;
  selectAction !: FormGroup
  filterDataForm !: FormGroup
  attendanceForm !: FormGroup
  searchAttendanceForm !: FormGroup;
  dropdownCourses : CourseVM[] = [];
  selectedCourse : CourseVM | undefined
  attedanceOnCourse : attendanceVM[] = []
  selectedCourseStudents: studentVM[] = []
  allEnrolmentCourses : EnrolmentCourseVM[]= []
  allEnrolments : EnrolmentVM[] = []
  studentsInCourse : studentVM[] = []
  studentFilterData : studentVM[] = [];
  dateFilterData : dateVM[] = [];
  isMarkAttendance : boolean = false;
  attenadances : attendanceVM[] = []
  searchedAttenadancesAllData : attendanceVM[] = []
  searchedAttenadancesTableData : attendanceVM[] = []
  todayAttendance : attendanceVM[] = []
  action : number = 1;
  isAttendFilterData : string[] = ["Attend","Not Attend"];
  isUpdateForm : boolean = false;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];

  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  get getSelectedCourseForMark(): AbstractControl { return this.selectedCourseForm.get('courseName') as AbstractControl; }

  get getSelectedCourseForSearch(): AbstractControl { return this.searchAttendanceForm.get('courseName') as AbstractControl; }
  get getSelectedYearForSearch(): AbstractControl { return this.searchAttendanceForm.get('year') as AbstractControl; }
  get getSelectedMonthForSearch(): AbstractControl { return this.searchAttendanceForm.get('month') as AbstractControl; }

  get getFormFilterName(): AbstractControl { return this.filterDataForm.get('name') as AbstractControl; }
  get getFormFilterScode(): AbstractControl { return this.filterDataForm.get('scode') as AbstractControl; }
  get getFormFilterDate(): AbstractControl { return this.filterDataForm.get('date') as AbstractControl; }
  get getFormFilterIsAttend(): AbstractControl { return this.filterDataForm.get('isAttend') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private courseService : CourseService,
    private classFeeCourseService : ClassFeeCourseService,
    private enrolmentCourseService : EnrolmentCourseService,
    private monthService : MonthService,
    private attendanceService : AttendanceService,
    private messageService: MessageService,
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscriptions();
  }

  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
        this.getCourses();
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
  }

  buildForm(){
    this.selectedCourseForm = this.formBuilder.group({
      courseName : ['' , Validators.required]
    })

    this.selectAction = this.formBuilder.group({
      action : [1 , Validators.required]
    });

    this.searchAttendanceForm = this.formBuilder.group({
      courseName : ['' , Validators.required],
      year : ['',Validators.required],
      month : [null, Validators.required]
    })

    this.filterDataForm = this.formBuilder.group({
      name : null,
      scode : null,
      date : null,
      isAttend : null
    })

    this.attendanceForm = this.formBuilder.group({});
  }

  getCourses(){
    this.isLoading = true;
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data){
        this.dropdownCourses = data.content;
        this.getEnrolments();
      }
    })
  }

  getEnrolments(){
    this.subs.sink = this.enrolmentCourseService.getEnrolmentCourse().subscribe(data =>{
      if(data){
        this.allEnrolmentCourses = data.content
        this.getMonths()
      }
    })
  }

  getMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data){
        this.allMonths = data.content;
        this.thisMonth = this.allMonths.find(el => el.id === this.thisMonthId)
        this.isLoading = false;
      }
    })
    
  }
  getStudentsInCourse(){
    let formControls: { [key: string]: any } = {};
    this.isLoading = true;

    console.log(this.getSelectedCourseForMark.value);
    this.studentsInCourse = []
    this.allEnrolments = []
    let monthCourse : monthCourseVM | undefined;
    let course : CourseVM | undefined;

    course = this.dropdownCourses.find(el => el.code ===this.getSelectedCourseForMark.value)

    if(course && this.thisMonth){
      monthCourse = {
        course : course,
        month : this.thisMonth
      }
    }

    if(monthCourse){
      this.subs.sink = this.classFeeCourseService.getPaiedStudentByMonthAndCourse(monthCourse).subscribe(data =>{
        if(data && data.content){
          this.studentsInCourse = data.content;
          this.studentsInCourse.forEach(element => {
            let name : string = element.scode + "Attendance";
            formControls[name] = [false];
          });
          this.attendanceForm = this.formBuilder.group(formControls)
          this.setMarkedAttendance();
        }
      })
    }
  }

  setMarkedAttendance(){
    console.log("date" ,new Date("2024-01-25"));
    let attenadanceSearch : attendanceSearchVM;
    this.attedanceOnCourse = [];
    
    let today :string = this.thisFullYear + '-' + this.thisMonthId + '-' + this.thisDate
    this.selectedCourse = this.dropdownCourses.find(el => el && el.code && el.code === this.getSelectedCourseForMark.value)
    console.log("this.selectedCourse",this.selectedCourse);
     
    if(this.selectedCourse && this.thisMonth){
      attenadanceSearch = {
        course : this.selectedCourse,
        month : this.thisMonth,
        date : this.thisDate,
        year : this.thisFullYear
      }
      this.subs.sink = this.attendanceService.getAttendanceByCourse(attenadanceSearch).subscribe(data =>{
        if(data && data.content){
          this.attedanceOnCourse = data.content

          this.studentsInCourse.forEach(ele => {
            this.attedanceOnCourse.forEach(element => {
              if(ele && element && ele.id == element.student.id && element.course && element.course.id == this.selectedCourse?.id && element.date == this.thisDate && element.month.id == this.thisMonth?.id && element.year == this.thisFullYear){
                let name : string = ele.scode + "Attendance";
                let isAttend : boolean = element.isAttend;
                this.attendanceForm.get(name)?.patchValue(isAttend)
              }
            });
            // console.log("parent",ele);
          });
          this.isUpdateForm = true;
          this.isLoading = false;
        }else{
          this.isLoading = false;
        }
      })
    }
    
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
  }

  submitOrUpdate(){
    if(this.isUpdateForm){
      this.update();
    }else{
      this.submit();
    }
  }

  update(){
    this.attenadances = [];
    let course : CourseVM | undefined;
    this.isLoading=true;

    course = this.dropdownCourses.find(el => el.code && el.code === this.getSelectedCourseForMark.value);

    this.studentsInCourse.forEach(element => {
      let name : string = element.scode + "Attendance";
      let attendance : attendanceVM;
      let att = this.attedanceOnCourse.find(el => el && el.student && el.student.id == element.id)
      if(course && att){
        
        attendance = {
          ...att,
          isAttend : this.attendanceForm.get(name)?.value,
        }
        this.attenadances.push(attendance)
      }
    });
    this.subs.sink = this.attendanceService.updateAttendance(this.attenadances).subscribe(data =>{
      if(data){
        console.log("success" , data);
        this.isLoading=false;
        this.isUpdateForm = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attendance Marked' });
      }
    })
    console.log(this.attenadances);
    
  }

  submit(){
    console.log("this.attendanceForm" , this.attendanceForm);
    this.attenadances = [];
    let course : CourseVM | undefined;
    this.isLoading=true;
    // console.log(this.getSelectedCourseForMark.value);

    course = this.dropdownCourses.find(el => el.code && el.code === this.getSelectedCourseForMark.value)
    
    this.studentsInCourse.forEach(element => {
      let name : string = element.scode + "Attendance";
      let attendance : attendanceVM;
      console.log(this.attendanceForm.get(name)?.value);
      
      if(course){
        attendance = {
          course : course,
          isAttend : this.attendanceForm.get(name)?.value,
          student : element,
          year : this.thisFullYear,
          date : this.thisDate,
          month : this.thisMonth ? this.thisMonth : this.allMonths[0]
        }

        this.attenadances.push(attendance)
      }
    });
    
    this.subs.sink = this.attendanceService.markAttendance(this.attenadances).subscribe(data =>{
      if(data){
        console.log("success" , data);
        this.isLoading=false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attendance Marked' });
      }
    })

    // console.log(this.attenadances);
  }

  test(){
    console.log(this.getSelectedYearForSearch.value);
  }

  searchHall(){
    this.selectedCourseStudents = []
    let course : CourseVM | undefined;
    let month : MonthVM | undefined;
    let attenadanceSearch : attendanceSearchVM; 

    course = this.dropdownCourses.find(el => el && el.code && this.getSelectedCourseForSearch.value && el.code == this.getSelectedCourseForSearch.value)
    month = this.allMonths.find(el => el && el.id && this.getSelectedMonthForSearch.value && el.id == this.getSelectedMonthForSearch.value)

    if(course && month){
      attenadanceSearch = {
        course : course,
        month : month,
        year : this.getSelectedYearForSearch.value.getFullYear()
      }

      this.subs.sink = this.attendanceService.getAttendanceByCourseAndYearAndMonth(attenadanceSearch).subscribe(data =>{
        if(data && data.content){
          this.searchedAttenadancesAllData = data.content;
          this.searchedAttenadancesTableData = this.searchedAttenadancesAllData
          this.searchedAttenadancesAllData.forEach(element => {
            if(this.selectedCourseStudents.length>0){
              if(!(this.selectedCourseStudents.filter(el => el && el.id == element.student.id).length > 0)){
                this.selectedCourseStudents.push(element.student);
              }
            }else{
              this.selectedCourseStudents.push(element.student);
            }
            
            if(this.dateFilterData.length >0){
              if(!(this.dateFilterData.filter(el => el.date == element.date && el.month?.id == element.month.id && el.year == element.year).length>0)){
                let date : dateVM;
                date = {
                  date : element.date,
                  month : element.month,
                  year : element.year
                }
                this.dateFilterData.push(date);
              }
            }else{
              let date : dateVM;
              date = {
                date : element.date,
                month : element.month,
                year : element.year
              }
              this.dateFilterData.push(date);
            }
          });
        }
      })
    }
    
  }

  filterAttendanceData(){
    let filterData : attendanceVM[] = this.searchedAttenadancesAllData;
    console.log(this.getFormFilterIsAttend.value);
    console.log(this.attendanceToString(this.getFormFilterIsAttend.value));

    console.log(typeof this.getFormFilterIsAttend.value);
    console.log(typeof this.attendanceToString(this.getFormFilterIsAttend.value));
    
    

    if(filterData && filterData.length && this.getFormFilterName && this.getFormFilterName.value && this.getFormFilterName.value.id){
      filterData = filterData.filter(el => el.student && el.student.id == this.getFormFilterName.value.id);
    }

    if(filterData && filterData.length && this.getFormFilterScode && this.getFormFilterScode.value && this.getFormFilterScode.value.id){
      filterData = filterData.filter(el => el.student && el.student.id == this.getFormFilterScode.value.id);
    }

    if(filterData && filterData.length && this.getFormFilterDate && this.getFormFilterDate.value && this.getFormFilterDate.value.year && this.getFormFilterDate.value.month && this.getFormFilterDate.value.month.id && this.getFormFilterDate.value.date){
      filterData = filterData.filter(el => el.year && el.month && el.month.id && el.date && el.year == this.getFormFilterDate.value.year && el.month.id == this.getFormFilterDate.value.month.id && el.date == this.getFormFilterDate.value.date);
    }

    if(filterData && filterData.length && this.getFormFilterIsAttend && this.getFormFilterIsAttend.value){
      filterData = filterData.filter(el => el.isAttend.toString() && el.isAttend.toString() == this.attendanceToString(this.getFormFilterIsAttend.value));
    }

    this.searchedAttenadancesTableData = filterData;
  }

  attendanceToString(value : string):string{
    if(value == "Attend"){
      return "true"
    }else{
      return "false"
    }
  }

  reset(){
    this.searchedAttenadancesTableData = this.searchedAttenadancesAllData;
  }
}


