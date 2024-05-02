import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { TeacherService } from '../shared/services/teacher.service';
import { teacherVM } from '../shared/models/teachersVM';
import { SubjectService } from '../shared/services/subject.service';
import { SubjectVM } from '../shared/models/subjectVM';
import { GradeService } from '../shared/services/grade.service';
import { GradeVM } from '../shared/models/gradeVM';
import * as moment from 'moment';
import { HallVM } from '../shared/models/hallVM';
import { HallServiceService } from '../shared/services/hall-service.service';
import { CourseService } from '../shared/services/course.service';
import { CourseVM } from '../shared/models/coursesVM';
import { timeSlotsResponse } from '../shared/models/timeSlotsResponseVM';
import { TimeSlotService } from '../shared/services/time-slot.service';
import { timeSlotVM } from '../shared/models/timeSlotVM';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css']
})
export class ManageCourseComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  isLoading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  courseCreationPopUp !: FormGroup;
  courseUpdatePopUp !: FormGroup;
  action : number | undefined;
  coursesOnSelectedDay : CourseVM[] = [];
  coursesOnSelectedGrade : CourseVM[] = [];
  deletedCourse : CourseVM | undefined
  updateingCourse : CourseVM | undefined
  updatedCourse : CourseVM | undefined
  teachers : teacherVM[] = [];
  subjects : SubjectVM[] = [];
  allTimeSlots : timeSlotVM[] = [];
  startTimeSlots : timeSlotVM[] = [];
  endTimeSlots : timeSlotVM[] = [];
  grades : GradeVM[] = [];
  halls : HallVM[] = [];
  selectableHalls : HallVM[] = [];
  coursesAllData : CourseVM[] = []
  coursesTableData : CourseVM[] = []
  selectedHalls : HallVM[] = [];
  isSubjectFeildVisible   : boolean = false;
  isGradeFeildVisible     : boolean = false;
  isDayFeildVisible       : boolean = false;
  isStartTimeFeildVisible : boolean = false;
  isEndTimeFeildVisible   : boolean = false;
  isHallFeildVisible      : boolean = false;
  isClassFeeFeildVisible  : boolean = false;
  isUpdateSubjectFeildVisible   : boolean = true;
  isUpdateGradeFeildVisible     : boolean = true;
  isUpdateDayFeildVisible       : boolean = true;
  isUpdateStartTimeFeildVisible : boolean = true;
  isUpdateEndTimeFeildVisible   : boolean = true;
  isUpdateHallFeildVisible      : boolean = true;
  isUpdateClassFeeFeildVisible  : boolean = true;
  days = [
    {id:1, name : "Sunday"},{id:2, name : "Monday"},{id:3, name : "Tuesday"},{id:4, name : "Wednesday"},{id:5, name : "Thursday"},{id:6, name : "Friday"},{id:7, name : "Saturday"},
  ];
  isCreateCourseFormButtonVisible : boolean = false;
  isCourseFormVisible : boolean = false;
  isUpdateFormVisible : boolean = false;
  isHallSelecting : boolean = false;

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get course creation values
  get getTeacherName(): AbstractControl { return this.courseCreationPopUp.get('teacherName') as AbstractControl; }
  get getSubject(): AbstractControl { return this.courseCreationPopUp.get('subject') as AbstractControl; }
  get getGrade(): AbstractControl { return this.courseCreationPopUp.get('grade') as AbstractControl; }
  get getDay(): AbstractControl { return this.courseCreationPopUp.get('day') as AbstractControl; }
  get getStartTime(): AbstractControl { return this.courseCreationPopUp.get('startTime') as AbstractControl; }
  get getEndTime(): AbstractControl { return this.courseCreationPopUp.get('endTime') as AbstractControl; }
  get getHall(): AbstractControl { return this.courseCreationPopUp.get('hall') as AbstractControl; }
  get getCourseFee(): AbstractControl { return this.courseCreationPopUp.get('courseFee') as AbstractControl; }

  // get course creation values
  get getUpdateTeacherName(): AbstractControl { return this.courseUpdatePopUp.get('teacherName') as AbstractControl; }
  get getUpdateSubject(): AbstractControl { return this.courseUpdatePopUp.get('subject') as AbstractControl; }
  get getUpdateGrade(): AbstractControl { return this.courseUpdatePopUp.get('grade') as AbstractControl; }
  get getUpdateDay(): AbstractControl { return this.courseUpdatePopUp.get('day') as AbstractControl; }
  get getUpdateStartTime(): AbstractControl { return this.courseUpdatePopUp.get('startTime') as AbstractControl; }
  get getUpdateEndTime(): AbstractControl { return this.courseUpdatePopUp.get('endTime') as AbstractControl; }
  get getUpdateHall(): AbstractControl { return this.courseUpdatePopUp.get('hall') as AbstractControl; }
  get getUpdateCourseFee(): AbstractControl { return this.courseUpdatePopUp.get('courseFee') as AbstractControl; }


  constructor(
    private formBuilder: FormBuilder,
    private teachersService : TeacherService,
    private subjectService : SubjectService,
    private gradeService : GradeService,
    private hallService : HallServiceService,
    private courseService : CourseService,
    private timeSlotService : TimeSlotService,
    private confirmationService: ConfirmationService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getMasterData();
  }

  getMasterData(){
    this.isLoading = true;
    this.getTeachersDetails();
  }

  getTeachersDetails(){
    this.subs.sink = this.teachersService.getTeachers().subscribe(data =>{
      if(data){
        this.teachers = data.content;
        this.getSubjectDetails();
      }
    })
  }

  getSubjectDetails(){
    this.subs.sink = this.subjectService.getSubjects().subscribe(data =>{
      if(data){
        this.subjects = data.content
        this.getGradeDetails();
      }
    })
  }

  getGradeDetails(){
    this.subs.sink = this.gradeService.getGrades().subscribe(data => {
      if(data){
        this.grades = data.content;
        this.getHallDetails();
      }
    })
  }

  getHallDetails(){
    this.subs.sink = this.hallService.getHalls().subscribe(data =>{
      if(data){
        this.halls = data.content;
        this.getCourseDetails();
      }
    })
  }

  getCourseDetails(){
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data){
        this.coursesAllData = data.content;
        console.log("initCourset",this.coursesAllData);
        this.coursesTableData = this.coursesAllData
        this.coursesTableData.reverse()
        this.isLoading = false;
        this.getTimeSlots();
      }
    })
  }

  getTimeSlots(){
    this.subs.sink = this.timeSlotService.getTimeSlots().subscribe(data =>{
      if(data){
        this.allTimeSlots = data.content;
        this.startTimeSlots = this.allTimeSlots;
        this.endTimeSlots = this.allTimeSlots;
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

    this.courseCreationPopUp = this.formBuilder.group({
      teacherName : ['' , Validators.required],
      subject : ['' , Validators.required],
      grade : ['',Validators.required],
      day : ['', Validators.required],
      startTime : ['',Validators.required],
      endTime : ['',Validators.required],
      hall : ['' , Validators.required],
      courseFee : [0,Validators.required]
    })

    this.courseUpdatePopUp = this.formBuilder.group({
      teacherName : ['' , Validators.required],
      subject : ['' , Validators.required],
      grade : ['',Validators.required],
      day : ['', Validators.required],
      startTime : ['',Validators.required],
      endTime : ['',Validators.required],
      hall : ['' , Validators.required],
      courseFee : [0,Validators.required]
    })
  }

  updateClick(){
    this.isLoading = true;
    let starttime : timeSlotVM;
    let endtime : timeSlotVM;

    starttime = this.getUpdateStartTime.value;
    endtime = this.getUpdateEndTime.value;
    let endTimeValue = endtime.time ? endtime.time : '';
    let startTimeValue = starttime.time ? starttime.time : '';

    let course : CourseVM;

    course = {
      id : this.updateingCourse?.id,
      teacher : this.getUpdateTeacherName.value,
      classFeeAmount : this.getUpdateCourseFee.value,
      date : this.getUpdateDay.value.name,
      endTime : endTimeValue,
      grade : this.getUpdateGrade.value,
      hall : this.getUpdateHall.value,
      startTime : startTimeValue,
      subject : this.getUpdateSubject.value,
      isActive : true,
      code : this.updateingCourse?.code
    }

    this.subs.sink = this.courseService.updateCourse(course).subscribe(data => {
      if(data){
        this.updatedCourse = data.content;
        console.log("success");
        let index = this.coursesAllData.findIndex(course => course.id === this.updateingCourse?.id);
        this.coursesAllData[index] = this.updatedCourse;
        this.coursesTableData = this.coursesAllData;
        this.closeCourseUpdatePopup();
        this.isLoading = false;
      }
    })
  }
  submitClick(){
    let starttime : timeSlotVM;
    let endtime : timeSlotVM;

    starttime = this.getStartTime.value;
    endtime = this.getEndTime.value;
    let endTimeValue = endtime.time ? endtime.time : '';
    let startTimeValue = starttime.time ? starttime.time : '';

    console.log(this.getTeacherName.value);
    // console.log(endTimeString);

    let course : CourseVM;

    course = {
      teacher : this.getTeacherName.value,
      classFeeAmount : this.getCourseFee.value,
      date : this.getDay.value.name,
      endTime : endTimeValue,
      grade : this.getGrade.value,
      hall : this.getHall.value,
      startTime : startTimeValue,
      subject : this.getSubject.value,
      isActive : true
    }
    console.log(course);
    
    this.subs.sink = this.courseService.createCourse(course).subscribe(data =>{
      if(data){
        this.closeCourseCreationPopup();
        this.coursesAllData.push(data.content);
        this.coursesTableData = this.coursesTableData;
        this.coursesTableData.reverse()
      }
    });    
  }

  openUpdateForm(courseData : CourseVM){
    this.updateingCourse = courseData;
    this.selectableHalls = this.halls
    let teacherIndex = this.teachers.findIndex(t => t.id === courseData.teacher.id);
    let hallIndex = this.selectableHalls.findIndex(h => h.id === courseData.hall.id);
    let gradeIndex = this.grades.findIndex(g => g.id === courseData.grade.id);
    let subjectIndex = this.subjects.findIndex(s => s.id === courseData.subject.id)
    let dateIndex = this.days.findIndex(d => d.name === courseData.date)
    let startTimeIndex = this.allTimeSlots.findIndex(st => st.time === courseData.startTime)
    let endTimeIndex = this.allTimeSlots.findIndex(et => et.time === courseData.endTime)
    let classFee : number = courseData.classFeeAmount
    let x = parseInt(classFee.toFixed(2));
     

    console.log(classFee);
    console.log(this.selectableHalls[hallIndex]);

    this.getUpdateCourseFee.patchValue(x)

    this.courseUpdatePopUp.patchValue({
      teacherName : this.teachers[teacherIndex],
      day: this.days[dateIndex],
      endTime : this.allTimeSlots[endTimeIndex],
      grade : this.grades[gradeIndex],
      hall : this.selectableHalls[hallIndex],
      startTime : this.allTimeSlots[startTimeIndex],
      subject : this.subjects[subjectIndex],
      isActive : true
    })
    this.isUpdateFormVisible = true;
  }

  deleteCourse(courseData : CourseVM){
    let course : CourseVM = courseData;

    let delCourse : CourseVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isLoading = true;
        delCourse = {
          ...course,
          isActive : false
        }
    
        this.subs.sink = this.subs.sink = this.courseService.deleteCourse(delCourse).subscribe(data =>{
          if(data){
            this.deletedCourse = data.content
            this.coursesAllData.forEach((element,index) => {
              if(element.id == course.id){
                this.coursesAllData.splice(index , 1);
              }
            });
            this.coursesTableData = this.coursesAllData
            console.log(this.deletedCourse);
            this.isLoading = false;
          }
        })
      }
    });
  }

  closeCourseUpdatePopup(){
    this.isUpdateFormVisible = false
    this.isUpdateSubjectFeildVisible  = false       
    this.isUpdateGradeFeildVisible    = false
    this.isUpdateDayFeildVisible      = false
    this.isUpdateStartTimeFeildVisible= false
    this.isUpdateEndTimeFeildVisible  = false
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false
    this.courseUpdatePopUp.reset()
  }

  test(){
    console.log(typeof this.getCourseFee.value);
    
  }

  setUpdateSubject(){
    this.getUpdateSubject.reset()
    this.getUpdateGrade.reset()
    this.getUpdateDay.reset()
    this.getUpdateStartTime.reset()
    this.getUpdateEndTime.reset()
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = false
    this.isUpdateDayFeildVisible      = false
    this.isUpdateStartTimeFeildVisible= false
    this.isUpdateEndTimeFeildVisible  = false
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false
  }

  setSubject(){
    this.getSubject.reset()
    this.getGrade.reset()
    this.getDay.reset()
    this.getStartTime.reset()
    this.getEndTime.reset()
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = false
    this.isDayFeildVisible      = false
    this.isStartTimeFeildVisible= false
    this.isEndTimeFeildVisible  = false
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false
  }

  setUpdateGrade(){
    this.getUpdateGrade.reset()
    this.getUpdateDay.reset()
    this.getUpdateStartTime.reset()
    this.getUpdateEndTime.reset()
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = false
    this.isUpdateStartTimeFeildVisible= false
    this.isUpdateEndTimeFeildVisible  = false
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false
  }

  setGrade(){
    this.getGrade.reset()
    this.getDay.reset()
    this.getStartTime.reset()
    this.getEndTime.reset()
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = false
    this.isStartTimeFeildVisible= false
    this.isEndTimeFeildVisible  = false
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false
  }

  setUpdateDay(){
    this.getUpdateDay.reset()
    this.getUpdateStartTime.reset()
    this.getUpdateEndTime.reset()
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = true
    this.isUpdateStartTimeFeildVisible= false
    this.isUpdateEndTimeFeildVisible  = false
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false
  }
  setDay(){
    this.getDay.reset()
    this.getStartTime.reset()
    this.getEndTime.reset()
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = true
    this.isStartTimeFeildVisible= false
    this.isEndTimeFeildVisible  = false
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false
  }

  setUpdateStartTime(){
    this.getUpdateStartTime.reset()
    this.getUpdateEndTime.reset()
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = true
    this.isUpdateStartTimeFeildVisible= true
    this.isUpdateEndTimeFeildVisible  = false
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false

    let removedIndex : number[] = [];

    this.coursesOnSelectedDay = this.coursesAllData.filter(el => el.date == this.getUpdateDay.value.name);
    this.coursesOnSelectedGrade = this.coursesOnSelectedDay.filter(el => el.grade.id == this.getUpdateGrade.value.id);

    if(this.coursesOnSelectedGrade.length > 0){

      this.startTimeSlots = this.allTimeSlots;
      this.endTimeSlots = this.allTimeSlots;

      this.coursesOnSelectedGrade.forEach((element , gradeIndex) => {

        let momEleStartTime = moment(element.startTime , 'HH:mm' )
        let momEleEndTime = moment(element.endTime , 'HH:mm')
        
        this.allTimeSlots.forEach((element,index) => {
          
          let momTime = moment(element.time , 'HH:mm');

          if((momTime.isAfter(momEleStartTime) && momTime.isBefore(momEleEndTime)) || momTime.isSame(momEleStartTime)){
            removedIndex.push(index)
          }

        });
      });

      let indexesToRemove = removedIndex.map(index => this.startTimeSlots[index]);
      this.startTimeSlots = this.startTimeSlots.filter(timeSlot => !indexesToRemove.includes(timeSlot));
      console.log(this.allTimeSlots);
    }else{
      this.startTimeSlots = this.allTimeSlots
    }

  }

  setStartTime(){
    this.getStartTime.reset()
    this.getEndTime.reset()
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = true
    this.isStartTimeFeildVisible= true
    this.isEndTimeFeildVisible  = false
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false

    console.log("ds",this.getDay.value);
    
    let removedIndex : number[] = [];

    this.coursesOnSelectedDay = this.coursesAllData.filter(el => el.date == this.getDay.value.name);
    this.coursesOnSelectedGrade = this.coursesOnSelectedDay.filter(el => el.grade.id == this.getGrade.value.id);

    if(this.coursesOnSelectedGrade.length > 0){

      this.startTimeSlots = this.allTimeSlots;
      this.endTimeSlots = this.allTimeSlots;

      this.coursesOnSelectedGrade.forEach((element , gradeIndex) => {

        let momEleStartTime = moment(element.startTime , 'HH:mm' )
        let momEleEndTime = moment(element.endTime , 'HH:mm')
        
        this.allTimeSlots.forEach((element,index) => {
          
          let momTime = moment(element.time , 'HH:mm');

          if((momTime.isAfter(momEleStartTime) && momTime.isBefore(momEleEndTime)) || momTime.isSame(momEleStartTime)){
            removedIndex.push(index)
          }

        });
      });

      let indexesToRemove = removedIndex.map(index => this.startTimeSlots[index]);
      this.startTimeSlots = this.startTimeSlots.filter(timeSlot => !indexesToRemove.includes(timeSlot));
      console.log(this.allTimeSlots);
    }else{
      this.startTimeSlots = this.allTimeSlots
    }

    console.log(this.allTimeSlots);
    

  }

  setUpdateEndTime(){
    this.getUpdateEndTime.reset()
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = true
    this.isUpdateStartTimeFeildVisible= true
    this.isUpdateEndTimeFeildVisible  = true
    this.isUpdateHallFeildVisible     = false
    this.isUpdateClassFeeFeildVisible = false

    let removedIndex : number[] = [];
    let starttime : timeSlotVM;

    starttime = this.getUpdateStartTime.value ? this.getUpdateStartTime.value : '';
    let momStartTime = moment(starttime?.time , 'HH:mm')
    this.endTimeSlots = this.allTimeSlots;

    this.allTimeSlots.forEach((element,index) => {
      let eleTime = moment(element.time , 'HH:mm')
      if(eleTime.isBefore(momStartTime) || eleTime.isSame(momStartTime)){
        removedIndex.push(index);
      }
    });

    let indexesToRemove = removedIndex.map(index => this.endTimeSlots[index]);
    this.endTimeSlots = this.endTimeSlots.filter(timeSlot => !indexesToRemove.includes(timeSlot));

    removedIndex = []
    let closestAfterTime = moment("23:59", "HH:mm");
    let closestAfterIndex = -1;

    this.coursesOnSelectedGrade.forEach((element,gradeIndex) => {
      let eleTime = moment(element.startTime , "HH:mm");
        
        if(eleTime.isAfter(momStartTime) && (closestAfterTime === null || eleTime.diff(momStartTime) < closestAfterTime.diff(momStartTime))){
          closestAfterTime = eleTime;
          closestAfterIndex = gradeIndex;
        }
    });

    this.endTimeSlots.forEach((element,index) => {
      let eleTime = moment(element.time , 'HH:mm')
      if(eleTime.isAfter(closestAfterTime)){
        removedIndex.push(index)
      }
    });

    let indexeToRemove = removedIndex.map(index => this.endTimeSlots[index]);
    this.endTimeSlots = this.endTimeSlots.filter(timeSlot => !indexeToRemove.includes(timeSlot));
  }

  setEndTime(){
    this.getEndTime.reset()
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = true
    this.isStartTimeFeildVisible= true
    this.isEndTimeFeildVisible  = true
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false

    let removedIndex : number[] = [];
    let starttime : timeSlotVM
    starttime = this.getStartTime.value ? this.getStartTime.value : '';
    let momStartTime = moment(starttime?.time , 'HH:mm')
    this.endTimeSlots = this.allTimeSlots;

    this.allTimeSlots.forEach((element,index) => {
      let eleTime = moment(element.time , 'HH:mm')
      if(eleTime.isBefore(momStartTime) || eleTime.isSame(momStartTime)){
        removedIndex.push(index)
      }
    });

    let indexesToRemove = removedIndex.map(index => this.endTimeSlots[index]);
    this.endTimeSlots = this.endTimeSlots.filter(timeSlot => !indexesToRemove.includes(timeSlot));

    console.log("removed end time 1st",this.endTimeSlots);
    

    removedIndex = []
    let closestAfterTime = moment("23:59", "HH:mm");
    let closestAfterIndex = -1;

    this.coursesOnSelectedGrade.forEach((element,gradeIndex) => {
    let eleTime = moment(element.startTime , "HH:mm");
      
      if(eleTime.isAfter(momStartTime) && (closestAfterTime === null || eleTime.diff(momStartTime) < closestAfterTime.diff(momStartTime))){
        closestAfterTime = eleTime;
        closestAfterIndex = gradeIndex;
      }
    });
    
    console.log("closestTime" , closestAfterTime);
    

    this.endTimeSlots.forEach((element,index) => {
      let eleTime = moment(element.time , 'HH:mm')
      if(eleTime.isAfter(closestAfterTime)){
        removedIndex.push(index)
      }
    });

    let indexeToRemove = removedIndex.map(index => this.endTimeSlots[index]);
    this.endTimeSlots = this.endTimeSlots.filter(timeSlot => !indexeToRemove.includes(timeSlot));

    console.log("endTimeSlots",this.endTimeSlots);
    
  }

  setUpdateHalls(){
    this.getUpdateHall.reset()
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = true
    this.isUpdateStartTimeFeildVisible= true
    this.isUpdateEndTimeFeildVisible  = true
    this.isUpdateHallFeildVisible     = true
    this.isUpdateClassFeeFeildVisible = false

    this.selectableHalls = this.halls;
    let starttime : timeSlotVM;
    let endtime : timeSlotVM;

    starttime = this.getUpdateStartTime.value?this.getUpdateStartTime.value:'';
    endtime = this.getUpdateEndTime.value?this.getUpdateEndTime.value:'';

    let momSelectedStartTime = moment(starttime.time?starttime.time:'' , 'HH:mm' )
    let momSelectedEndTime = moment(endtime.time?endtime.time:'' , 'HH:mm' )
    let momCourseStartTime;
    let momCourseEndTime;

    let hallIndexs : number[] = [];

    this.coursesOnSelectedDay.forEach(element => {
      momCourseStartTime = moment(element.startTime, 'HH:mm');
      momCourseEndTime = moment(element.endTime, 'HH:mm');

      if(momSelectedStartTime.isBefore(momCourseEndTime) && momSelectedEndTime.isAfter(momCourseStartTime)){
        this.selectableHalls.forEach((hall,index) => {
          if(element.hall.id == hall.id){
            hallIndexs.push(index)
          }
        });
      }
    });

    let indexeToRemove = hallIndexs.map(index => this.selectableHalls[index]);
    this.selectableHalls = this.selectableHalls.filter(hall => !indexeToRemove.includes(hall));
  }
  setHalls(){
    this.getHall.reset()
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = true
    this.isStartTimeFeildVisible= true
    this.isEndTimeFeildVisible  = true
    this.isHallFeildVisible     = true
    this.isClassFeeFeildVisible = false

    this.selectableHalls = this.halls;
    let starttime : timeSlotVM;
    let endtime : timeSlotVM;
    starttime = this.getStartTime.value?this.getStartTime.value:'';
    endtime = this.getEndTime.value?this.getEndTime.value:'';
    let momSelectedStartTime = moment(starttime.time?starttime.time:'' , 'HH:mm' )
    let momSelectedEndTime = moment(endtime.time?endtime.time:'' , 'HH:mm' )
    let momCourseStartTime;
    let momCourseEndTime;
    
    let hallIndexs : number[] = [];

    this.coursesOnSelectedDay.forEach(element => {
        momCourseStartTime = moment(element.startTime, 'HH:mm');
        momCourseEndTime = moment(element.endTime, 'HH:mm');
        console.log(momSelectedStartTime.isBefore(momCourseEndTime));
        console.log( momSelectedEndTime.isAfter(momCourseStartTime));
        
        
        if(momSelectedStartTime.isBefore(momCourseEndTime) && momSelectedEndTime.isAfter(momCourseStartTime)){
          this.selectableHalls.forEach((hall,index) => {
            if(element.hall.id == hall.id){
              hallIndexs.push(index)
            }
          });
        }
    });

    console.log(hallIndexs);
    
    let indexeToRemove = hallIndexs.map(index => this.selectableHalls[index]);
    console.log(indexeToRemove);
    
    this.selectableHalls = this.selectableHalls.filter(hall => !indexeToRemove.includes(hall));

    console.log(this.selectableHalls);
  }

  setUpdateClassFee(){
    this.getUpdateCourseFee.reset()
    this.isUpdateSubjectFeildVisible  = true       
    this.isUpdateGradeFeildVisible    = true
    this.isUpdateDayFeildVisible      = true
    this.isUpdateStartTimeFeildVisible= true
    this.isUpdateEndTimeFeildVisible  = true
    this.isUpdateHallFeildVisible     = true
    this.isUpdateClassFeeFeildVisible = true
  }

  setClassFee(){
    this.getCourseFee.reset()
    this.isSubjectFeildVisible  = true       
    this.isGradeFeildVisible    = true
    this.isDayFeildVisible      = true
    this.isStartTimeFeildVisible= true
    this.isEndTimeFeildVisible  = true
    this.isHallFeildVisible     = true
    this.isClassFeeFeildVisible = true
  }

  timecheck(){
    this.isHallSelecting = true;
    let hallIds : number[] = [];

    let startTimeValue = this.getStartTime.value as Date;
    let startTimeString = startTimeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false  });

    let endTimeValue = this.getEndTime.value as Date;
    let endTimeString = endTimeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false  });

    let momSelectedStartTime = moment(startTimeString , 'HH:mm' )
    let momSelectedEndTime = moment(endTimeString , 'HH:mm' )
    let momCourseStartTime;
    let momCourseEndTime;

    this.coursesAllData.forEach(element => {
      if(element.date == this.getDay.value){
        momCourseStartTime = moment(element.startTime, 'HH:mm');
        momCourseEndTime = moment(element.endTime, 'HH:mm');
        if(momSelectedStartTime.isBefore(momCourseEndTime) && momSelectedEndTime.isAfter(momCourseStartTime)){
          hallIds.push(element.hall.id ? element.hall.id : -1);
        }
      }
    });

    console.log(hallIds);
  }

  closeCourseCreationPopup(){
    this.isCourseFormVisible = false
    this.isSubjectFeildVisible  = false       
    this.isGradeFeildVisible    = false
    this.isDayFeildVisible      = false
    this.isStartTimeFeildVisible= false
    this.isEndTimeFeildVisible  = false
    this.isHallFeildVisible     = false
    this.isClassFeeFeildVisible = false
    this.courseCreationPopUp.reset()
  }



  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateCourseFormButtonVisible = false;
    }
  }

  openCourseForm(hallFormVisibility : boolean){
    this.isCourseFormVisible = hallFormVisibility;
  }

  searchCourse(){
    this.coursesTableData = this.coursesAllData.filter(el => el.code == this.getSearchValue.value)
  }
  reset(){
    this.coursesTableData = this.coursesAllData
  }
}
