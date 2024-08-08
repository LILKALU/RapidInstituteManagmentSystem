import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { attendanceVM } from '../models/attendanceVM';
import { attendancesResponseVM } from '../models/attendancesResponseVM';
import { countResponseVM } from '../models/countResponseVM';
import { Observable } from 'rxjs';
import { CourseVM } from '../models/coursesVM';
import { attendanceSearchVM } from '../models/attendanceSearchVM';
import { attendanceCountByMonthAndCourseResponseVM } from '../models/attendanceCountByMonthAndCourseResponseVM';
import { courseWiseMonthsWithStudentVM } from '../models/courseWiseMonthsWithStudentVM';
import { courseWiseMonthsWithStudentResponseVM } from '../models/courseWiseMonthWithStudentResponseVM';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = "http://localhost:8080/api/v1/attendancectrl";

  markAttendance(attendances : attendanceVM[]) : Observable<attendancesResponseVM>{
    return this.httpClient.post<attendancesResponseVM>(`${this.BaseURL}/markattendance`,attendances);
  }

  getAttendanceByCourse(attendanceSearch : attendanceSearchVM) : Observable<attendancesResponseVM>{
    return this.httpClient.post<attendancesResponseVM>(`${this.BaseURL}/getattendancebycourseanddate`,attendanceSearch)
  }

  getAttendanceByCourseAndYearAndMonth(attendanceSearch : attendanceSearchVM) : Observable<attendancesResponseVM>{
    return this.httpClient.post<attendancesResponseVM>(`${this.BaseURL}/getattendancebycourseandyearandmonth`,attendanceSearch)
  }

  updateAttendance(attendances : attendanceVM[]) : Observable<attendancesResponseVM>{
    return this.httpClient.put<attendancesResponseVM>(`${this.BaseURL}/updateattendance`,attendances);
  }

  getCountByCourseAndYearAndMonthAndDateAndStudent(attendanceSearch : attendanceSearchVM): Observable<countResponseVM>{
    return this.httpClient.post<countResponseVM>(`${this.BaseURL}/getcountbycourseandyearandmonthandstudent`,attendanceSearch);
  }

  getAttendanceCountByMonthAndCourse(year : number): Observable<attendanceCountByMonthAndCourseResponseVM>{
    return this.httpClient.get<attendanceCountByMonthAndCourseResponseVM>(`${this.BaseURL}/getattendancecountbymonthandcourse/${year}`,);
  }

  removeUnAttendMonth(courseWiseMonthsWithStudent : courseWiseMonthsWithStudentVM) : Observable<courseWiseMonthsWithStudentResponseVM> {
    return this.httpClient.post<courseWiseMonthsWithStudentResponseVM>(`${this.BaseURL}/removeunattendmonths`,courseWiseMonthsWithStudent);
  }
}
