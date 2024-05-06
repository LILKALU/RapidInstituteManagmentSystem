import { BaseResponse } from "./baseResponse";
import { EnrolmentCourseVM } from "./enrolmentCourse";

export interface EnrolmentsCoursesResponse extends BaseResponse{
    content : EnrolmentCourseVM[];
}