import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";
import { studentVM } from "./studentVM";

export interface attendanceSearchVM{
    course ?: CourseVM;
    month ?: MonthVM;
    year ?: number;
    date ?: number;
    student ?: studentVM;
    isAttend ?: boolean;
}