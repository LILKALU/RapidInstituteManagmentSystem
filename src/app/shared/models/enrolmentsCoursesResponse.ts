import { BaseResponse } from "./baseResponse";
import { EnrolmentCourseVM } from "./enrolmentCourse";

export interface EnrolmentsCourseResponse extends BaseResponse{
    content : EnrolmentCourseVM;
}