import { courseWiseMonths } from "./courseWiseMonthsVM";
import { studentVM } from "./studentVM";

export interface courseWiseMonthsWithStudentVM{
    payingCourseWiseMonths ?: courseWiseMonths[]
    student ?: studentVM;
    thisMonthId ?: number
}