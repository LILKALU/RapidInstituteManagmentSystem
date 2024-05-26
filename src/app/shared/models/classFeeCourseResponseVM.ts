import { attendanceVM } from "./attendanceVM";
import { BaseResponse } from "./baseResponse";
import { ClassFeeCourseVM } from "./classFeeCourseVM";

export interface classFeeCourseResponseVM extends BaseResponse{
    content ?: ClassFeeCourseVM;
}