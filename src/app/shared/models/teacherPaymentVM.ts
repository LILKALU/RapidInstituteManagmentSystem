import { teacherPaymentCourseVM } from "./teacherPaymentCourseVM";
import { teacherVM } from "./teachersVM";

export interface teacherPayemntVM{
    id ?: number;
    date ?: string;
    teacher ?: teacherVM;
    reciptNumber ?: string;
    teacherPaymentCourse ?: teacherPaymentCourseVM[];
}