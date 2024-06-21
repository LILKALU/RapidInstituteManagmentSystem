import { CourseVM } from "./coursesVM";

export interface courseWiseStudentCountVM{
    courseId ?: number;
    studentCount ?: number;
    course ?: CourseVM;
    color ?: string;
}