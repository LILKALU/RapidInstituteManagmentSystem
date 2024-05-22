import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";

export interface attendanceSearchVM{
    course ?: CourseVM;
    month ?: MonthVM;
    year ?: number;
    date ?: number;
}