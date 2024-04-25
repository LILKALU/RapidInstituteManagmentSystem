import { BaseResponse } from "./baseResponse";
import { CourseVM } from "./coursesVM";

export interface CourseResponse extends BaseResponse{
    content : CourseVM[];
}