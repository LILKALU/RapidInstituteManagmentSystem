import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";
import { teacherPayemntVM } from "./teacherPaymentVM";

export interface teacherPaymentCourseVM{
    id ?: number;
    course ?: CourseVM;
    teacherPayment ?: teacherPayemntVM;
    amount ?: number;
    month ?:MonthVM
}