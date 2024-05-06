import { CourseVM } from "./coursesVM";
import { EnrolmentVM } from "./enrolmentVM";

export interface EnrolmentCourseVM{
    id ?: number;
    isActive ?: boolean;
    enrolment ?: EnrolmentVM;
    course ?: CourseVM;
}