import { CourseVM } from "./coursesVM";

export interface courseWisePaymentVM {
    courseId ?: number;
    course ?: CourseVM;
    studentCount ?: number;
    amount ?: number;
    isPayed : boolean;

}