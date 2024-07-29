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
import { AttendanceService } from '../shared/services/attendance.service';
import { attendanceSearchVM } from '../shared/models/attendanceSearchVM';
import { studentWiseCoursesVM } from '../shared/models/studentWiseCourseVM';
import { ClassFeeCourseService } from '../shared/services/class-fee-course.service';
import { courseWiseClassFeeResponseVM } from '../shared/models/courseWiseClassFeeResponseVM';
import { courseWiseClassFeeVM } from '../shared/models/courseWiseClassFeeVM';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';

@Component({
  selector: 'app-manage-class-fee',
  templateUrl: './manage-class-fee.component.html',
  styleUrls: ['./manage-class-fee.component.css']
})
export class ManageClassFeeComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  appIconId : number = 9
  today = new Date();
  thisMonth : number = this.today.getMonth() + 1;
  thisYear : number = this.today.getFullYear();
  isLoading : boolean = false;
  selectedDataForm !: FormGroup
  payingMonthForm !: FormGroup
  classFeeForm !: FormGroup;
  allStudents : studentVM[] = [];
  allEnrolmentCourses : EnrolmentCourseVM[] = [];
  dropdownCourses : CourseVM[] = [];
  attendCountOnMonth : number[] = []
  isCourseDropdownVisible : boolean = false;
  allClassFees : ClassFeeVM[] = [];
  allCourses : CourseVM[]= [];
  months : MonthVM[] = [];
  payingCourseWiseMonths : courseWiseMonths[]=[];
  firstClassFees : courseWiseClassFeeVM[]=[];
  lastClassFees : courseWiseClassFeeVM[]=[];
  firstMonthId : number = -1;
  lastMonthId : number | undefined;
  studentClassFeesCourse : ClassFeeCourseVM[] = [];
  selectedStudent : studentVM | undefined;
  arrearsMonths : MonthVM[] = [];
  payableMonths : MonthVM[] = [];
  arrears : MonthVM[] = [];
  proceedClassFeePayment : ClassFeeVM | undefined;
  isMakePaymentPopupOpen : boolean = false;
  selectedCourses : CourseVM[] = []; 
  updatedCourses : CourseVM[] = []; 
  activeStepIndex : number = 0;
  selectedCourse!: CourseVM; 
  subTotal : number = 0;
  reciptTemplateData : reciptTemplateDataVM | undefined;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  test : any[] = [];

  steps = [
    { label: 'Payemnt' },
    { label: 'Recipt'}
  ];

  get getStudent(): AbstractControl { return this.selectedDataForm.get('student') as AbstractControl; }
  get getCourse(): AbstractControl { return this.selectedDataForm.get('course') as AbstractControl; }

  get getPayingMonths(): AbstractControl { return this.payingMonthForm.get('month') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }
 

  constructor(
    private formBuilder: FormBuilder,
    private courseService : CourseService,
    private enrolmentCourseService : EnrolmentCourseService,
    private studentServices : StudentService,
    private classFeeService : ClassFeeService,
    private classFeeCourseService : ClassFeeCourseService,
    private monthService : MonthService,
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData();
    this.subscriptions();
    this.buildForm();
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
        this.getAllClassFees()
        
      }
    })
  }

  getAllClassFees(){
    this.subs.sink = this.classFeeService.getStudentClassFees().subscribe(data =>{
      if(data){
        this.allClassFees = data.content;
        this.getAllCourses()
      }
    });
    
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
    this.selectedCourses = [];
    // this.isLoading = true;
    let selectedStudent : studentVM;
    let studentWiseCourses : studentWiseCoursesVM[] = [];
    let studentWiseCourse : studentWiseCoursesVM;

    this.selectedCourses = this.getCourse.value;
    
    this.allStudents.forEach(element => {
      if(element.scode === this.getStudent.value){
        selectedStudent = element;
        this.selectedStudent = selectedStudent
      }
    });

    this.selectedCourses.forEach(element => {
      studentWiseCourse = {
        course : element,
        student : selectedStudent
      }
      studentWiseCourses.push(studentWiseCourse);
      if(this.selectedCourses.length == studentWiseCourses.length){
        this.getfirstPaymentMonthClassFee(studentWiseCourses);
      }
    });
    
  }

  getfirstPaymentMonthClassFee(studentWiseCourses : studentWiseCoursesVM[]){
    this.firstClassFees = []

    this.subs.sink = this.classFeeCourseService.findFirstByStudentAndCourse(studentWiseCourses).subscribe(data =>{
      if(data && data.content){
        this.firstClassFees = data.content;
        if(this.firstClassFees.length == studentWiseCourses.length){
          this.getSecongPaymentMonthClassFee(studentWiseCourses)
        }
      }
    })
    
  }


  getSecongPaymentMonthClassFee(studentWiseCourses : studentWiseCoursesVM[]){
    this.lastClassFees = []

      this.subs.sink = this.classFeeCourseService.findLastByStudentAndCourse(studentWiseCourses).subscribe(data =>{
        if(data && data.content){
          this.lastClassFees = data.content;
          if(this.lastClassFees.length == studentWiseCourses.length){
            this.setStyleClassForEachCourse(studentWiseCourses);
          }
        }
      })
  }

  getPayableMonths(){
    this.arrearsMonths = []
    if(this.firstMonthId && this.lastMonthId){
      this.months.forEach(element => {
        let monthId : number = element.id? element.id : -1;
        if(this.lastMonthId != monthId && this.firstMonthId != monthId && this.lastMonthId && this.lastMonthId < monthId && this.thisMonth >= monthId){
          if(this.attendCountOnMonth[monthId - 1]>0){
            this.arrearsMonths.push(this.months[monthId - 1]);
          }
        }
      });
    }
    
  }

  getCourses(){
    this.isCourseDropdownVisible = false;
    this.dropdownCourses = [];
    this.getCourse.reset();
    let studentWiseEnrolmentCourses : EnrolmentCourseVM[] = [];
    studentWiseEnrolmentCourses = this.allEnrolmentCourses.filter(el => el.enrolment?.student?.scode === this.getStudent.value && el.isActive == true)

    
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

  getAttendCountOnMonth(){
    
    this.attendCountOnMonth = [];
    let searchAttend : attendanceSearchVM;
    let searchAttends : attendanceSearchVM[] = [];
    this.months.forEach(element => {
      searchAttend = {
        course : this.selectedCourse,
        student : this.selectedStudent,
        month : element,
        year : this.thisYear,
        isAttend : true
      }
      searchAttends.push(searchAttend);
    });

    // if(searchAttends.length>0){
    //   searchAttends.forEach(element => {
    //     this.subs.sink = this.attendanceService.getCountByCourseAndYearAndMonthAndDateAndStudent(element).subscribe(data =>{
    //     if(data && data.content){
    //       this.attendCountOnMonth.push(data.content);
    //       if(this.attendCountOnMonth.length == 12){
    //         this.getPayableMonths();
    //         this.isLoading = false;
    //       }
    //     }else{
    //       this.attendCountOnMonth.push(0);
    //       if(this.attendCountOnMonth.length == 12){
    //         this.getPayableMonths();
    //         this.isLoading = false;
    //       }
    //     }
    //   })
    //   });
    // }
  }

  // changeBackgroundColor(monthId : number = -1, courseId : number = -1) : string{
  //   if(this.firstClassFees && this.firstClassFees.length && this.lastClassFees && this.lastClassFees.length && this.selectedCourses && this.selectedCourses.length == this.firstClassFees.length && this.selectedCourses.length == this.lastClassFees.length){
  //     let firstClassFee = this.firstClassFees.find(el => el && el.course?.id == courseId);
  //   let lastClassFee = this.lastClassFees.find(el => el.course?.id == courseId);

  //   let firstClassFeeMonthId = firstClassFee?.month?.id ? firstClassFee?.month?.id : -1;
  //   let lastClassFeeMonthId = lastClassFee?.month?.id ? lastClassFee?.month?.id : -1;

  //   if(firstClassFeeMonthId == monthId){
  //     return 'green_background'
  //   }else if(firstClassFeeMonthId > monthId){
  //     return 'black_background'
  //   }else if(lastClassFeeMonthId == monthId){
  //     return 'green_background'
  //   }else if(firstClassFeeMonthId < monthId && lastClassFeeMonthId > monthId){
  //     return 'green_background'
  //   }else if(lastClassFeeMonthId != monthId && lastClassFeeMonthId < monthId && this.thisMonth == monthId){
  //     return 'red_background'
  //   }else {
  //     return 'empty_background'
  //   }
  //   }else {
  //     return ''
  //   }
    
  // }

  // testfun(){
  //   this.getCourse.valueChanges.subscribe(data => {
  //     if(data){
  //       console.log("උනෝඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕඕ");
        
  //     }
  //   })
  // }

  setStyleClassForEachCourse(studentWiseCourses : studentWiseCoursesVM[]){
    let c : CourseVM;
    let styleClasses : string[] = [];
    this.payingCourseWiseMonths = [];
    let arrears : MonthVM[] = [];
    this.arrears = []
    studentWiseCourses.forEach(element => {
      styleClasses = [];
      arrears = [];
      let course : CourseVM = element.course;
      let firstClassFee : ClassFeeCourseVM | undefined;
      let lastClassFee : ClassFeeCourseVM | undefined;
      let firstMonth : MonthVM | undefined;
      let lastMonth : MonthVM | undefined;

      firstClassFee = this.firstClassFees.find(el =>  el.course.id === course.id)?.classFeeCourse;
      lastClassFee = this.lastClassFees.find(el => el.course.id === course.id)?.classFeeCourse;

      firstMonth = firstClassFee?.month
      lastMonth = lastClassFee?.month

      this.months.forEach(month => {
        let monthId = month.id
        
        if(firstMonth?.id == monthId){
          styleClasses.push('green_background')
        }else if(firstMonth?.id && monthId && firstMonth?.id > monthId){
          styleClasses.push('black_background')
        }else if(lastMonth?.id == monthId){
          styleClasses.push('green_background')
        }else if(firstMonth?.id && monthId && lastMonth?.id && firstMonth?.id < monthId && lastMonth?.id > monthId){
          styleClasses.push('green_background')
        }else if(monthId && lastMonth?.id && lastMonth?.id != monthId && lastMonth?.id < monthId && this.thisMonth >= monthId){
          let m : MonthVM = {
            ...month,
            diabled : true
          }
          this.arrears.push(m);
          arrears.push(m);
          styleClasses.push('red_background')
        }else{
          styleClasses.push('empty_background')
        }
        
      });

      let cw : courseWiseMonths;
        let name : string;
        let ammount : number;
        name = '('+course.code+') - ' + course.teacher.fullName + '\'s ' + course.grade.name + ' ' + course.date + ' ' + course.subject.name + ' Class at ' + course.startTime;
        ammount = course.classFeeAmount;
        cw = {
          course : course,
          months : arrears,
          courseName : name,
          courseAmount : ammount
        }
        this.payingCourseWiseMonths.push(cw);
        
      c = {
        ...course,
        styleClassName : styleClasses
      }

      this.selectedCourses.forEach((element,index) => {
        if(course.id == element.id){
          this.updatedCourses[index] = c;
        }
      });
      // this.getCourse.patchValue(this.selectedCourses);
      // this.studentWiseCourses.forEach(element => {
        console.log("this.arrears",this.arrears);
        console.log("this.payingCourseWiseMonths",this.payingCourseWiseMonths);
        
        
        
      // });
      // this.studentAllData.splice(index,1,data.content);
    });
    
  }

  isMonthSelectableForPayment(course : CourseVM, month : MonthVM) : boolean{
    let classname : string = '';

    if(course && course.styleClassName && course.styleClassName.length >0 && month && month.id){
      classname = course.styleClassName[month.id -1];
    }
    console.log(classname);
    
    if(classname && (classname == "green_background" || classname == "black_background")){
      return false;
    }else{
      return true;
    }
  }

  isDisableMonth(month : MonthVM) : boolean{
    if(month.diabled){
      return true
    }else{
      return false
    }
  }
  canRemove(courseWiseMonths : courseWiseMonths, month : MonthVM) : boolean{
    let course : CourseVM | undefined;
    course = courseWiseMonths.course;
    if(course && course.styleClassName && month && month.id){
      if(course.styleClassName[month.id-1] == 'red_background'){
        return true
      }else{
        return false
      }
    }else {
      return false
    }
  }

  removeFromPayingList(courseWiseMonths : courseWiseMonths, month : MonthVM){
    let course : CourseVM | undefined;
    course = courseWiseMonths.course;
    let isDisableRemove : boolean = false;

    this.payingCourseWiseMonths.forEach((element,index) => {
      if(course && course.id && course.id == element.course?.id){
        let months : MonthVM[] = [];
        if(element.months && element.months.length>0){
          months = element.months
          months.forEach((ele,i) => {
            if(month && ele && ele.id && month.id && ele.id == month.id){
              months.splice(i,1);
            }
          });
        }
        this.payingCourseWiseMonths[index].months = months
      }
    });
  }

  findTotalAmount(): number{
    let total : number = 0;
    this.payingCourseWiseMonths.forEach(element => {
      let courseFee : number | undefined; 
      courseFee = element.course?.classFeeAmount;
      if(element.months){
        element.months.forEach(element => {
          if(courseFee){
            total = total + courseFee;
          }
        });
      }
    });
    this.subTotal = total;
    return total;
  }

  selectPyingMonths(month : MonthVM , course :CourseVM){
    console.log(course);
    
    let coursewisemonths : courseWiseMonths;
    let months : MonthVM[]=[];
    let index : number;


    if(this.payingCourseWiseMonths.filter(el => el && el.course && el.course.id && el.course.id == course.id).length > 0){
      months = [];
      let c : courseWiseMonths | undefined; 
      c= this.payingCourseWiseMonths.find(el => el && el.course && el.course.id && el.course.id == course.id);
      
      if(c?.months){
        if(!c.months.includes(month)){
          months = c.months
          months.push(month);
          index = this.payingCourseWiseMonths.indexOf(c);
        }else{
          months = c.months
          index = this.payingCourseWiseMonths.indexOf(c);
        }
      }else{
        months.push(month);
        index = 0;
      }

      coursewisemonths = {
        ...c,
        months : months
      }

      this.payingCourseWiseMonths.splice(index,1,coursewisemonths)

    }else{
      months = [];
      months.push(month);
      let name : string
      let ammount : number;
      name = '('+course.code+') - ' + course.teacher.fullName + '\'s ' + course.grade.name + ' ' + course.date + ' ' + course.subject.name + ' Class at ' + course.startTime;
      ammount = course.classFeeAmount
      coursewisemonths = {
        course : course,
        months : months,
        courseName : name,
        courseAmount : ammount
      }
      this.payingCourseWiseMonths.push(coursewisemonths);
    }
    
    console.log(this.payingCourseWiseMonths);
    
  }

  setClass(course : CourseVM , month : MonthVM) : string{
    
    if(course && month && course.styleClassName && course.styleClassName.length > 0 && month.id){
      return course.styleClassName[month.id - 1]
    }else{
      return "";
    }
  }

  openMakePaymentPopup(){
    this.payingCourseWiseMonths.forEach((element,index) => {
      if(!(element.months?.length && element.months.length>0)){
        this.payingCourseWiseMonths.splice(index,1);
      }
    });

    this.isMakePaymentPopupOpen = true;
    
  }

  // setPayableMonths(){
  //   let unique : number[] = [];
  //   this.payableMonths = [];
  //   this.arrears = [];

  //   if(this.arrearsMonths.length > 0){
  //     this.arrearsMonths.forEach(element => {
  //       if(element && element.id && !unique.includes(element.id)){
  //         unique.push(element.id)
  //       }
  //     });
  
  //     this.arrearsMonths = [];
  //     unique.forEach(element => {
  //       this.payableMonths.push(this.months[element - 1])
  //       this.arrears.push(this.months[element - 1])
  //     });

  //     this.months.forEach(element => {
  //       if(element && element.id && element.id > this.thisMonth){
  //         this.payableMonths.push(element)
  //       }
  //     });
  //   }else{
      
  //     this.months.forEach(element => {
  //       if(element && element.id && this.lastMonthId && element.id > this.lastMonthId){
  //         this.payableMonths.push(element)
  //       }
  //     });
  //   }
    
  // }

  proceddPayment(){
    this.isLoading = true;
    let classFee : ClassFeeVM | undefined;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let newlyPayedcourse : ClassFeeCourseVM;
    let newlyPayedMonth : MonthVM | undefined;
    let student : studentVM | undefined;

    student = this.allStudents.find(el => el.scode === this.getStudent.value);

    if(student){
      this.payingCourseWiseMonths.forEach(element => {
        if(element.months){
          element.months.forEach(month => {
            cf = {
              course : element.course,
              amount : element.course?.classFeeAmount,
              isAddmision : 0,
              month : month
            }
            classFeeCourses.push(cf);
          });
        }
      });
      classFee = {
        classFeeCourse : classFeeCourses,
        student : student
      }
    }
    if(classFee){
      this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
        if(data && data.content){
          console.log("data.content",data.content);
          this.proceedClassFeePayment = data.content;

          this.reciptTemplateData = {
            student : student,
            courseWiseMonths : this.payingCourseWiseMonths,
            resiptNumber : this.proceedClassFeePayment.reciptNumber,
            subTotal : this.subTotal
          }
          if(this.proceedClassFeePayment.classFeeCourse && this.proceedClassFeePayment.classFeeCourse.length>0){
            this.proceedClassFeePayment.classFeeCourse.forEach(element => {
              let monthId = element.month?.id;
              let course : CourseVM | undefined;
              course = this.updatedCourses.find(el => el.id == element.course?.id);
              if(course && course.styleClassName && course.styleClassName.length>0 && monthId){
                let index = this.updatedCourses.indexOf(course);
                course.styleClassName[monthId-1] = 'green_background'
                this.updatedCourses.splice(index,1,course);
              }
            });

            this.payingCourseWiseMonths = []
          }
          
          this.activeStepIndex = this.activeStepIndex + 1;
          this.isLoading = false;
        }
      })
    }
    
    // if(student){
    //   this.arrears.forEach(element => {
    //     cf = {
    //       course : this.selectedCourse,
    //       amount : this.selectedCourse.classFeeAmount,
    //       isAddmision : 0,
    //       month : element
    //     }
    //     classFeeCourses.push(cf);
    //   });

    //   classFee = {
    //     classFeeCourse : classFeeCourses,
    //     student : student
    //   }

    //   this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
    //     if(data && data.content && data.content.classFeeCourse){
    //       newlyPayedcourse = data.content.classFeeCourse[0];
    //       newlyPayedMonth = newlyPayedcourse.month;
    //       data.content.classFeeCourse.forEach(element => {
    //         if(element && element.month && element.month.id && newlyPayedMonth && newlyPayedMonth.id && element.month.id > newlyPayedMonth.id){
    //           newlyPayedMonth = element.month;
    //         }
    //       });
    //       this.lastMonthId = newlyPayedMonth?.id
    //       this.getPayableMonths();
    //       this.closeClassFeePaymentsPopup();
    //       this.isLoading = false;
    //     }
    //   })
  
    // }
    
  }

  closeClassFeePaymentsPopup(){
    this.activeStepIndex = 0
    this.isMakePaymentPopupOpen = false;
    this.classFeeForm.reset();
  }
}
