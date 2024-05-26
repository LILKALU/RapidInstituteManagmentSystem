import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";

export interface courseWiseMonths{
    course ?: CourseVM;
    courseName ?: string;
    courseAmount ?: number;
    months ?: MonthVM[];
}