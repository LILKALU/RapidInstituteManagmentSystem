import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'subsink';
import { GradeService } from '../shared/services/grade.service';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { StudentService } from '../shared/services/student.service';
import { studentVM } from '../shared/models/studentVM';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { CourseVM } from '../shared/models/coursesVM';
import { ClassFeeVM } from '../shared/models/classFeeVM';
import { ClassFeeService } from '../shared/services/class-fee.service';
import { CourseService } from '../shared/services/course.service';
import { ClassFeeCourseVM } from '../shared/models/classFeeCourseVM';
import { MonthService } from '../shared/services/month.service';
import { MonthVM } from '../shared/models/monthVM';

@Component({
  selector: 'app-manage-class-fee',
  templateUrl: './manage-class-fee.component.html',
  styleUrls: ['./manage-class-fee.component.css']
})
export class ManageClassFeeComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  thisMonth : number = this.today.getMonth() + 1;
  isLoading : boolean = false;
  selectedDataForm !: FormGroup
  payingMonthForm !: FormGroup
  classFeeForm !: FormGroup;
  allStudents : studentVM[] = [];
  allEnrolmentCourses : EnrolmentCourseVM[] = [];
  dropdownCourses : CourseVM[] = [];
  isCourseDropdownVisible : boolean = false;
  allClassFees : ClassFeeVM[] = [];
  allCourses : CourseVM[]= [];
  months : MonthVM[] = [];
  firstMonthId : number = -1;
  lastMonthId : number | undefined;
  studentClassFeesCourse : ClassFeeCourseVM[] = [];
  arrearsMonths : MonthVM[] = [];
  payableMonths : MonthVM[] = [];
  arrears : MonthVM[] = [];
  isMakePaymentPopupOpen : boolean = false;
  selectedCourse!: CourseVM; 

  get getStudent(): AbstractControl { return this.selectedDataForm.get('student') as AbstractControl; }
  get getCourse(): AbstractControl { return this.selectedDataForm.get('course') as AbstractControl; }

  get getPayingMonths(): AbstractControl { return this.payingMonthForm.get('month') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }
 

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private courseService : CourseService,
    private enrolmentCourseService : EnrolmentCourseService,
    private studentServices : StudentService,
    private classFeeService : ClassFeeService,
    private monthService : MonthService,
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getStudents();
    this.buildForm();
  }

  buildForm(){
    this.selectedDataForm = this.formBuilder.group({
      student : ['',Validators.required],
      course : ['', Validators.required]
    })

    this.payingMonthForm = this.formBuilder.group({
      month : [null , Validators.required]
    })

    this.classFeeForm = this.formBuilder.group({
      hasPaymentDone:['',Validators.required]
    })
  }

  getStudents(){
    this.isLoading = true;
    this.subs.sink = this.studentServices.getStudent().subscribe(data =>{
      if(data){
        this.allStudents = data.content
        this.getEnrolmentCourses()
      }
    })
  }

  getEnrolmentCourses(){
    this.subs.sink = this.enrolmentCourseService.getEnrolmentCourse().subscribe(data =>{
      if(data){
        this.allEnrolmentCourses = data.content;
        console.log(this.allEnrolmentCourses);
        this.getAllClassFees()
        
      }
    })
  }

  getAllClassFees(){
    this.subs.sink = this.classFeeService.getStudentClassFees().subscribe(data =>{
      if(data){
        this.allClassFees = data.content;
        console.log("classfees" , this.allClassFees);
        this.getAllCourses()
      }
    });
    
  }

  getPayebleMonths(){
    this.arrears = this.getPayingMonths.value
  }

  getAllCourses(){
    this.subs.sink = this.courseService.getCourses().subscribe(data =>{
      if(data){
        this.allCourses = data.content;
        this.getAllMonths();
        
      }
    })
  }

  getAllMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data){
        this.months = data.content;
        this.isLoading = false;
      }
    })
  }

  getClassFees(){
    let selectedStudent : studentVM;
    let selectedCourse : CourseVM
    let lastElementId : number = -1;
    let studentWiseClassFees : ClassFeeVM[] =[];
    this.studentClassFeesCourse = [];
    this.firstMonthId = -1;
    this.lastMonthId = -1;
    this.isLoading = true;
    this.allStudents.forEach(element => {
      if(element.scode === this.getStudent.value){
        selectedStudent = element;
      }
    });

    this.allCourses.forEach(element => {
      if(element.code === this.getCourse.value){
        selectedCourse = element
        this.selectedCourse = selectedCourse;
      }
    });
    

    
    studentWiseClassFees = this.allClassFees.filter(el => el.student?.id === selectedStudent.id);
    console.log("studentWiseClassFees",studentWiseClassFees);
    
    studentWiseClassFees.forEach(el1 => {
      if(el1 && el1.classFeeCourse){
        el1.classFeeCourse.forEach(el2 => {
          if(el2.course?.id === selectedCourse.id){
            this.studentClassFeesCourse.push(el2);
          }
        });
      }
    });

    console.log("studentCourseClassFees",this.studentClassFeesCourse);
    lastElementId = this.studentClassFeesCourse.length - 1;
    let lstid : number = lastElementId ? lastElementId : 0;
    this.firstMonthId = this.studentClassFeesCourse[0].month?.id ? this.studentClassFeesCourse[0].month?.id : -1;
    this.lastMonthId = this.studentClassFeesCourse[lastElementId].month?.id ? this.studentClassFeesCourse[lastElementId].month?.id : -1;
    
    
    console.log("firstMonthId",this.firstMonthId);
    console.log("lastMonthId" , this.lastMonthId);
    
    this.getPayableMonths();
    this.isLoading = false;
  }

  getPayableMonths(){
    this.arrearsMonths = []
    if(this.firstMonthId && this.lastMonthId){
      this.months.forEach(element => {
        let monthId : number = element.id? element.id : -1;
        if(this.lastMonthId != monthId && this.firstMonthId != monthId && this.lastMonthId && this.lastMonthId < monthId && this.thisMonth >= monthId){
          this.arrearsMonths.push(this.months[monthId - 1]);
        }
      });
    }

    console.log("getPayableMonths arrearsMonths",this.arrearsMonths);
    
  }

  getCourses(){
    this.isCourseDropdownVisible = false;
    this.dropdownCourses = [];
    this.getCourse.reset();
    let studentWiseEnrolmentCourses : EnrolmentCourseVM[] = [];

    console.log(this.getStudent.value);
    studentWiseEnrolmentCourses = this.allEnrolmentCourses.filter(el => el.enrolment?.student?.scode === this.getStudent.value && el.isActive == true)
    console.log(studentWiseEnrolmentCourses);
    
    studentWiseEnrolmentCourses.forEach(element => {
      if(element && element.course){
        this.dropdownCourses.push(element.course)
      }
    });

    if(this.dropdownCourses.length > 0){
      this.isCourseDropdownVisible = true;
    }else{
      this.isCourseDropdownVisible = false;
    }

  }

  changeBackgroundColor(monthId : number = -1) : string{
    if(this.firstMonthId && this.firstMonthId === monthId){
      return 'green_background';
    }else if(this.firstMonthId > monthId){
      return 'black_background'
    }else if (this.lastMonthId == monthId){
      return 'green_background'
    }else if (this.firstMonthId < monthId && this.lastMonthId && this.lastMonthId > monthId){
      return 'green_background'
    }else if (this.lastMonthId != monthId && this.lastMonthId && this.lastMonthId < monthId && this.thisMonth >= monthId){
      return 'red_background'
    }else{
      return 'empty_background'
    }
    
  }

  openMakePaymentPopup(){
    this.setPayableMonths();
    if(this.arrears){
      this.arrears.forEach(element => {
        element.diabled = true;
      });
      this.getPayingMonths.patchValue(this.arrears);
    }
    this.isMakePaymentPopupOpen = true;
    console.log(this.arrears);
    
  }

  setPayableMonths(){
    let unique : number[] = [];
    this.payableMonths = [];
    this.arrears = [];

    if(this.arrearsMonths.length > 0){
      this.arrearsMonths.forEach(element => {
        if(element && element.id && !unique.includes(element.id)){
          unique.push(element.id)
        }
      });
  
      this.arrearsMonths = [];
      unique.forEach(element => {
        this.payableMonths.push(this.months[element - 1])
        this.arrears.push(this.months[element - 1])
      });
  
      console.log("months",this.months);
      
      console.log(this.payableMonths);
      this.months.forEach(element => {
        if(element && element.id && element.id > this.thisMonth){
          this.payableMonths.push(element)
        }
      });
      console.log(this.payableMonths);
      console.log("arrears",this.arrears);
    }else{
      
      this.months.forEach(element => {
        if(element && element.id && this.lastMonthId && element.id > this.lastMonthId){
          this.payableMonths.push(element)
        }
      });
    }
    
  }

  calculateTotal(): number{
    let total : number = 0;
    this.arrears.forEach(element => {
      total = total + this.selectedCourse.classFeeAmount
    });
    return total;
  }

  proceddPayment(){
    this.isLoading = true;
    let classFee : ClassFeeVM;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let newlyPayedcourse : ClassFeeCourseVM;
    let newlyPayedMonth : MonthVM | undefined;
    let student : studentVM | undefined;

    student = this.allStudents.find(el => el.scode === this.getStudent.value);
    if(student){
      this.arrears.forEach(element => {
        cf = {
          course : this.selectedCourse,
          amount : this.selectedCourse.classFeeAmount,
          isAddmision : 0,
          month : element
        }
        classFeeCourses.push(cf);
      });

      classFee = {
        classFeeCourse : classFeeCourses,
        student : student
      }

      this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
        if(data && data.content && data.content.classFeeCourse){
          console.log(data);
          newlyPayedcourse = data.content.classFeeCourse[0];
          newlyPayedMonth = newlyPayedcourse.month;
          data.content.classFeeCourse.forEach(element => {
            if(element && element.month && element.month.id && newlyPayedMonth && newlyPayedMonth.id && element.month.id > newlyPayedMonth.id){
              newlyPayedMonth = element.month;
            }
          });
          this.lastMonthId = newlyPayedMonth?.id
          this.getPayableMonths();
          this.closeClassFeePaymentsPopup();
          this.isLoading = false;
        }
      })
  
      console.log(this.getStudent.value);
    }
    
  }

  closeClassFeePaymentsPopup(){
    this.getPayableMonths();
    this.isMakePaymentPopupOpen = false;
  }
}
