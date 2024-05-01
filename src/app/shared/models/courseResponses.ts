import { BaseResponse } from "./baseResponse";
import { CourseVM } from "./coursesVM";

export interface CourseResponses extends BaseResponse{
    content : CourseVM;
}