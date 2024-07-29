import { attendanceCountByMonthAndCourseVM } from "./attendanceCountByMonthAndCourseVM";
import { BaseResponse } from "./baseResponse";

export interface attendanceCountByMonthAndCourseResponseVM extends BaseResponse{
    content ?: attendanceCountByMonthAndCourseVM[];
}