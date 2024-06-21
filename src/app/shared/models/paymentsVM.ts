import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";
import { teacherPaymentCourseVM } from "./teacherPaymentCourseVM";
import { teacherVM } from "./teachersVM";

export interface paymentsVM{
    id ?: number;
    date ?: string;
    teacher ?: teacherVM;
    reciptNumber ?: string;
    course ?: CourseVM;
    amount ?: number;
    month ?:MonthVM
}