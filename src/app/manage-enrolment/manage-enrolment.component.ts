import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../shared/services/course.service';
import { SubSink } from 'subsink';
import { CourseVM } from '../shared/models/coursesVM';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { StudentCourseVM } from '../shared/models/studentCourseVM';
import { ConfirmationService } from 'primeng/api';
import { StudentService } from '../shared/services/student.service';
import { studentVM } from '../shared/models/studentVM';
import { CourseStudentVM } from '../shared/models/courseStudentVM';
import { EnrolmentVM } from '../shared/models/enrolmentVM';
import { EnrolmentService } from '../shared/services/enrolment.service';
import { ClassFeeVM } from '../shared/models/classFeeVM';
import { ClassFeeCourseVM } from '../shared/models/classFeeCourseVM';
import { ClassFeeService } from '../shared/services/class-fee.service';
import { MonthService } from '../shared/services/month.service';
import { MonthVM } from '../shared/models/monthVM';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';

@Component({
  selector: 'app-manage-enrolment',
  templateUrl: './manage-enrolment.component.html',
  styleUrls: ['./manage-enrolment.component.css']
})
export class ManageEnrolmentComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  isLoading : boolean = false;
  leftSideCourses : CourseVM[] = [];
  enrolmentForm !: FormGroup;
  rightSideCourses : CourseVM[] = [];
  enrolingCourse : CourseVM | undefined;
  allCourses : CourseVM[] = [];
  enrolmentCourses : EnrolmentCourseVM[] = [];
  deletedEnrolment : EnrolmentCourseVM | undefined
  courseStudents : StudentCourseVM[] = [];
  isEnrolDialogVisible : boolean = false;
  isStudentGetting : boolean = false;
  classFeeForm !: FormGroup;
  filterDataForm !: FormGroup
  months : MonthVM[] = [];
  searchedStudent : studentVM | undefined;
  enrollments : EnrolmentVM = {};
  activeStepIndex : number = 0;
  reciptTemplateData : reciptTemplateDataVM | undefined;
  courseStudent : CourseStudentVM[] = []
  steps = [
    { label: 'Student Enrolment'},
    { label: 'Student Payment'},
    { label: 'Recipt'},
  ];

  get getScode(): AbstractControl { return this.enrolmentForm.get('scode') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private courseService : CourseService,
    private enrolmentCourseService : EnrolmentCourseService,
    private confirmationService: ConfirmationService,
    private studentServices : StudentService,
    private enrolmentService : EnrolmentService, 
    private classFeeService : ClassFeeService,
    private monthService : MonthService,
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getCourses();
    this.buildForm();
  }

  buildForm(){
    this.enrolmentForm = this.formBuilder.group({
      scode : ['S' , [Validators.required, Validators.pattern(/^[S][2][0][0-9]{7}$/)]]
    });

    this.classFeeForm = this.formBuilder.group({
      hasPaymentDone:['',Validators.required]
    })
  }

  getCourses(){
    this.isLoading = true;
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data){
        this.allCourses = data.content
        this.allCourses.forEach(element => {
          let courseId : number;
          courseId = element.id ? element.id : -1;
          if(courseId % 2 === 0){
            this.leftSideCourses.push(element);
          }else{
            this.rightSideCourses.push(element);
          }
        });
      }
      this.getEnrolments()
    })
  }

  getEnrolments(){
    this.subs.sink = this.enrolmentCourseService.getEnrolmentCourse().subscribe(data =>{
      if(data){
        this.enrolmentCourses = data.content;
        console.log(this.enrolmentCourses);
        this.groupEnrolments();
      }
    })
    this.getMonths();
  }

  getMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data){
        this.months = data.content;
        console.log("months" , this.months);
        this.isLoading = false;
      }
    })
  }

  groupEnrolments(){
    this.enrolmentCourses.forEach(element => {
      let courseStudent : StudentCourseVM;
      courseStudent = {
        course : element.course,
        student : element.enrolment?.student,
        enrolledDate : element.enrolment?.date
      }
      this.courseStudents.push(courseStudent)
    });

    console.log("courseStudents",this.courseStudents);
  }

  filterByCourse(course : CourseVM) : StudentCourseVM[]{
    let filteredCourse : StudentCourseVM [];
    filteredCourse = this.courseStudents.filter(el => el.course?.id === course.id)
    return filteredCourse;
  }

  getEnrolledDate(date : string) : string{
    let enrolmentDate : string;
    enrolmentDate = date.split("T")[0];
    return enrolmentDate;
  }

  closeCourseCreationPopup(){
    this.classFeeForm.reset();
    this.enrolmentForm.reset();
    this.activeStepIndex = 0;
    this.courseStudent = [];
    this.isEnrolDialogVisible = false
  }

  openEnrolDialog(course : CourseVM){
    this.enrolingCourse = course;
    this.isEnrolDialogVisible = true;
    console.log(this.enrolingCourse);
  }

  searchStudent(){
    this.isStudentGetting = true;
    let courseStudent : CourseStudentVM;
    this.courseStudent = [];
    console.log(this.enrolingCourse);
    

    this.subs.sink = this.studentServices.getStudentByScode(this.getScode.value).subscribe(data =>{
      if(data){
        this.searchedStudent = data.content;
        courseStudent = {
          course : this.enrolingCourse,
          student : this.searchedStudent
        }
        this.courseStudent.push(courseStudent);
        this.enrolmentForm.reset();
        this.isStudentGetting = false;
      }
    })
  }
  
  enrollCourses(){
    this.isLoading = true;
    let enrolment : EnrolmentVM;
    let enrolmentCourse :EnrolmentCourseVM[] = [];
    let e : EnrolmentCourseVM;
    let courseStudents : StudentCourseVM

    this.courseStudent.forEach(element => {
      e = {
        course : element.course,
        isActive : true
      }
      enrolmentCourse.push(e);
    });

    enrolment = {
      enrolmentCorseDTO : enrolmentCourse,
      student : this.searchedStudent
    }

    console.log(enrolment);

    this.subs.sink = this.enrolmentService.addEnrolment(enrolment).subscribe(data => {
      if(data){
        this.enrollments = data.content;
        this.activeStepIndex = this.activeStepIndex +1;
        this.enrolmentCourses.push(this.enrollments);
        courseStudents = {
          course : this.enrolingCourse,
          student : this.searchedStudent,
          enrolledDate : this.enrollments.date
        }
        this.courseStudents.push(courseStudents);
        this.activeStepIndex = 1;
        this.isLoading = false;
      }
    });
  }

  proceddPayment(){
    let todayMonth : number = this.today.getMonth() + 1;
    let classFee : ClassFeeVM;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let cfa : ClassFeeCourseVM;
    let month : MonthVM | undefined;
    
    this.months.forEach(element => {
      if(element.id == todayMonth){
        month = element;
      }
    });

    cf = {
      course : this.enrolingCourse,
      amount : this.enrolingCourse?.classFeeAmount,
      isAddmision : 0,
      month : month
    }
    classFeeCourses.push(cf);

    classFee = {
      classFeeCourse : classFeeCourses,
      student : this.searchedStudent
    }

    this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
      if(data && data.content && data.content.reciptNumber){
        let courseWiseMonths : courseWiseMonths[] = [];
        let name : string;
        let ammount : number;
        ammount = this.enrolingCourse?.classFeeAmount ? this.enrolingCourse?.classFeeAmount : 0;
        name = '('+ this.enrolingCourse?.code +') - ' + this.enrolingCourse?.teacher.fullName + '\'s ' + this.enrolingCourse?.grade.name + ' ' + this.enrolingCourse?.date + ' ' + this.enrolingCourse?.subject.name + ' Class at ' + this.enrolingCourse?.startTime;
        let courseWiseMonth : courseWiseMonths | undefined;
        let months : MonthVM[]=[];
        if(month){
          months.push(month)
        }

        courseWiseMonth = {
          course : this.enrolingCourse,
          courseAmount : this.enrolingCourse?.classFeeAmount,
          courseName : name,
          months : months
        }
        courseWiseMonths.push(courseWiseMonth);

        this.reciptTemplateData = {
          courseWiseMonths : courseWiseMonths,
          resiptNumber : data.content.reciptNumber,
          student : this.searchedStudent,
          subTotal : ammount
        }
        

        this.activeStepIndex = this.activeStepIndex + 1;
        
      }
    })
  }

  removeCourseStudent(courseStudent : CourseStudentVM){
    this.courseStudent = [];
  }

  deleteCourse(studentCourse : StudentCourseVM , course : CourseVM){
    let deletingEnrolment : EnrolmentCourseVM;
    let selectedEnrolment : EnrolmentCourseVM;
    let student : studentVM | undefined;
    student = studentCourse.student;
    let removeStudent : studentVM;
    let count : number = 0;
    this.enrolmentCourses.forEach(element => {
      if(element.course?.id === course.id && element.enrolment?.student?.id === studentCourse.student?.id && element.enrolment?.date === studentCourse.enrolledDate){
        selectedEnrolment = element
      }
      if(element.enrolment?.student?.id === studentCourse.student?.id){
        count = count + 1;
      }
    });

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isLoading = true;
        deletingEnrolment = {
          ...selectedEnrolment,
          isActive : false
        }
    
        this.subs.sink = this.subs.sink = this.enrolmentCourseService.deleteCourse(deletingEnrolment).subscribe(data =>{
          if(data){
            console.log("deleted");
            
            this.deletedEnrolment = data.content
            this.enrolmentCourses.forEach((element,index) => {
              if(element.id == course.id){
                this.enrolmentCourses.splice(index , 1);
              }
            });
            this.courseStudents = this.courseStudents.filter(el => !(el.course?.id === course.id && el.student?.id === studentCourse.student?.id &&  el.enrolledDate === studentCourse.enrolledDate));

            if(count <= 1){
              removeStudent = {
                ...student,
                isActive : false
              }
              this.subs.sink = this.studentServices.removeStudent(removeStudent).subscribe(data => {
                if(data){
                  console.log("Deleted" , data.content);
                }
              })
            }

            this.isLoading = false;
          }
        })
      }
    });
  }


}
